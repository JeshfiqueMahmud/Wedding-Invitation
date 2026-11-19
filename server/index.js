import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { query, pool } from './db.js';
import { uploadImage, removeImage, ALLOWED_TYPES } from './storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 5000;

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for correct client IPs

// --------------------------------------------------------------------------
// CORS — only the GitHub Pages site (and localhost while developing) may call the API.
// ALLOWED_ORIGINS is a comma-separated list of origins (scheme + host, no path).
// --------------------------------------------------------------------------
const DEFAULT_ORIGINS = ['https://jeshfiquemahmud.github.io'];
const DEV_ORIGINS = ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:5000', 'http://127.0.0.1:5173'];
const allowedOrigins = new Set([
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/\/$/, '')) : DEFAULT_ORIGINS),
  ...(IS_PROD ? [] : DEV_ORIGINS)
]);

app.use(
  cors({
    origin(origin, cb) {
      // Requests with no Origin (curl, Render health checks, same-origin) are allowed through.
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      console.warn(`🚫 CORS blocked request from ${origin}`);
      return cb(null, false);
    },
    allowedHeaders: ['Content-Type', 'x-admin-password'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    maxAge: 86400
  })
);
app.use(express.json({ limit: '100kb' }));

// --------------------------------------------------------------------------
// ADMIN PROTECTION
// ADMIN_PASSWORD lives only on the server. Locally it falls back to "2026";
// in production an unset password locks every admin route.
// --------------------------------------------------------------------------
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || (IS_PROD ? '' : '2026');
if (!ADMIN_PASSWORD) console.warn('⚠️ ADMIN_PASSWORD is not set — the organizer dashboard is locked.');

const failedAttempts = new Map(); // ip -> { count, until }
const MAX_FAILS = 8;
const LOCK_MS = 15 * 60 * 1000;

function passwordMatches(given) {
  if (!ADMIN_PASSWORD || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req, res, next) {
  const ip = req.ip;
  const entry = failedAttempts.get(ip);
  if (entry && entry.until > Date.now()) {
    return res.status(429).json({ error: 'Too many wrong attempts. Try again in 15 minutes.' });
  }
  if (passwordMatches(req.get('x-admin-password'))) {
    failedAttempts.delete(ip);
    return next();
  }
  const count = (entry?.count || 0) + 1;
  failedAttempts.set(ip, { count, until: count >= MAX_FAILS ? Date.now() + LOCK_MS : 0 });
  return res.status(401).json({ error: 'Incorrect password' });
}

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const ATTENDANCE = new Set(['both', 'holud', 'reception', 'unable']);

// --------------------------------------------------------------------------
// 1. HEALTH CHECK (also used to wake the server from sleep)
// --------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    await query('select 1');
    res.json({ status: 'ok', database: 'postgres', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.post('/api/admin/verify', requireAdmin, (req, res) => res.json({ ok: true }));

// --------------------------------------------------------------------------
// 2. RSVP ENDPOINTS
// --------------------------------------------------------------------------
app.get('/api/rsvps', requireAdmin, async (req, res) => {
  try {
    res.json(await query('select * from rsvps order by id desc'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve RSVPs: ' + err.message });
  }
});

app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, phone, email, attendance = 'both', guests_count = 1, dietary, message } = req.body || {};
    if (!clean(name)) return res.status(400).json({ error: 'Name is required' });
    if (!ATTENDANCE.has(attendance)) return res.status(400).json({ error: 'Please choose which events you will attend' });
    const count = Math.min(50, Math.max(1, parseInt(guests_count, 10) || 1));

    const [entry] = await query(
      `insert into rsvps (name, phone, email, attendance, guests_count, dietary, message)
       values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      [clean(name, 120), clean(phone, 40), clean(email, 160), attendance, count, clean(dietary, 300), clean(message, 1000)]
    );
    res.status(201).json({ success: true, id: entry.id, message: 'RSVP confirmed successfully!', entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save RSVP: ' + err.message });
  }
});

app.delete('/api/rsvp/:id', requireAdmin, async (req, res) => {
  try {
    await query('delete from rsvps where id = $1', [req.params.id]);
    res.json({ success: true, message: `RSVP #${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete RSVP: ' + err.message });
  }
});

app.get('/api/stats', requireAdmin, async (req, res) => {
  try {
    const all = await query('select attendance, guests_count from rsvps');
    const b = { both: [0, 0], holud: [0, 0], reception: [0, 0], unable: [0, 0] };
    let totalGuests = 0;
    for (const r of all) {
      const g = Number(r.guests_count) || 1;
      const slot = b[r.attendance];
      if (!slot) continue;
      slot[0]++;
      if (r.attendance !== 'unable') {
        slot[1] += g;
        totalGuests += g;
      }
    }
    res.json({
      total_submissions: all.length,
      total_confirmed_guests: totalGuests,
      breakdown: {
        both: { submissions: b.both[0], guests: b.both[1] },
        holud_only: { submissions: b.holud[0], guests: b.holud[1] },
        reception_only: { submissions: b.reception[0], guests: b.reception[1] },
        unable: { submissions: b.unable[0] }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats: ' + err.message });
  }
});

app.get('/api/export-rsvps', requireAdmin, async (req, res) => {
  try {
    const rows = await query('select * from rsvps order by id asc');
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Attendance', 'Guests Count', 'Dietary Preferences', 'Message', 'Submission Date'];
    // Quote every text cell; prefix formula-looking values so spreadsheets don't execute them.
    const esc = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const lines = [headers.join(',')];
    for (const r of rows) {
      const date = r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at;
      lines.push([r.id, esc(r.name), esc(r.phone), esc(r.email), esc(r.attendance), r.guests_count, esc(r.dietary), esc(r.message), esc(date)].join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Jeshfique_Tamanna_Wedding_RSVP_List.csv"');
    res.send('﻿' + lines.join('\r\n'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV: ' + err.message });
  }
});

// --------------------------------------------------------------------------
// 3. GUESTBOOK ENDPOINTS
// --------------------------------------------------------------------------
app.get('/api/guestbook', async (req, res) => {
  try {
    res.json(await query('select * from guestbook_messages order by id desc limit 300'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve guestbook: ' + err.message });
  }
});

app.post('/api/guestbook', async (req, res) => {
  try {
    const name = clean(req.body?.name, 120);
    const message = clean(req.body?.message, 1000);
    if (!name || !message) return res.status(400).json({ error: 'Name and message are required' });
    const [entry] = await query('insert into guestbook_messages (name, message) values ($1, $2) returning *', [name, message]);
    res.status(201).json({ success: true, id: entry.id, entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit wish: ' + err.message });
  }
});

app.post('/api/guestbook/:id/like', async (req, res) => {
  try {
    const rows = await query('update guestbook_messages set likes = likes + 1 where id = $1 returning likes', [req.params.id]);
    res.json({ success: true, likes: rows[0]?.likes || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like message: ' + err.message });
  }
});

// --------------------------------------------------------------------------
// 4. SITE IMAGES (Supabase Storage + images table)
// --------------------------------------------------------------------------
app.get('/api/images', async (req, res) => {
  try {
    res.json(await query('select * from images order by section, sort_order, id'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load images: ' + err.message });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    // Some tools send .webp/.avif as "application/octet-stream"; fall back to the extension.
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      const byExt = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };
      const guessed = file.mimetype === 'application/octet-stream' && byExt[path.extname(file.originalname || '').toLowerCase()];
      if (guessed) file.mimetype = guessed;
    }
    return ALLOWED_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed'));
  }
});

/**
 * Create or replace the photo in a slot.
 * multipart/form-data fields: key (required), section, title, subtitle, sort_order, file (image).
 * A file is required for a new slot; for an existing slot it is optional (captions-only update).
 */
app.post('/api/admin/images', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const key = clean(req.body.key, 80).toLowerCase();
    if (!/^[a-z0-9-]+$/.test(key)) return res.status(400).json({ error: 'key must use only letters, numbers and dashes' });

    const [existing] = await query('select * from images where key = $1', [key]);
    if (!existing && !req.file) return res.status(400).json({ error: 'Choose a photo to upload' });

    const section = clean(req.body.section, 40) || existing?.section || (key === 'couple' ? 'blessing' : 'gallery');
    const title = req.body.title !== undefined ? clean(req.body.title, 120) : existing?.title || '';
    const subtitle = req.body.subtitle !== undefined ? clean(req.body.subtitle, 120) : existing?.subtitle || '';
    let sortOrder = parseInt(req.body.sort_order, 10);
    if (Number.isNaN(sortOrder)) {
      if (existing) sortOrder = existing.sort_order;
      else {
        const [{ next }] = await query('select coalesce(max(sort_order), 0) + 1 as next from images where section = $1', [section]);
        sortOrder = Number(next);
      }
    }

    let url = existing?.url;
    let filePath = existing?.path;
    if (req.file) {
      ({ url, path: filePath } = await uploadImage({ buffer: req.file.buffer, contentType: req.file.mimetype, folder: section, key }));
    }

    const [row] = await query(
      `insert into images (key, section, title, subtitle, url, path, sort_order)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (key) do update set
         section = excluded.section, title = excluded.title, subtitle = excluded.subtitle,
         url = excluded.url, path = excluded.path, sort_order = excluded.sort_order, updated_at = now()
       returning *`,
      [key, section, title, subtitle, url, filePath, sortOrder]
    );

    // Old file is removed only after the database points at the new one.
    if (req.file && existing?.path && existing.path !== filePath) await removeImage(existing.path);
    res.status(existing ? 200 : 201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/images/:key', requireAdmin, async (req, res) => {
  try {
    const [row] = await query('delete from images where key = $1 returning *', [req.params.key]);
    if (!row) return res.status(404).json({ error: 'No photo with that key' });
    await removeImage(row.path);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// Local convenience: serve the built site and bundled photos when present.
// (In production the site itself is on GitHub Pages; this server is API-only.)
// --------------------------------------------------------------------------
app.use('/photos', express.static(path.join(__dirname, '..', 'public', 'photos')));
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/photos')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Errors from multer (file too large / wrong type) and anything else uncaught
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err instanceof multer.MulterError ? 400 : 500;
  const message = err.code === 'LIMIT_FILE_SIZE' ? 'Photo is larger than 8 MB' : err.message;
  res.status(status).json({ error: message });
});

// --------------------------------------------------------------------------
// Start
// --------------------------------------------------------------------------
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🕌 Wedding API running on port ${port}`);
    console.log(`   CORS allowed: ${[...allowedOrigins].join(', ')}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !IS_PROD) {
      console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}…`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);

const shutdown = () => pool?.end().finally(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { querySql, execSql, getDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static public assets like photos
app.use('/photos', express.static(path.join(__dirname, '..', 'public', 'photos')));

// --------------------------------------------------------------------------
// 1. HEALTH CHECK
// --------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    await getDb();
    res.json({ status: 'ok', database: 'SQLite (wedding.db)', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// --------------------------------------------------------------------------
// 2. RSVP ENDPOINTS
// --------------------------------------------------------------------------

// Get all RSVPs
app.get('/api/rsvps', async (req, res) => {
  try {
    const rows = await querySql('SELECT * FROM rsvps ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve RSVPs: ' + err.message });
  }
});

// Submit a new RSVP
app.post('/api/rsvp', async (req, res) => {
  try {
    const { name, phone = '', email = '', attendance = 'both', guests_count = 1, dietary = '', message = '' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const countNum = Math.max(1, parseInt(guests_count, 10) || 1);
    const createdAt = new Date().toISOString();

    await execSql(
      'INSERT INTO rsvps (name, phone, email, attendance, guests_count, dietary, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), phone.trim(), email.trim(), attendance, countNum, dietary.trim(), message.trim(), createdAt]
    );

    // Get the newly inserted ID
    const inserted = await querySql('SELECT last_insert_rowid() as id');
    const newId = inserted[0]?.id;

    res.status(201).json({
      success: true,
      id: newId,
      message: 'RSVP confirmed successfully!',
      entry: {
        id: newId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        attendance,
        guests_count: countNum,
        dietary: dietary.trim(),
        message: message.trim(),
        created_at: createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save RSVP: ' + err.message });
  }
});

// Delete an RSVP (Admin)
app.delete('/api/rsvp/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await execSql('DELETE FROM rsvps WHERE id = ?', [id]);
    res.json({ success: true, message: `RSVP #${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete RSVP: ' + err.message });
  }
});

// Get RSVP Summary Stats for Dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const all = await querySql('SELECT * FROM rsvps');
    
    let totalGuests = 0;
    let bothCount = 0;
    let bothGuests = 0;
    let holudCount = 0;
    let holudGuests = 0;
    let receptionCount = 0;
    let receptionGuests = 0;
    let unableCount = 0;

    for (const r of all) {
      const g = parseInt(r.guests_count, 10) || 1;
      if (r.attendance === 'both') {
        bothCount++;
        bothGuests += g;
        totalGuests += g;
      } else if (r.attendance === 'holud') {
        holudCount++;
        holudGuests += g;
        totalGuests += g;
      } else if (r.attendance === 'reception') {
        receptionCount++;
        receptionGuests += g;
        totalGuests += g;
      } else if (r.attendance === 'unable') {
        unableCount++;
      }
    }

    res.json({
      total_submissions: all.length,
      total_confirmed_guests: totalGuests,
      breakdown: {
        both: { submissions: bothCount, guests: bothGuests },
        holud_only: { submissions: holudCount, guests: holudGuests },
        reception_only: { submissions: receptionCount, guests: receptionGuests },
        unable: { submissions: unableCount }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats: ' + err.message });
  }
});

// CSV Export for Organizers & Caterers
app.get('/api/export-rsvps', async (req, res) => {
  try {
    const rows = await querySql('SELECT * FROM rsvps ORDER BY id ASC');

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Attendance', 'Guests Count', 'Dietary Preferences', 'Message', 'Submission Date'];
    const csvLines = [headers.join(',')];

    for (const r of rows) {
      const escape = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
      csvLines.push([
        r.id,
        escape(r.name),
        escape(r.phone),
        escape(r.email),
        escape(r.attendance),
        r.guests_count,
        escape(r.dietary),
        escape(r.message),
        escape(r.created_at)
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Jeshfique_Faheema_Wedding_RSVP_List.csv"');
    res.send(csvLines.join('\r\n'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV: ' + err.message });
  }
});

// --------------------------------------------------------------------------
// 3. GUESTBOOK ENDPOINTS
// --------------------------------------------------------------------------

// Get all wishes
app.get('/api/guestbook', async (req, res) => {
  try {
    const rows = await querySql('SELECT * FROM guestbook_messages ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve guestbook: ' + err.message });
  }
});

// Post a wish
app.post('/api/guestbook', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const createdAt = new Date().toISOString();
    await execSql(
      'INSERT INTO guestbook_messages (name, message, likes, created_at) VALUES (?, ?, 0, ?)',
      [name.trim(), message.trim(), createdAt]
    );

    const inserted = await querySql('SELECT last_insert_rowid() as id');
    const newId = inserted[0]?.id;

    res.status(201).json({
      success: true,
      id: newId,
      entry: {
        id: newId,
        name: name.trim(),
        message: message.trim(),
        likes: 0,
        created_at: createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit wish: ' + err.message });
  }
});

// Upvote / Like a wish
app.post('/api/guestbook/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    await execSql('UPDATE guestbook_messages SET likes = likes + 1 WHERE id = ?', [id]);
    const updated = await querySql('SELECT likes FROM guestbook_messages WHERE id = ?', [id]);
    res.json({ success: true, likes: updated[0]?.likes || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like message: ' + err.message });
  }
});

// Serve static production build if it exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/photos')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Express Server with auto port fallback if port is in use
function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`🕌 Royal Wedding Backend Server running at http://localhost:${portToTry}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is already in use, trying port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

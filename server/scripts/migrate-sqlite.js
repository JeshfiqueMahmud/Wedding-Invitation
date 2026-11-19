/*
 * Copies RSVPs and guestbook wishes from the old local SQLite file (server/wedding.db)
 * into Supabase Postgres. Rows already present (same name + created time / same wish text)
 * are skipped, so it is safe to run more than once.
 *
 *   npm run db:migrate-sqlite
 *   npm run db:migrate-sqlite -- --skip-samples   # leave out the 3 demo RSVPs
 *
 * Needs DATABASE_URL in your local .env and the sql.js dev dependency.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';
import { query, pool } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const DB_FILE = process.env.SQLITE_PATH || path.join(ROOT, 'server', 'wedding.db');
const SAMPLE_EMAILS = new Set(['rafiqul@example.com', 'arman.s@example.com', 'nazia.rahman@example.com']);
const skipSamples = process.argv.includes('--skip-samples');

if (!fs.existsSync(DB_FILE)) {
  console.log(`No SQLite file at ${DB_FILE} — nothing to migrate.`);
  process.exit(0);
}

const SQL = await initSqlJs({ wasmBinary: fs.readFileSync(path.join(ROOT, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')) });
const sqlite = new SQL.Database(fs.readFileSync(DB_FILE));

function readAll(table) {
  try {
    const stmt = sqlite.prepare(`SELECT * FROM ${table} ORDER BY id`);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  } catch {
    return [];
  }
}

try {
  let rsvpCount = 0;
  for (const r of readAll('rsvps')) {
    if (skipSamples && SAMPLE_EMAILS.has(r.email)) continue;
    const attendance = ['both', 'holud', 'reception', 'unable'].includes(r.attendance) ? r.attendance : 'both';
    const res = await query(
      `insert into rsvps (name, phone, email, attendance, guests_count, dietary, message, created_at)
       select $1, $2, $3, $4, $5, $6, $7, $8
       where not exists (select 1 from rsvps where name = $1 and created_at = $8::timestamptz)
       returning id`,
      [r.name, r.phone || '', r.email || '', attendance, Math.max(1, Number(r.guests_count) || 1), r.dietary || '', r.message || '', r.created_at]
    );
    rsvpCount += res.length;
  }

  let wishCount = 0;
  for (const w of readAll('guestbook_messages')) {
    const res = await query(
      `insert into guestbook_messages (name, message, likes, created_at)
       select $1, $2, $3, $4
       where not exists (select 1 from guestbook_messages where name = $1 and message = $2)
       returning id`,
      [w.name, w.message, Number(w.likes) || 0, w.created_at]
    );
    wishCount += res.length;
  }

  console.log(`✅ Copied ${rsvpCount} RSVP(s) and ${wishCount} wish(es) into Supabase.`);
} catch (err) {
  console.error('❌', err.message);
  process.exitCode = 1;
} finally {
  await pool?.end();
}

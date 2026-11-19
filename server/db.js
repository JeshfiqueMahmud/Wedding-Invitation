import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'wedding.db');
const WASM_FILE = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');

let db = null;

export async function getDb() {
  if (db) return db;

  const wasmBinary = fs.readFileSync(WASM_FILE);
  const SQL = await initSqlJs({
    wasmBinary
  });

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
      console.log('✅ Loaded existing SQLite database from', DB_FILE);
    } catch (err) {
      console.error('⚠️ Could not read existing DB, creating a new database:', err.message);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
    console.log('✨ Created new SQLite database file at', DB_FILE);
  }

  // Create tables if they do not exist
  db.run(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      attendance TEXT NOT NULL,
      guests_count INTEGER DEFAULT 1,
      dietary TEXT,
      message TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS guestbook_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Seed sample initial wishes in guestbook if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM guestbook_messages');
  let count = 0;
  if (countStmt.step()) {
    count = countStmt.getAsObject().count;
  }
  countStmt.free();

  if (count === 0) {
    const initialWishes = [
      {
        name: 'Family & Friends, Dhaka',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fee khair! Wishing Jeshfique and Faheema a lifetime of peace, love, and endless barakah.',
        likes: 18,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        name: 'Tanzim & Rashida',
        message: 'Heartiest congratulations to the most gorgeous couple! Can\'t wait to dance at the Holud and celebrate you both in Dhaka!',
        likes: 12,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        name: 'Ahmed Zubair & Family',
        message: 'May Allah shower your home with everlasting happiness and prosperity. Hearty congratulations, brother Jeshfique!',
        likes: 9,
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];

    const insertStmt = db.prepare(
      'INSERT INTO guestbook_messages (name, message, likes, created_at) VALUES (?, ?, ?, ?)'
    );
    for (const wish of initialWishes) {
      insertStmt.run([wish.name, wish.message, wish.likes, wish.created_at]);
    }
    insertStmt.free();
    saveDb();
  }

  // Check initial RSVPs
  const rsvpCountStmt = db.prepare('SELECT COUNT(*) as count FROM rsvps');
  let rsvpCount = 0;
  if (rsvpCountStmt.step()) {
    rsvpCount = rsvpCountStmt.getAsObject().count;
  }
  rsvpCountStmt.free();

  if (rsvpCount === 0) {
    const initialRsvps = [
      {
        name: 'Dr. Rafiqul Islam & Family',
        phone: '+880 1711 000111',
        email: 'rafiqul@example.com',
        attendance: 'both',
        guests_count: 3,
        dietary: 'Halal, No spicy for kids',
        message: 'Extremely honored to join both beautiful nights.',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        name: 'Syed Arman Farhad',
        phone: '+880 1819 222333',
        email: 'arman.s@example.com',
        attendance: 'holud',
        guests_count: 2,
        dietary: 'None',
        message: 'Ready for yellow vibes and songs!',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        name: 'Nazia Rahman',
        phone: '+880 1912 444555',
        email: 'nazia.rahman@example.com',
        attendance: 'reception',
        guests_count: 2,
        dietary: 'Vegetarian for 1 guest',
        message: 'Looking forward to celebrating at SKS Hall.',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];

    const rsvpInsert = db.prepare(
      'INSERT INTO rsvps (name, phone, email, attendance, guests_count, dietary, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const r of initialRsvps) {
      rsvpInsert.run([r.name, r.phone, r.email, r.attendance, r.guests_count, r.dietary, r.message, r.created_at]);
    }
    rsvpInsert.free();
    saveDb();
  }

  return db;
}

export function saveDb() {
  if (!db) return;
  try {
    const binaryArray = db.export();
    const buffer = Buffer.from(binaryArray);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('❌ Failed saving SQLite database to file:', err);
  }
}

export async function querySql(sql, params = []) {
  const database = await getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export async function execSql(sql, params = []) {
  const database = await getDb();
  database.run(sql, params);
  saveDb();
  return true;
}

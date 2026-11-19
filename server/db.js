import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

// Return bigint ids/counts as plain numbers (they stay far below 2^53 here).
pg.types.setTypeParser(20, (v) => Number(v));

/*
 * PostgreSQL connection (Supabase).
 *
 * DATABASE_URL — use Supabase's *Session pooler* string (port 5432), e.g.
 *   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
 * The pooler works over IPv4, which Render's free plan needs.
 *
 * SSL is always on. If you download Supabase's CA certificate
 * (Project Settings → Database → SSL Configuration) and point DATABASE_CA_CERT
 * at the file, or paste its contents into DATABASE_CA_CERT, the server
 * certificate is fully verified too.
 */
const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error('❌ DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

function buildConfig() {
  if (!raw) return null;
  // Drop any ?sslmode=… from the URL so the ssl object below is the single source of truth.
  const url = new URL(raw);
  url.searchParams.delete('sslmode');

  let ssl = { rejectUnauthorized: false };
  const ca = process.env.DATABASE_CA_CERT;
  if (['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
    ssl = false; // a local Postgres for development doesn't use SSL
  } else if (ca) {
    const pem = ca.includes('BEGIN CERTIFICATE') ? ca : fs.readFileSync(ca, 'utf8');
    ssl = { ca: pem, rejectUnauthorized: true };
  }

  return {
    connectionString: url.toString(),
    ssl,
    max: Number(process.env.DATABASE_POOL_MAX) || 5, // Supabase free plan allows plenty; 5 is enough here
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000
  };
}

const config = buildConfig();
export const pool = config ? new Pool(config) : null;

pool?.on('error', (err) => console.error('⚠️ Idle database client error:', err.message));

/** Run a parameterised query ($1, $2 …) and return the rows. */
export async function query(sql, params = []) {
  if (!pool) throw new Error('DATABASE_URL is not configured');
  const { rows } = await pool.query(sql, params);
  return rows;
}

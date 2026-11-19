/*
 * One-time copy of the site's bundled photos into Supabase Storage + the images table.
 *
 *   npm run images:upload            # uploads slots that don't exist yet
 *   npm run images:upload -- --force # re-uploads and replaces every slot
 *
 * Needs DATABASE_URL, SUPABASE_URL and SUPABASE_SERVICE_KEY in your local .env.
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, pool } from '../db.js';
import { uploadImage, removeImage } from '../storage.js';
import { DEFAULT_IMAGES } from '../../src/lib/defaultImages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const force = process.argv.includes('--force');
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

let uploaded = 0;
let skipped = 0;

try {
  for (const img of DEFAULT_IMAGES) {
    const [existing] = await query('select * from images where key = $1', [img.key]);
    if (existing && !force) {
      console.log(`⏭  ${img.key} already in Supabase (use --force to replace)`);
      skipped++;
      continue;
    }

    const filePath = path.join(PUBLIC_DIR, img.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  ${img.file} not found, skipping`);
      continue;
    }

    const { url, path: storagePath } = await uploadImage({
      buffer: fs.readFileSync(filePath),
      contentType: TYPES[path.extname(filePath).toLowerCase()],
      folder: img.section,
      key: img.key
    });

    await query(
      `insert into images (key, section, title, subtitle, url, path, sort_order)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (key) do update set
         section = excluded.section, title = excluded.title, subtitle = excluded.subtitle,
         url = excluded.url, path = excluded.path, sort_order = excluded.sort_order, updated_at = now()`,
      [img.key, img.section, img.title, img.subtitle, url, storagePath, img.sort_order]
    );
    if (existing?.path) await removeImage(existing.path);

    console.log(`✅ ${img.key} → ${url}`);
    uploaded++;
  }
  console.log(`\nDone: ${uploaded} uploaded, ${skipped} already there.`);
} catch (err) {
  console.error('❌', err.message);
  process.exitCode = 1;
} finally {
  await pool?.end();
}

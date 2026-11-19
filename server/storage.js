import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const BUCKET = process.env.SUPABASE_BUCKET || 'images';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// The service key bypasses all security rules, so it must only ever live on the server.
export const supabase =
  SUPABASE_URL && SERVICE_KEY
    ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

if (!supabase) console.warn('⚠️ SUPABASE_URL / SUPABASE_SERVICE_KEY not set — photo uploads are disabled.');

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
export const ALLOWED_TYPES = Object.keys(EXT);

/**
 * Upload a file to the bucket under a fresh, unique name and return { path, url }.
 * A new name each time means browsers and the CDN never show a stale cached copy.
 */
export async function uploadImage({ buffer, contentType, folder, key }) {
  if (!supabase) throw new Error('Photo storage is not configured on the server');
  const ext = EXT[contentType];
  if (!ext) throw new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed');

  const safeKey = String(key).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const path = `${folder}/${safeKey}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    cacheControl: '31536000',
    upsert: false
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function removeImage(path) {
  if (!supabase || !path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn(`⚠️ Could not delete old file ${path}: ${error.message}`);
}

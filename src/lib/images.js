import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api';
import { DEFAULT_IMAGES } from './defaultImages';

/*
 * Site photos come from the Supabase "images" table.
 *
 * When VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, the browser reads the table
 * straight from Supabase with the public anon key (read-only, allowed by the RLS policy
 * in supabase/schema.sql). That is fast even while the Render backend is asleep.
 * Otherwise it asks the backend's /api/images. If neither works, or the table is still
 * empty, the photos bundled in /public are shown.
 */
const SB_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const BASE = import.meta.env.BASE_URL; // "/" locally, "/Wedding-Invitation/" on GitHub Pages

const FALLBACK = DEFAULT_IMAGES.map((img) => ({ ...img, url: BASE + img.file }));

let cache = null; // rows once loaded
let inflight = null;
const subscribers = new Set();

async function fetchRows() {
  if (SB_URL && ANON_KEY) {
    const res = await fetch(
      `${SB_URL}/rest/v1/images?select=key,section,title,subtitle,url,sort_order&order=section.asc,sort_order.asc,id.asc`,
      // `apikey` alone works for both the legacy anon key and the newer sb_publishable_ key.
      { headers: { apikey: ANON_KEY } }
    );
    if (!res.ok) throw new Error(`Supabase images: ${res.status}`);
    return res.json();
  }
  const res = await apiFetch('/api/images');
  if (!res.ok) throw new Error(`API images: ${res.status}`);
  return res.json();
}

function load(force = false) {
  if (inflight && !force) return inflight;
  inflight = fetchRows()
    .then((rows) => (Array.isArray(rows) && rows.length ? rows : FALLBACK))
    .catch((err) => {
      console.warn('Using bundled photos:', err.message);
      return cache || FALLBACK;
    })
    .then((rows) => {
      cache = rows;
      subscribers.forEach((fn) => fn(rows));
      return rows;
    });
  return inflight;
}

/** Reload photos everywhere on the page (called after an admin upload). */
export const refreshSiteImages = () => load(true);

/**
 * { ready, couple, gallery } — gallery items are { key, src, title, subtitle }.
 * While loading, `ready` is false and lists are empty, so an old photo never flashes
 * before the new one.
 */
export function useSiteImages() {
  const [rows, setRows] = useState(cache);

  useEffect(() => {
    subscribers.add(setRows);
    if (!cache) load();
    return () => subscribers.delete(setRows);
  }, []);

  return useMemo(() => {
    if (!rows) return { ready: false, couple: null, gallery: [], all: [] };
    const couple = rows.find((r) => r.key === 'couple')?.url || FALLBACK[0].url;
    const gallery = rows
      .filter((r) => r.section === 'gallery')
      .map((r) => ({ key: r.key, src: r.url, title: r.title || '', subtitle: r.subtitle || '' }));
    return { ready: true, couple, gallery, all: rows };
  }, [rows]);
}

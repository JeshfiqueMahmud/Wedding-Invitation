/*
 * Every call to the Express backend goes through apiFetch().
 *
 * VITE_API_URL is the backend's address, e.g. https://wedding-api.onrender.com
 * Leave it empty locally: Vite's dev proxy forwards /api to localhost:5000.
 *
 * Render's free plan sleeps after ~15 idle minutes and takes up to a minute to wake.
 * apiFetch() reports "slow" to <ServerWakeToast/> while that happens and retries
 * the gateway errors Render returns during start-up.
 */
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const apiUrl = (path) => `${API_URL}${path}`;

const SLOW_AFTER_MS = 2500;
const TIMEOUT_MS = 75_000; // one attempt
const BUDGET_MS = 90_000; // keep retrying a sleeping server for up to this long
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let awake = false;
let pending = 0;
let slow = false;
let slowTimer = null;
const listeners = new Set();

function setSlow(value) {
  if (slow === value) return;
  slow = value;
  listeners.forEach((fn) => fn(value));
}

/** Subscribe to "the server is waking up" changes. Returns an unsubscribe function. */
export function onServerSlow(fn) {
  listeners.add(fn);
  fn(slow);
  return () => listeners.delete(fn);
}

export async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const started = Date.now();
  const timeLeft = () => BUDGET_MS - (Date.now() - started);
  pending++;
  if (!awake && !slowTimer) slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);

  try {
    for (;;) {
      try {
        const res = await fetch(apiUrl(path), { ...options, signal: options.signal || AbortSignal.timeout(TIMEOUT_MS) });
        // 502/503/504 come from Render's proxy while the app is still booting — the request never reached it.
        if ([502, 503, 504].includes(res.status) && timeLeft() > 4000) {
          await wait(3000);
          continue;
        }
        awake = true;
        return res;
      } catch (err) {
        // Only repeat reads after a network error; repeating a POST could create duplicates.
        if (method !== 'GET' || options.signal?.aborted || timeLeft() <= 4000) throw err;
        await wait(3000);
      }
    }
  } finally {
    pending--;
    if (awake || pending === 0) {
      clearTimeout(slowTimer);
      slowTimer = null;
      setSlow(false);
    }
  }
}

/** Ping the backend as soon as the page opens so it is awake by the time a guest submits. */
export function wakeServer() {
  apiFetch('/api/health').catch(() => {});
}

/** Read the error message from a failed response, with a friendly default. */
export async function errorFrom(res, fallback = 'Something went wrong') {
  const data = await res.json().catch(() => ({}));
  return data.error || `${fallback} (${res.status})`;
}

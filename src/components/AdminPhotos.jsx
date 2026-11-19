import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Trash2, Save, Plus, RefreshCw } from 'lucide-react';
import { errorFrom } from '../lib/api';
import { refreshSiteImages } from '../lib/images';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif';

const inputCls =
  'w-full px-2.5 py-1.5 rounded-lg bg-navy-950/80 border border-baroque-400/25 text-baroque-100 placeholder-baroque-300/40 text-base sm:text-xs focus:outline-none focus:border-baroque-300';

function tooBig(file) {
  if (file && file.size > MAX_BYTES) {
    alert('That photo is larger than 8 MB. Please export a smaller copy (about 1600px wide is plenty).');
    return true;
  }
  return false;
}

/* One photo slot: preview, captions, replace and delete. */
function PhotoSlot({ row, adminFetch, onChanged }) {
  const [title, setTitle] = useState(row.title || '');
  const [subtitle, setSubtitle] = useState(row.subtitle || '');
  const [order, setOrder] = useState(row.sort_order ?? 0);
  const [busy, setBusy] = useState('');
  const fileRef = useRef(null);
  const isPortrait = row.key === 'couple';
  const dirty = title !== (row.title || '') || subtitle !== (row.subtitle || '') || Number(order) !== Number(row.sort_order);

  const send = async (file) => {
    const form = new FormData();
    form.append('key', row.key);
    form.append('title', title);
    form.append('subtitle', subtitle);
    form.append('sort_order', String(order));
    if (file) form.append('file', file);
    setBusy(file ? 'Uploading…' : 'Saving…');
    try {
      const res = await adminFetch('/api/admin/images', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await errorFrom(res, 'Save failed'));
      await onChanged();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy('');
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove “${row.title || row.key}” from the website? The file is deleted from storage.`)) return;
    setBusy('Removing…');
    try {
      const res = await adminFetch(`/api/admin/images/${encodeURIComponent(row.key)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await errorFrom(res, 'Delete failed'));
      await onChanged();
    } catch (err) {
      alert(err.message);
      setBusy('');
    }
  };

  return (
    <div className="navy-gold-card rounded-xl p-2.5 flex flex-col gap-2">
      <div className={`relative overflow-hidden rounded-lg bg-navy-900 ${isPortrait ? 'aspect-[9/14]' : 'aspect-[4/5]'}`}>
        <img src={row.url} alt={row.title || row.key} loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-navy-950/80 text-[10px] text-baroque-200">
          {isPortrait ? 'Invitation portrait' : row.key}
        </span>
        {busy && (
          <div className="absolute inset-0 bg-navy-950/70 flex items-center justify-center text-xs text-baroque-100">{busy}</div>
        )}
      </div>

      {!isPortrait && (
        <>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Caption" maxLength={120} />
          <div className="flex gap-2">
            <input className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" maxLength={120} />
            <input
              className={`${inputCls} w-16 text-center`}
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              title="Position in the gallery (lower comes first)"
              aria-label="Position"
            />
          </div>
        </>
      )}

      <div className="flex gap-1.5 text-[11px] font-semibold">
        <button
          type="button"
          disabled={!!busy}
          onClick={() => fileRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-baroque-300 hover:bg-baroque-200 text-navy-950 disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" /> Replace
        </button>
        {!isPortrait && dirty && (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => send(null)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-baroque-400/40 text-baroque-100 hover:bg-baroque-400/15"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        )}
        {!isPortrait && (
          <button
            type="button"
            disabled={!!busy}
            onClick={remove}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/40"
            title="Remove photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file && !tooBig(file)) send(file);
        }}
      />
    </div>
  );
}

/* Card for adding a brand-new gallery photo. */
function AddPhoto({ adminFetch, onChanged }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('key', `gallery-${Date.now().toString(36)}`);
    form.append('section', 'gallery');
    form.append('title', title);
    form.append('subtitle', subtitle);
    form.append('file', file);
    setBusy(true);
    try {
      const res = await adminFetch('/api/admin/images', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await errorFrom(res, 'Upload failed'));
      setFile(null);
      setTitle('');
      setSubtitle('');
      await onChanged();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl p-2.5 flex flex-col gap-2 border-2 border-dashed border-baroque-400/35">
      <label className="relative aspect-[4/5] rounded-lg overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer bg-navy-950/40 hover:bg-baroque-400/10 text-baroque-300">
        {preview ? (
          <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <Plus className="w-7 h-7" />
            <span className="text-xs">Add a gallery photo</span>
          </>
        )}
        <input
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f && !tooBig(f)) setFile(f);
          }}
        />
      </label>
      <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Caption" maxLength={120} />
      <input className={inputCls} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle" maxLength={120} />
      <button
        type="submit"
        disabled={!file || busy}
        className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-baroque-300 hover:bg-baroque-200 text-navy-950 text-[11px] font-semibold disabled:opacity-40"
      >
        <Upload className="w-3.5 h-3.5" /> {busy ? 'Uploading…' : 'Upload to gallery'}
      </button>
    </form>
  );
}

export default function AdminPhotos({ adminFetch }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await adminFetch('/api/images');
      if (!res.ok) throw new Error(await errorFrom(res, 'Could not load photos'));
      setRows(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const onChanged = async () => {
    await load();
    await refreshSiteImages(); // the page behind the dashboard updates straight away
  };

  useEffect(() => {
    load();
  }, []);

  // If the portrait has never been uploaded, show the built-in one so it can be replaced.
  const savedPortrait = rows?.find((r) => r.key === 'couple');
  const portrait = rows
    ? [savedPortrait || { key: 'couple', section: 'blessing', title: 'Jeshfique & Tamanna', subtitle: '', sort_order: 1, url: `${import.meta.env.BASE_URL}images/couple.webp` }]
    : [];
  const gallery = rows?.filter((r) => r.section === 'gallery') || [];

  return (
    <div className="flex-1 overflow-y-auto pt-3 sm:pt-4 font-sans">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs text-baroque-200/75">
          Photos are stored in Supabase. Changes appear on the website for everyone straight away — no redeploy needed.
        </p>
        <button
          type="button"
          onClick={load}
          className="p-1.5 rounded-xl border border-baroque-400/30 hover:bg-baroque-400/15 text-baroque-200 shrink-0"
          title="Reload"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
      {!rows && !error && <p className="text-xs text-baroque-300/70">Loading photos…</p>}
      {rows && rows.length === 0 && (
        <p className="text-xs text-holud mb-3">
          No photos in Supabase yet, so the website is showing its built-in photos. Run <code>npm run images:upload</code> once on
          your computer to copy them in, or add new ones below.
        </p>
      )}

      {rows && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
          {portrait.map((row) => (
            <PhotoSlot key={`${row.key}-${row.url}`} row={row} adminFetch={adminFetch} onChanged={onChanged} />
          ))}
          {gallery.map((row) => (
            <PhotoSlot key={`${row.key}-${row.url}-${row.sort_order}`} row={row} adminFetch={adminFetch} onChanged={onChanged} />
          ))}
          <AddPhoto adminFetch={adminFetch} onChanged={onChanged} />
        </div>
      )}
    </div>
  );
}

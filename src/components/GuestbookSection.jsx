import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import { SectionHeading, Reveal, ease } from '../lib/motion';
import { apiFetch } from '../lib/api';

function LikeButton({ count, onLike }) {
  const [bursts, setBursts] = useState([]);
  const click = () => {
    const id = Date.now();
    setBursts((b) => [...b, id]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 900);
    onLike();
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={click}
      className="relative inline-flex items-center gap-1.5 py-1 px-3 rounded-full border border-baroque-400/20 text-xs text-baroque-300/90 hover:text-sindoor hover:border-sindoor/40 transition-colors cursor-pointer"
      title="Send love"
    >
      <Heart className="w-3.5 h-3.5 text-sindoor fill-sindoor/30" />
      <span className="font-sans tabular-nums">{count}</span>
      <AnimatePresence>
        {bursts.map((id) => (
          <motion.span
            key={id}
            initial={{ y: 0, opacity: 1, scale: 0.6 }}
            animate={{ y: -40, opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute left-2 -top-1 pointer-events-none"
          >
            <Heart className="w-4 h-4 text-sindoor fill-sindoor" />
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

export default function GuestbookSection() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [wishesState, setWishesState] = useState('loading'); // loading | ready | error

  const fetchWishes = async () => {
    try {
      const res = await apiFetch('/api/guestbook');
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
      setWishesState(res.ok ? 'ready' : 'error');
    } catch (err) {
      console.error('Failed to load guestbook:', err);
      setWishesState('error');
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit prayer');
      setName('');
      setMessage('');
      fetchWishes();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m)));
      await apiFetch(`/api/guestbook/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to like wish:', err);
    }
  };

  const inputCls =
    'w-full bg-navy-950/50 border border-baroque-400/20 rounded-2xl px-4 py-3 font-serif text-lg text-baroque-100 placeholder:text-baroque-300/35 focus:outline-none focus:border-holud transition-colors';

  return (
    <section id="guestbook" className="relative py-24 sm:py-32 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">
        <SectionHeading numeral="VII." kicker="Duas & Wishes" title="Leave us a blessing" sub="Every prayer here will be read, and kept, by Jeshfique & Tamanna." />

        <Reveal>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
            {errorMsg && <p className="text-sm text-sindoor text-center font-sans">{errorMsg}</p>}
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
            <textarea rows={3} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your dua, prayer or warm wishes…" className={`${inputCls} resize-none`} />
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-holud text-navy-950 font-cinzel text-[11px] tracking-[0.25em] uppercase disabled:opacity-60 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Sending…' : 'Send blessing'}
              </motion.button>
            </div>
          </form>
        </Reveal>

        {wishesState !== 'ready' && messages.length === 0 && (
          <p className="mt-14 text-center font-serif italic text-lg text-baroque-200/60" role="status">
            {wishesState === 'loading' ? 'Gathering blessings…' : 'Blessings could not be loaded right now. Please refresh in a moment.'}
          </p>
        )}

        {wishesState === 'ready' && messages.length === 0 && (
          <p className="mt-14 text-center font-serif italic text-lg text-baroque-200/60" role="status">
            Be the first to leave a blessing for Jeshfique &amp; Tamanna.
          </p>
        )}

        <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          <AnimatePresence initial={false}>
            {messages.map((entry, i) => (
              <motion.figure
                key={entry.id}
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="break-inside-avoid mb-5 navy-gold-card rounded-3xl p-6"
              >
                <span className="font-serif text-5xl leading-none text-holud/60">“</span>
                <blockquote className="font-serif italic text-lg text-baroque-100 leading-relaxed -mt-4">{entry.message}</blockquote>
                <figcaption className="mt-5 pt-4 border-t border-dashed border-baroque-400/20 flex items-center justify-between gap-3">
                  <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-baroque-400">— {entry.name}</span>
                  <LikeButton count={entry.likes || 0} onLike={() => handleLike(entry.id)} />
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

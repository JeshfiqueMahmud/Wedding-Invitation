import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageSquare } from 'lucide-react';

export default function GuestbookSection() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/guestbook');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load guestbook:', err);
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
      const res = await fetch('/api/guestbook', {
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
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m))
      );
      await fetch(`/api/guestbook/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to like wish:', err);
    }
  };

  return (
    <section id="guestbook" className="py-10 sm:py-14 px-2 sm:px-6 text-center">
      <h2 className="font-cinzel text-sm sm:text-base tracking-[0.28em] uppercase text-baroque-300 mb-1.5 sm:mb-2 font-semibold">
        Wedding Guestbook
      </h2>
      <p className="font-serif italic text-xs sm:text-sm text-baroque-200/70 max-w-sm mx-auto mb-5 sm:mb-6 px-3">
        Leave your prayers, heartfelt wishes, and love for Jeshfique &amp; Faheema
      </p>

      {/* Submission Form (Mobile font-size 16px to prevent auto-zoom) */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 text-left font-sans">
        {errorMsg && (
          <p className="text-xs text-red-400 text-center">{errorMsg}</p>
        )}
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-baroque-400/40 text-baroque-100 placeholder-baroque-300/45 text-base sm:text-xs focus:outline-none focus:border-baroque-300 shadow-inner"
        />

        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your dua, prayer, or warm blessings for the couple..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-baroque-400/40 text-baroque-100 placeholder-baroque-300/45 text-base sm:text-xs focus:outline-none focus:border-baroque-300 shadow-inner resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl sm:rounded-full bg-baroque-300 hover:bg-baroque-200 active:scale-95 text-navy-950 font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Sending...' : 'Send Blessings'}</span>
          </button>
        </div>
      </form>

      {/* Messages List */}
      <div className="max-w-md mx-auto mt-6 sm:mt-8 space-y-3 text-left">
        {messages.map((entry) => (
          <div
            key={entry.id}
            className="navy-gold-card rounded-2xl p-3.5 sm:p-4 border border-baroque-400/30 hover:border-baroque-400/60 transition-colors"
          >
            <p className="font-serif italic text-xs sm:text-sm text-baroque-100 leading-relaxed">
              “{entry.message}”
            </p>

            <div className="mt-2.5 pt-2 border-t border-baroque-400/20 flex items-center justify-between text-xs font-sans">
              <span className="font-cinzel text-[10px] tracking-widest uppercase text-baroque-400 font-bold">
                — {entry.name}
              </span>

              <button
                type="button"
                onClick={() => handleLike(entry.id)}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-navy-900/60 border border-baroque-400/25 text-[11px] text-baroque-300/90 hover:text-red-400 transition-colors cursor-pointer group active:scale-95"
                title="Send heart reaction"
              >
                <Heart className="w-3.5 h-3.5 group-hover:scale-125 transition-transform fill-red-400/20 text-red-400" />
                <span>{entry.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

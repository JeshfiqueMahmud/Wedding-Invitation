import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onServerSlow } from '../lib/api';

/* Shown while the free Render backend is waking up (first request after ~15 idle minutes). */
export default function ServerWakeToast() {
  const [slow, setSlow] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => onServerSlow(setSlow), []);

  useEffect(() => {
    if (!slow) {
      setSeconds(0);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [slow]);

  return (
    <AnimatePresence>
      {slow && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed z-[80] left-1/2 -translate-x-1/2 bottom-24 sm:bottom-6 w-[calc(100%-2rem)] max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl border border-baroque-400/30 bg-navy-950/90 backdrop-blur-md shadow-2xl"
        >
          <motion.span
            aria-hidden="true"
            className="w-7 h-7 shrink-0 rounded-full border-2 border-holud/25 border-t-holud"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="font-sans text-xs leading-snug text-baroque-200">
            <p className="text-baroque-100 font-medium">Waking up the guest book…</p>
            <p className="text-baroque-200/70">
              The first visit can take up to a minute{seconds > 4 ? ` · ${seconds}s` : ''}. Thanks for your patience.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

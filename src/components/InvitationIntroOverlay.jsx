import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import Alpana from './Alpana';
import { ease } from '../lib/motion';

/*
 * The envelope, reimagined: an alpana draws itself on ink-black paper.
 * Tapping the seal opens an iris in the middle of the mandala that widens
 * until the whole invitation is revealed underneath.
 */
export default function InvitationIntroOverlay({ onOpened, onStartMusic }) {
  const [opening, setOpening] = useState(false);
  const iris = useMotionValue(0);
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${iris}%, black calc(${iris}% + 1px))`;

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    if (onStartMusic) onStartMusic();
    animate(iris, 150, {
      duration: 1.5,
      ease: [0.7, 0, 0.2, 1],
      delay: 0.35,
      onComplete: () => onOpened && onOpened()
    });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation — tap to open"
      onClick={handleOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      tabIndex={0}
      className="fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden bg-navy-950 outline-none"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      {/* warm glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          'radial-gradient(circle at 50% 45%, rgba(226,166,62,0.18), transparent 55%), radial-gradient(circle at 20% 90%, rgba(201,67,47,0.12), transparent 50%)'
      }} />

      <div className="relative h-full w-full flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: opening ? 0 : 1, y: 0 }}
          transition={{ duration: 1.2, delay: opening ? 0 : 0.2, ease }}
          className="font-arabic text-2xl sm:text-3xl text-baroque-300 mb-2"
          dir="rtl"
          lang="ar"
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 0 : 0.7 }}
          transition={{ duration: 1, delay: opening ? 0 : 0.5 }}
          className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-baroque-200 mb-6 sm:mb-8"
        >
          You are invited
        </motion.p>

        {/* Mandala seal */}
        <motion.div
          className="relative w-[min(78vw,46svh)] max-w-[380px] aspect-square"
          animate={opening ? { scale: 3.2, rotate: 120, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
          transition={opening ? { duration: 1.6, ease: [0.7, 0, 0.2, 1] } : { duration: 0.6 }}
        >
          <motion.div
            className="absolute inset-0 text-baroque-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          >
            <Alpana className="w-full h-full" duration={2.6} delay={0.4} showCenter={false} />
          </motion.div>

          {/* centre medallion */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 1.8 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] aspect-square rounded-full flex flex-col items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFE7AE 0%, #E2A63E 45%, #A8661C 100%)',
              boxShadow: '0 0 0 6px rgba(11,9,23,0.9), 0 0 0 7px rgba(226,166,62,0.5), 0 20px 60px rgba(226,166,62,0.35)'
            }}
          >
            <span className="font-script text-[2.4rem] sm:text-5xl text-navy-950 leading-none pt-2">J&amp;T</span>
            <span className="font-bangla text-[10px] sm:text-xs text-navy-950/80 -mt-0.5">শুভ বিবাহ</span>
          </motion.div>

          {/* pulse ring inviting a tap */}
          {!opening && (
            <motion.span
              className="absolute left-1/2 top-1/2 w-[34%] aspect-square rounded-full border border-baroque-300 pointer-events-none"
              style={{ x: '-50%', y: '-50%' }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.4, ease: 'easeOut' }}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: opening ? 0 : 1, y: opening ? 20 : 0 }}
          transition={{ duration: 1, delay: opening ? 0 : 2.2, ease }}
          className="mt-8 sm:mt-10"
        >
          <p className="font-serif italic font-light text-3xl sm:text-4xl text-baroque-100">
            Jeshfique <span className="font-script text-baroque-400 not-italic">&amp;</span> Tamanna
          </p>
          <p className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-baroque-300/80 mt-3">
            25 &amp; 27 December 2026 · Dhaka
          </p>
          <motion.p
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="font-sans text-[11px] tracking-[0.3em] uppercase text-baroque-200 mt-8"
          >
            Tap the seal to open
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

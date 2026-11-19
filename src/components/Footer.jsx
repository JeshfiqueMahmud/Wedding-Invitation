import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, Mail } from 'lucide-react';
import Alpana from './Alpana';
import { SplitText } from '../lib/motion';

export default function Footer({ onReplayIntro }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const rise = useTransform(scrollYProgress, [0, 1], ['45%', '0%']);
  const spin = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden pt-32 pb-36 md:pb-16 text-center">
      {/* a mandala rising like the moon over the final words */}
      <motion.div
        aria-hidden="true"
        style={{ y: rise, rotate: spin }}
        className="absolute left-1/2 -bottom-[40vmin] -translate-x-1/2 w-[110vmin] h-[110vmin] text-holud/15 pointer-events-none"
      >
        <Alpana className="w-full h-full" inView duration={3} />
      </motion.div>

      <div className="relative">
        <p className="font-cinzel text-[10px] tracking-[0.45em] uppercase text-baroque-300/70">With love &amp; gratitude</p>
        <h2 className="font-script text-6xl sm:text-8xl gold-foil-text mt-6 leading-[1.2]">
          <SplitText text="Jeshfique & Tamanna" stagger={0.04} />
        </h2>
        <p className="font-bangla text-holud text-lg mt-4">শুভ বিবাহ · ২০২৬</p>
        <p className="font-serif italic text-baroque-200/60 text-lg mt-2">December 2026 · Dhaka, Bangladesh</p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {onReplayIntro && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onReplayIntro}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-baroque-400/30 hover:border-holud text-baroque-200 font-cinzel text-[10px] tracking-[0.25em] uppercase cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" /> Reopen the envelope
            </motion.button>
          )}
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-holud text-navy-950 font-cinzel text-[10px] tracking-[0.25em] uppercase cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

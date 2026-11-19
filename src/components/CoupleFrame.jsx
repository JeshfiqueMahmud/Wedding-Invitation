import React from 'react';
import { motion } from 'framer-motion';
import { ease } from '../lib/motion';

const ARCH = 'rounded-t-[999px] rounded-b-[1.6rem]';

/* A hanging jhumka-style tassel that sways gently. */
function Tassel({ side, delay }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute z-20 top-[26%] ${side === 'left' ? '-left-7' : '-right-7'} origin-top`}
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease }}
    >
      <motion.svg
        width="22"
        height="86"
        viewBox="0 0 22 86"
        fill="none"
        className="origin-top"
        animate={{ rotate: side === 'left' ? [4, -4, 4] : [-4, 4, -4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <line x1="11" y1="0" x2="11" y2="40" stroke="#E2A63E" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="11" cy="14" r="2.4" fill="#F3B33D" />
        <circle cx="11" cy="26" r="2.4" fill="#C9432F" />
        <circle cx="11" cy="38" r="2.4" fill="#F3B33D" />
        <path d="M3 48 Q11 38 19 48 L16 60 Q11 64 6 60 Z" fill="url(#tasselGold)" stroke="#8a5a14" strokeWidth="0.6" />
        <circle cx="11" cy="51" r="2" fill="#C9432F" />
        {[5, 8, 11, 14, 17].map((x) => (
          <line key={x} x1={x} y1="61" x2={x + (x - 11) * 0.25} y2="80" stroke="#E0861C" strokeWidth="1.1" strokeLinecap="round" />
        ))}
        <circle cx="11" cy="83" r="2.2" fill="#F7EFE1" />
        <defs>
          <linearGradient id="tasselGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE6A8" />
            <stop offset="0.5" stopColor="#E2A63E" />
            <stop offset="1" stopColor="#9C6A1C" />
          </linearGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
}

/* Mughal-arch (jharokha) frame for the couple's illustration. */
export default function CoupleFrame({ src, glare }) {
  return (
    <div className="relative">
      {/* finial on top of the arch */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 60 46"
        className="absolute left-1/2 -translate-x-1/2 -top-9 w-14 z-20 drop-shadow-[0_4px_10px_rgba(243,179,61,0.45)]"
        initial={{ opacity: 0, y: -12, scale: 0.6 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease }}
      >
        <path d="M30 2 C33 10 40 14 40 24 C40 32 35 37 30 40 C25 37 20 32 20 24 C20 14 27 10 30 2 Z" fill="url(#finialGold)" stroke="#8a5a14" strokeWidth="0.8" />
        <circle cx="30" cy="25" r="4" fill="#C9432F" stroke="#FFE6A8" strokeWidth="1" />
        <path d="M8 44 Q30 34 52 44" stroke="#E2A63E" strokeWidth="1.4" fill="none" />
        <defs>
          <linearGradient id="finialGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF0C4" />
            <stop offset="0.5" stopColor="#F3B33D" />
            <stop offset="1" stopColor="#A86E14" />
          </linearGradient>
        </defs>
      </motion.svg>

      <Tassel side="left" delay={0.7} />
      <Tassel side="right" delay={0.85} />

      {/* soft marigold aura behind the frame */}
      <motion.div
        aria-hidden="true"
        className={`absolute -inset-10 ${ARCH} will-change-[opacity]`}
        style={{ background: 'radial-gradient(ellipse at center, rgba(243,179,61,0.28) 35%, transparent 72%)' }}
        animate={{ opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* gold outer rim */}
      <div
        className={`relative ${ARCH} p-[7px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]`}
        style={{ background: 'linear-gradient(145deg,#FFF0C4 0%,#E2A63E 28%,#8a5a14 52%,#F3B33D 74%,#FFE6A8 100%)' }}
      >
        {/* ivory mat */}
        <div className={`${ARCH} p-[5px] bg-ivory`}>
          {/* inner gold hairline */}
          <div className={`${ARCH} p-[1.5px] bg-gradient-to-b from-baroque-300 via-holud-deep to-baroque-300`}>
            <div className={`relative ${ARCH} overflow-hidden aspect-[9/14] bg-navy-900`}>
              {src && (
                <motion.img
                  src={src}
                  alt="Illustration of Jeshfique and Tamanna holding hands in a flower garden"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover object-[50%_40%]"
                  initial={{ scale: 1.25, opacity: 0 }}
                  whileInView={{ scale: 1.04, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease }}
                />
              )}
              {/* slow breathing zoom layer (separate from the reveal) */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={{ opacity: [0, 0.18, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,226,160,0.9), transparent 60%)' }}
              />
              {/* warm vignette so the pastel art sits in the night palette */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 85% 75% at 50% 42%, transparent 55%, rgba(11,9,23,0.55) 100%), linear-gradient(to top, rgba(11,9,23,0.8), rgba(11,9,23,0.35) 18%, transparent 34%)'
                }}
              />
              {/* stitched inner border */}
              <div aria-hidden="true" className={`absolute inset-2.5 ${ARCH} border border-dashed border-ivory/55 pointer-events-none`} />
              {/* moving glare from the tilt */}
              {glare && (
                <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none mix-blend-soft-light" style={{ background: glare }} />
              )}

              {/* name plate */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1, ease }}
                className="absolute bottom-4 inset-x-0 flex flex-col items-center text-center"
              >
                <span className="font-script text-[1.65rem] sm:text-3xl text-ivory whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-none">
                  Jeshfique <span className="text-holud">&amp;</span> Tamanna
                </span>
                <span className="mt-2 font-cinzel text-[9px] tracking-[0.4em] uppercase text-ivory/85">25 · 12 · 2026</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* twinkles */}
      {[
        ['-left-5', 'top-[12%]', 0],
        ['-right-6', 'top-[58%]', 1.2],
        ['left-[8%]', '-bottom-4', 2.1]
      ].map(([x, y, d], i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`absolute ${x} ${y} text-holud text-lg pointer-events-none`}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 90, 180] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: d, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

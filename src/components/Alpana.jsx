import React from 'react';
import { motion } from 'framer-motion';

/*
 * Alpana — the hand-drawn rice-paste floor art of Bengali celebrations,
 * rebuilt as an SVG mandala whose every stroke can draw itself.
 */

const petal = (r1, r2, w) => {
  const a = r1 + (r2 - r1) * 0.35;
  const b = r2 - (r2 - r1) * 0.15;
  return `M0 ${-r1} C ${w} ${-a} ${w * 0.55} ${-b} 0 ${-r2} C ${-w * 0.55} ${-b} ${-w} ${-a} 0 ${-r1} Z`;
};

const RINGS = [
  { type: 'circle', r: 192, sw: 0.8 },
  { type: 'petals', n: 36, r1: 162, r2: 189, w: 8, sw: 0.9 },
  { type: 'dots', n: 48, r: 152, size: 2 },
  { type: 'circle', r: 142, sw: 1.2 },
  { type: 'petals', n: 16, r1: 92, r2: 139, w: 19, sw: 1.2 },
  { type: 'petals', n: 16, r1: 102, r2: 128, w: 7, sw: 0.7 },
  { type: 'circle', r: 88, sw: 0.8, dash: true },
  { type: 'petals', n: 8, r1: 36, r2: 86, w: 27, sw: 1.3, offset: 22.5 },
  { type: 'petals', n: 8, r1: 44, r2: 76, w: 12, sw: 0.7, offset: 22.5 },
  { type: 'circle', r: 32, sw: 1.2 },
  { type: 'petals', n: 12, r1: 12, r2: 30, w: 6, sw: 0.8 },
  { type: 'dot', r: 6 }
];

export default function Alpana({
  className = '',
  draw = true,
  duration = 2.4,
  delay = 0,
  inView = false,
  strokeColor = 'currentColor',
  showCenter = true
}) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: duration / RINGS.length, delayChildren: delay } }
  };
  const ring = {
    hidden: { pathLength: draw ? 0 : 1, opacity: draw ? 0 : 1 },
    show: { pathLength: 1, opacity: 1, transition: { duration: duration * 0.6, ease: [0.65, 0, 0.35, 1] } }
  };
  const pop = {
    hidden: { scale: draw ? 0 : 1, opacity: draw ? 0 : 1 },
    show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } }
  };

  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-40px' } }
    : { initial: 'hidden', animate: 'show' };

  return (
    <motion.svg
      viewBox="-200 -200 400 400"
      className={className}
      fill="none"
      stroke={strokeColor}
      strokeLinecap="round"
      aria-hidden="true"
      variants={container}
      {...trigger}
    >
      {RINGS.map((rg, idx) => {
        if (rg.type === 'circle') {
          return (
            <motion.circle
              key={idx}
              r={rg.r}
              strokeWidth={rg.sw}
              strokeDasharray={rg.dash ? '3 6' : undefined}
              variants={rg.dash ? pop : ring}
            />
          );
        }
        if (rg.type === 'petals') {
          return (
            <motion.g key={idx} variants={container}>
              {Array.from({ length: rg.n }).map((_, i) => (
                <motion.path
                  key={i}
                  d={petal(rg.r1, rg.r2, rg.w)}
                  strokeWidth={rg.sw}
                  transform={`rotate(${(360 / rg.n) * i + (rg.offset || 0)})`}
                  variants={ring}
                />
              ))}
            </motion.g>
          );
        }
        if (rg.type === 'dots') {
          return (
            <motion.g key={idx} variants={pop} stroke="none" fill={strokeColor}>
              {Array.from({ length: rg.n }).map((_, i) => {
                const a = ((Math.PI * 2) / rg.n) * i;
                return <circle key={i} cx={Math.cos(a) * rg.r} cy={Math.sin(a) * rg.r} r={rg.size} />;
              })}
            </motion.g>
          );
        }
        if (rg.type === 'dot' && showCenter) {
          return <motion.circle key={idx} r={rg.r} fill={strokeColor} stroke="none" variants={pop} />;
        }
        return null;
      })}
    </motion.svg>
  );
}

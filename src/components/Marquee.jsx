import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** A ribbon of text that drifts on its own and surges/skews with scroll speed. */
function Row({ children, baseVelocity = 2, className = '' }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-1500, 0, 1500], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex">
      <motion.div className={`flex whitespace-nowrap will-change-transform ${className}`} style={{ x, skewX: skew }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block pr-8">{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const Dot = () => <span className="inline-block text-holud mx-6 sm:mx-10 not-italic text-[0.5em] align-middle">✿</span>;
  return (
    <section aria-hidden="true" className="relative py-8 sm:py-12 -rotate-2 my-6">
      <div className="bg-holud text-navy-950 py-3 sm:py-4 shadow-[0_20px_60px_-20px_rgba(243,179,61,0.5)]">
        <Row baseVelocity={-2.5} className="font-serif italic font-light text-4xl sm:text-6xl">
          Sangeet <Dot /> Twenty-Fifth December <Dot /> Wedding Reception <Dot /> Twenty-Seventh December <Dot /> Dhaka <Dot />
        </Row>
      </div>
      <div className="border-y border-baroque-400/25 py-2.5 sm:py-3 rotate-[3deg] -mt-1 bg-navy-950/95">
        <Row baseVelocity={2} className="font-cinzel text-xs sm:text-sm tracking-[0.4em] uppercase text-baroque-300">
          Jeshfique &amp; Tamanna <span className="mx-6 text-sindoor">✦</span> শুভ বিবাহ <span className="mx-6 text-sindoor">✦</span> Two evenings · One forever <span className="mx-6 text-sindoor">✦</span>
        </Row>
      </div>
    </section>
  );
}

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Alpana from './Alpana';
import { SplitText, ease } from '../lib/motion';

export default function HeroSection({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // scroll choreography
  const mandalaScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const mandalaOpacity = useTransform(scrollYProgress, [0, 0.8], [0.32, 0]);
  const namesY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const namesOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const groomX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const brideX = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // pointer parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const layerX = useTransform(sx, (v) => v * -18);
  const layerY = useTransform(sy, (v) => v * -12);
  const deepX = useTransform(sx, (v) => v * 30);
  const deepY = useTransform(sy, (v) => v * 22);

  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const fade = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 1.1, delay, ease }
  });

  return (
    <section
      id="hero"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16"
    >
      {/* Giant slow-turning alpana */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[150vmin] h-[150vmin] -translate-x-1/2 -translate-y-1/2 text-baroque-400 pointer-events-none will-change-transform"
        style={{ scale: mandalaScale, rotate: mandalaRotate, opacity: mandalaOpacity, x: deepX, y: deepY }}
      >
        <motion.div className="w-full h-full will-change-transform" animate={{ rotate: -360 }} transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}>
          {ready && <Alpana className="w-full h-full" duration={3.4} />}
        </motion.div>
      </motion.div>

      {/* Soft marigold sun behind the names */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 w-[70vmin] h-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(243,179,61,0.22) 0%, rgba(201,67,47,0.08) 45%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={{ y: namesY, opacity: namesOpacity }} className="relative z-10 text-center w-full">
        <motion.div style={{ x: layerX, y: layerY }}>
          <motion.p {...fade(0.1)} className="font-bangla text-xl sm:text-2xl text-holud">
            শুভ বিবাহ
          </motion.p>
          <motion.p {...fade(0.25)} className="font-cinzel text-[10px] sm:text-xs tracking-[0.42em] uppercase text-baroque-200/70 mt-3">
            Together with their families
          </motion.p>

          <h1 className="mt-6 sm:mt-8 font-serif font-light italic text-baroque-100 leading-[0.86]">
            <motion.span style={{ x: groomX }} className="block text-[clamp(3.6rem,15vw,10.5rem)]">
              {ready ? <SplitText text="Jeshfique" animateNow delay={0.35} stagger={0.05} /> : <span className="opacity-0">Jeshfique</span>}
            </motion.span>

            <motion.span
              initial={{ scale: 0, rotate: -40, opacity: 0 }}
              animate={ready ? { scale: 1, rotate: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.95 }}
              className="block font-script not-italic text-[clamp(3rem,10vw,6.5rem)] gold-foil-text leading-[1.1] -my-2 sm:-my-4"
            >
              &amp;
            </motion.span>

            <motion.span style={{ x: brideX }} className="block text-[clamp(3.6rem,15vw,10.5rem)]">
              {ready ? <SplitText text="Tamanna" animateNow delay={1.1} stagger={0.05} /> : <span className="opacity-0">Tamanna</span>}
            </motion.span>
          </h1>

          <motion.p {...fade(1.6)} className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-baroque-300/90 mt-6 sm:mt-8 px-2">
            Jeshfique Mahmud <span className="text-baroque-400 mx-2">✦</span> Faheema Shaheed Tamanna
          </motion.p>
        </motion.div>

        {/* date ribbon */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={ready ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.8, ease }}
          className="mt-10 sm:mt-12 inline-flex items-stretch rounded-full border border-baroque-400/30 bg-navy-900/90 overflow-hidden"
        >
          <a href="#savedate" className="px-4 sm:px-6 py-2.5 text-left hover:bg-holud/10 transition-colors">
            <span className="block font-cinzel text-[9px] tracking-[0.3em] uppercase text-holud">Gaye Holud</span>
            <span className="block font-serif text-lg sm:text-xl text-baroque-100 leading-tight">25 · XII</span>
          </a>
          <span className="w-px bg-baroque-400/30" />
          <span className="px-3 sm:px-5 flex items-center font-serif italic text-baroque-300 text-lg">MMXXVI</span>
          <span className="w-px bg-baroque-400/30" />
          <a href="#savedate" className="px-4 sm:px-6 py-2.5 text-right hover:bg-baroque-400/10 transition-colors">
            <span className="block font-cinzel text-[9px] tracking-[0.3em] uppercase text-baroque-300">Reception</span>
            <span className="block font-serif text-lg sm:text-xl text-baroque-100 leading-tight">27 · XII</span>
          </a>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#blessing"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-baroque-300/70"
        aria-label="Scroll to invitation"
      >
        <span className="font-cinzel text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <span className="relative w-px h-12 bg-baroque-400/25 overflow-hidden">
          <motion.span
            className="absolute left-0 top-0 w-px h-4 bg-holud"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}

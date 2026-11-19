import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import Alpana from './Alpana';
import CameoArt from './CameoArt';
import { Reveal, ScrollWords, SectionHeading, ease } from '../lib/motion';

const VERSE =
  '“And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.”';

export default function BlessingSection() {
  const cameoRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const haloRotate = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const cameoY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  // spring tilt on the portrait
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sry = useSpring(ry, { stiffness: 140, damping: 16 });
  const glareX = useTransform(sry, [-12, 12], ['20%', '80%']);
  const glareY = useTransform(srx, [12, -12], ['20%', '80%']);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,240,200,0.55), transparent 55%)`);

  const onMove = (clientX, clientY) => {
    const r = cameoRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (clientX - r.left) / r.width - 0.5;
    const y = (clientY - r.top) / r.height - 0.5;
    ry.set(x * 22);
    rx.set(y * -22);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section id="blessing" ref={sectionRef} className="relative py-24 sm:py-32 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionHeading numeral="I." kicker="The Invitation" title="With joyful hearts" />

        <div className="grid md:grid-cols-[1.05fr_1fr] gap-14 md:gap-10 items-center">
          {/* words */}
          <div className="text-center md:text-left order-2 md:order-1">
            <Reveal>
              <p className="font-arabic text-3xl sm:text-4xl text-holud leading-relaxed" dir="rtl" lang="ar">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-baroque-300/70 mt-2">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 font-serif text-xl sm:text-2xl leading-relaxed text-baroque-200/90">
              Together with their beloved families, we joyfully invite you to grace the wedding celebrations of
            </Reveal>

            <div className="mt-6 space-y-1">
              <Reveal delay={0.25} x={-30} y={0}>
                <p className="font-script text-5xl sm:text-6xl gold-foil-text leading-[1.3]">Jeshfique Mahmud</p>
              </Reveal>
              <Reveal delay={0.35}>
                <p className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-baroque-400/80 md:pl-3">with</p>
              </Reveal>
              <Reveal delay={0.45} x={30} y={0}>
                <p className="font-script text-5xl sm:text-6xl gold-foil-text leading-[1.3]">Faheema Shaheed Tamanna</p>
              </Reveal>
            </div>

            <div className="mt-10 pl-0 md:pl-6 md:border-l border-dashed border-baroque-400/40">
              <ScrollWords text={VERSE} className="font-serif italic text-lg sm:text-xl leading-relaxed text-baroque-100" />
              <Reveal className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-baroque-400 mt-3">
                — Surah Ar-Rum · 30:21
              </Reveal>
            </div>
          </div>

          {/* portrait */}
          <motion.div style={{ y: cameoY }} className="relative order-1 md:order-2 flex justify-center">
            <motion.div
              aria-hidden="true"
              style={{ rotate: haloRotate }}
              className="absolute inset-[-12%] text-baroque-400/30 pointer-events-none"
            >
              <Alpana className="w-full h-full" inView duration={2.8} />
            </motion.div>

            <motion.div
              ref={cameoRef}
              onPointerMove={(e) => onMove(e.clientX, e.clientY)}
              onPointerLeave={reset}
              onTouchEnd={reset}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.3, ease }}
              style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
              className="relative w-full max-w-[360px] sm:max-w-[420px] select-none"
            >
              <CameoArt className="w-full h-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]" />
              {/* moving glare */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-[50%] pointer-events-none mix-blend-soft-light"
                style={{ background: glare }}
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1, ease }}
              className="absolute left-0 sm:-left-2 bottom-6 font-cinzel text-[9px] tracking-[0.35em] uppercase text-baroque-300/80 [writing-mode:vertical-rl] rotate-180"
            >
              The Groom
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 1, ease }}
              className="absolute right-0 sm:-right-2 top-6 font-cinzel text-[9px] tracking-[0.35em] uppercase text-baroque-300/80 [writing-mode:vertical-rl]"
            >
              The Bride
            </motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


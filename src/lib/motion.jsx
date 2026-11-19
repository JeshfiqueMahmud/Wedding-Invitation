import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

/** Fades + rises its children when scrolled into view. */
export function Reveal({ children, delay = 0, y = 36, x = 0, className = '', once = true, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 1, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Letter-by-letter rise from behind a mask. Words never break mid-word. */
export function SplitText({ text, className = '', delay = 0, stagger = 0.035, inView = true, animateNow = false }) {
  const words = text.split(' ');
  let letterIndex = 0;
  const trigger = animateNow
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-40px' } };

  return (
    <motion.span className={`inline-block ${className}`} aria-label={text} {...(inView || animateNow ? trigger : {})}>
      {words.map((word, w) => (
        <span key={w} className="inline-block overflow-hidden align-bottom pt-[0.1em] -mt-[0.1em] pb-[0.14em] -mb-[0.14em] pr-[0.06em] -mr-[0.06em]" aria-hidden="true">
          {word.split('').map((ch) => {
            const i = letterIndex++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { y: '115%', rotate: 8 },
                  show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease, delay: delay + i * stagger } }
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/** Reveals a paragraph word-by-word as the reader scrolls through it. */
export function ScrollWords({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}

function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
}

/** Editorial section heading: roman numeral kicker, split title, drawn stitch. */
export function SectionHeading({ numeral, kicker, title, sub, align = 'center', tone = 'light', compact = false }) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  const titleColor = tone === 'dark' ? 'text-navy-950' : 'text-baroque-100';
  const kickerColor = tone === 'dark' ? 'text-sindoor' : 'text-baroque-400';
  const subColor = tone === 'dark' ? 'text-navy-950/70' : 'text-baroque-200/70';
  return (
    <div className={`flex flex-col ${alignCls} ${compact ? 'mb-5 sm:mb-7' : 'mb-10 sm:mb-14'}`}>
      <motion.div
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.32em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        className={`font-cinzel text-[10px] sm:text-xs uppercase ${kickerColor} flex items-center gap-3`}
      >
        <span className="font-serif italic text-base sm:text-lg tracking-normal normal-case">{numeral}</span>
        <span className="w-6 h-px bg-current opacity-60" />
        <span>{kicker}</span>
      </motion.div>
      <h2 className={`font-serif font-light italic leading-[1.05] mt-3 ${compact ? 'text-4xl sm:text-5xl' : 'text-[2.6rem] sm:text-6xl md:text-7xl'} ${titleColor}`}>
        <SplitText text={title} />
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.3, ease }}
        style={{ originX: align === 'left' ? 0 : 0.5 }}
        className={`mt-5 w-40 border-t-[1.5px] border-dashed ${tone === 'dark' ? 'border-sindoor/50' : 'border-baroque-400/50'}`}
      />
      {sub && (
        <Reveal delay={0.25} className={`font-serif italic text-base sm:text-lg ${subColor} mt-4 max-w-md`}>
          {sub}
        </Reveal>
      )}
    </div>
  );
}

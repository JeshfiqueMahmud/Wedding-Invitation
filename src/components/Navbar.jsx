import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { ShieldCheck, Menu, X, Calendar, MapPin, HeartHandshake } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { ease } from '../lib/motion';

const LINKS = [
  { href: '#blessing', label: 'Invitation' },
  { href: '#savedate', label: 'Dates' },
  { href: '#gallery', label: 'Moments' },
  { href: '#itinerary', label: 'Evenings' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#venue', label: 'Venue' },
  { href: '#guestbook', label: 'Wishes' }
];

export default function Navbar({ isAudioPlaying, setIsAudioPlaying, onOpenAdmin }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // hide while reading downward, return on the slightest scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400);
  });

  // highlight the section currently in view
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.div style={{ scaleX: progress, originX: 0 }} className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-holud via-holud-deep to-sindoor" />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !open ? -100 : 0 }}
        transition={{ duration: 0.45, ease }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl"
      >
        <nav className="navy-gold-card rounded-full pl-5 pr-2 py-2 flex items-center justify-between">
          <a
            href="#hero"
            className="font-serif font-bold text-2xl sm:text-[1.7rem] leading-none tracking-wide text-baroque-300 whitespace-nowrap px-1 py-1 [text-shadow:0_1px_10px_rgba(243,179,61,0.35)]"
            aria-label="Back to top"
          >
            J <span className="text-holud italic font-semibold">&amp;</span> T
          </a>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative px-3 py-1.5 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    isActive ? 'text-navy-950' : 'text-baroque-200/70 hover:text-baroque-100'
                  }`}
                >
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-holud" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <AudioPlayer isPlaying={isAudioPlaying} onToggle={() => setIsAudioPlaying(!isAudioPlaying)} />
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 rounded-full border border-baroque-400/25 hover:bg-baroque-400/15 text-baroque-300 transition-colors cursor-pointer"
              title="Organizer dashboard"
              aria-label="Organizer dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full border border-baroque-400/25 text-baroque-300 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="block">
                  {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu — an iris that opens from the menu button */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-navy-950 md:hidden flex flex-col justify-center px-8"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            onClick={() => setOpen(false)}
          >
            <p className="font-bangla text-holud text-lg mb-6">শুভ বিবাহ</p>
            <nav className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease }}
                  className="flex items-baseline gap-4 py-1.5 font-serif italic font-light text-4xl text-baroque-100"
                >
                  <span className="font-cinzel not-italic text-[10px] tracking-[0.2em] text-baroque-400 w-6">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onOpenAdmin();
              }}
              className="mt-10 self-start inline-flex items-center gap-2 font-cinzel text-[10px] tracking-[0.25em] uppercase text-baroque-300/70"
            >
              <ShieldCheck className="w-4 h-4" /> Organizer dashboard
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile quick-action bar */}
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: open ? 120 : 0 }}
        transition={{ delay: open ? 0 : 1, duration: 0.6, ease }}
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-sm pb-[env(safe-area-inset-bottom)]"
      >
        <div className="navy-gold-card rounded-full p-1.5 flex items-center justify-between">
          <a href="#savedate" className="flex-1 py-2 flex items-center justify-center gap-1.5 font-sans text-xs text-baroque-200/90">
            <Calendar className="w-3.5 h-3.5 text-holud" /> Dates
          </a>
          <motion.a
            whileTap={{ scale: 0.94 }}
            href="#rsvp"
            className="flex-1 py-2.5 rounded-full bg-holud text-navy-950 flex items-center justify-center gap-1.5 font-cinzel text-[11px] tracking-[0.2em] uppercase"
          >
            <HeartHandshake className="w-3.5 h-3.5" /> RSVP
          </motion.a>
          <a href="#venue" className="flex-1 py-2 flex items-center justify-center gap-1.5 font-sans text-xs text-baroque-200/90">
            <MapPin className="w-3.5 h-3.5 text-holud" /> Venue
          </a>
        </div>
      </motion.div>
    </>
  );
}

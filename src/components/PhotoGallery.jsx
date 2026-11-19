import { createPortal } from 'react-dom';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { SectionHeading, ease } from '../lib/motion';

const INITIAL = [
  { src: '/photos/1.jpg', title: 'Where it began', subtitle: 'Jeshfique & Tamanna' },
  { src: '/photos/2.jpg', title: 'A golden journey', subtitle: 'Chapter two' },
  { src: '/photos/3.jpg', title: 'Laughter & warmth', subtitle: 'Chapter three' },
  { src: '/photos/4.jpg', title: 'Road to forever', subtitle: 'Chapter four' },
  { src: '/photos/5.jpg', title: 'Blessings & joy', subtitle: 'Chapter five' },
  { src: '/photos/6.jpg', title: 'Heart to heart', subtitle: 'Chapter six' },
  { src: '/photos/7.jpg', title: 'Special moments', subtitle: 'Chapter seven' },
  { src: '/photos/8.jpg', title: 'Together, always', subtitle: 'Chapter eight' }
];

const slide = {
  enter: (d) => ({ x: d > 0 ? '60%' : d < 0 ? '-60%' : 0, opacity: d ? 0 : 1 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 })
};

const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5, -3, 2];
const OFFSETS = ['mt-0', 'mt-[4svh]', 'mt-[1svh]', 'mt-[5svh]', 'mt-0', 'mt-[3svh]', 'mt-[2svh]', 'mt-[4svh]'];

function PhotoCard({ photo, idx, progress, onOpen, hidden }) {
  // each photo drifts slightly inside its frame for a parallax feel
  const imgX = useTransform(progress, [0, 1], ['-8%', '8%']);
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(idx)}
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: TILTS[idx % TILTS.length] }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease, delay: (idx % 3) * 0.08 }}
      whileHover={{ rotate: 0, scale: 1.04, y: -10, zIndex: 5 }}
      className={`relative shrink-0 w-[min(64vw,38svh)] sm:w-[min(320px,38svh)] ${OFFSETS[idx % OFFSETS.length]} bg-ivory p-2.5 pb-14 rounded-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] cursor-zoom-in text-left`}
    >
      <motion.div layoutId={`photo-${photo.src}`} style={{ opacity: hidden ? 0 : 1 }} className="relative overflow-hidden aspect-[4/5] bg-navy-800">
        <motion.img
          src={photo.src}
          alt={photo.title}
          draggable={false}
          loading="lazy"
          style={{ x: imgX, scale: 1.2 }}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute left-3 right-3 bottom-3 flex items-baseline justify-between text-navy-950">
        <span className="font-serif italic text-lg sm:text-xl leading-none">{photo.title}</span>
        <span className="font-cinzel text-[9px] tracking-[0.2em] text-sindoor">{String(idx + 1).padStart(2, '0')}</span>
      </div>
    </motion.button>
  );
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(INITIAL);
  const [openIdx, setOpenIdx] = useState(null);
  const [originSrc, setOriginSrc] = useState(null);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(800);

  // measure how far the track has to travel sideways
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [photos.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const paginate = (dir) => {
    setDirection(dir);
    setOpenIdx((i) => (i + dir + photos.length) % photos.length);
  };

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIdx(null);
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openIdx, photos.length]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.map((file, i) => ({
      src: URL.createObjectURL(file),
      title: 'Your memory',
      subtitle: `Shared photo ${i + 1}`
    }));
    setPhotos((p) => [...p, ...added]);
    e.target.value = '';
  };

  const current = openIdx !== null ? photos[openIdx] : null;

  return (
    <>
      <section id="gallery" ref={sectionRef} className="relative" style={{ height: distance + vh }}>
        <div className="sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden pt-16 pb-6">
          <div className="px-5 max-w-5xl mx-auto w-full">
            <SectionHeading numeral="III." kicker="Moments" title="The road to forever" align="left" compact />
          </div>

          <motion.div ref={trackRef} style={{ x }} className="flex items-start gap-6 sm:gap-10 pl-[8vw] pr-[8vw] will-change-transform">
            {photos.map((photo, idx) => (
              <PhotoCard key={photo.src} photo={photo} idx={idx} progress={scrollYProgress} hidden={originSrc === photo.src} onOpen={(i) => {
                setDirection(0);
                setOriginSrc(photo.src);
                setOpenIdx(i);
              }} />
            ))}

            <label
              htmlFor="galleryPhotoInput"
              className="shrink-0 w-[min(64vw,38svh)] sm:w-[min(320px,38svh)] aspect-[4/5] mt-[3svh] rounded-sm border-2 border-dashed border-baroque-400/40 flex flex-col items-center justify-center gap-3 text-baroque-300 cursor-pointer hover:bg-baroque-400/5 hover:border-baroque-400 transition-colors"
            >
              <motion.span
                whileHover={{ rotate: 90 }}
                className="w-14 h-14 rounded-full border border-baroque-400/50 flex items-center justify-center"
              >
                <Plus className="w-6 h-6" />
              </motion.span>
              <span className="font-serif italic text-2xl">Add your photos</span>
              <span className="font-sans text-xs text-baroque-300/60 px-8 text-center">They stay on your device — just for you to see here.</span>
              <input id="galleryPhotoInput" type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          </motion.div>

          <div className="px-5 max-w-5xl mx-auto w-full mt-[4svh] flex items-center gap-4">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-baroque-300/70">01</span>
            <div className="flex-1 h-px bg-baroque-400/20 relative overflow-hidden">
              <motion.div style={{ scaleX: bar, originX: 0 }} className="absolute inset-0 bg-gradient-to-r from-holud to-sindoor" />
            </div>
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-baroque-300/70">{String(photos.length).padStart(2, '0')}</span>
          </div>
        </div>
      </section>

      {/* Lightbox — the tapped photo flies out of its frame */}
      {createPortal(
      <AnimatePresence onExitComplete={() => setOriginSrc(null)}>
        {current && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
            initial={{ backgroundColor: 'rgba(11,9,23,0)' }}
            animate={{ backgroundColor: 'rgba(11,9,23,0.94)' }}
            exit={{ backgroundColor: 'rgba(11,9,23,0)' }}
            onClick={() => setOpenIdx(null)}
          >
            <div className="relative w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
              <motion.div
                layoutId={`photo-${originSrc}`}
                className="relative overflow-hidden rounded-lg aspect-[4/5] max-h-[72vh] mx-auto bg-navy-900"
                transition={{ duration: 0.6, ease }}
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img
                    key={current.src}
                    src={current.src}
                    alt={current.title}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) paginate(1);
                      else if (info.offset.x > 60) paginate(-1);
                    }}
                    className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
                  />
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-4 flex items-center justify-between gap-3"
              >
                <button type="button" onClick={() => paginate(-1)} aria-label="Previous photo" className="w-11 h-11 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/15 flex items-center justify-center cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <p className="font-serif italic text-2xl text-baroque-100">{current.title}</p>
                  <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-baroque-400 mt-1">
                    {openIdx + 1} / {photos.length}
                  </p>
                </div>
                <button type="button" onClick={() => paginate(1)} aria-label="Next photo" className="w-11 h-11 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/15 flex items-center justify-center cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>

              <button
                type="button"
                onClick={() => setOpenIdx(null)}
                aria-label="Close photo"
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 rounded-full bg-holud text-navy-950 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}
    </>
  );
}

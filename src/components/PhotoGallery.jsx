import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause, Plus, Eye, Hand } from 'lucide-react';

export default function PhotoGallery() {
  const initialPhotos = [
    { src: '/photos/1.jpg', title: 'Cherished Memory #1', subtitle: 'Jeshfique & Faheema' },
    { src: '/photos/2.jpg', title: 'Cherished Memory #2', subtitle: 'A Golden Journey' },
    { src: '/photos/3.jpg', title: 'Cherished Memory #3', subtitle: 'Laughter & Warmth' },
    { src: '/photos/4.jpg', title: 'Cherished Memory #4', subtitle: 'Road to Forever' },
    { src: '/photos/5.jpg', title: 'Cherished Memory #5', subtitle: 'Blessings & Joy' },
    { src: '/photos/6.jpg', title: 'Cherished Memory #6', subtitle: 'Heart to Heart' },
    { src: '/photos/7.jpg', title: 'Cherished Memory #7', subtitle: 'Special Moments' },
    { src: '/photos/8.jpg', title: 'Cherished Memory #8', subtitle: 'Together Always' }
  ];

  const [photos, setPhotos] = useState(initialPhotos);
  const [activeIndex, setActiveIndex] = useState(3);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Detect mobile width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoplay, photos.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxPhoto) {
        if (e.key === 'Escape') setLightboxPhoto(null);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto]);

  // Touch Swipe for mobile with vertical scroll preservation
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].clientX;
    touchStartYRef.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only swipe if horizontal motion exceeds vertical motion
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }
  };

  // User upload local photos
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems = files.map((file, i) => ({
      src: URL.createObjectURL(file),
      title: `Uploaded Memory #${photos.length + i + 1}`,
      subtitle: 'Jeshfique & Faheema'
    }));
    setPhotos([...newItems, ...photos]);
    setActiveIndex(0);
  };

  // Update lightbox photo when activeIndex changes while modal is open
  useEffect(() => {
    if (lightboxPhoto) {
      setLightboxPhoto(photos[activeIndex]);
    }
  }, [activeIndex]);

  return (
    <section id="gallery" className="py-10 sm:py-14 text-center select-none overflow-hidden">
      <h2 className="font-cinzel text-sm sm:text-base tracking-[0.3em] uppercase text-baroque-300 mb-2">
        Photo Gallery
      </h2>
      <p className="font-serif italic text-xs sm:text-sm text-baroque-200/70 mb-4 sm:mb-8 px-4">
        Cherished moments on the road to forever — tap cards to view or swipe
      </p>

      {/* Mobile Swipe Hint Badge */}
      <div className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900/80 border border-baroque-400/30 text-[10px] text-baroque-300 mb-4 animate-pulse">
        <Hand className="w-3 h-3" />
        <span>Swipe left or right</span>
      </div>

      {/* 3D Coverflow Carousel Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="coverflow-stage relative h-[300px] sm:h-[400px] w-full max-w-[620px] mx-auto flex items-center justify-center touch-pan-y"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {photos.map((photo, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            // Screen-adaptive Coverflow spacing
            const stepX = isMobile ? 80 : 120;
            const translateX = offset * stepX;
            const rotateY = offset * (isMobile ? -20 : -25);
            const scale = isCenter ? 1 : Math.max(0.68, 1 - absOffset * (isMobile ? 0.16 : 0.12));
            const opacity = absOffset > (isMobile ? 2 : 3) ? 0 : Math.max(0, 1 - absOffset * 0.28);
            const zIndex = 30 - absOffset;

            return (
              <div
                key={photo.src + idx}
                onClick={() => {
                  if (isCenter) setLightboxPhoto(photo);
                  else setActiveIndex(idx);
                }}
                className={`coverflow-card absolute w-48 sm:w-64 h-64 sm:h-84 rounded-2xl border-2 border-baroque-400/75 shadow-[0_20px_45px_rgba(0,0,0,0.75)] overflow-hidden cursor-pointer bg-navy-900 group active:scale-95 ${
                  absOffset > (isMobile ? 2 : 3) ? 'pointer-events-none' : ''
                }`}
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  filter: isCenter ? 'brightness(1.05)' : 'brightness(0.68)'
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />

                {/* Fallback container */}
                <div className="hidden w-full h-full flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-navy-900 to-navy-950">
                  <div className="w-12 h-12 rounded-full border border-baroque-400/50 flex items-center justify-center text-xl mb-2">
                    ✨
                  </div>
                  <p className="font-cinzel text-xs font-bold text-baroque-200">{photo.title}</p>
                  <p className="font-serif italic text-xs text-baroque-300/80">{photo.subtitle}</p>
                </div>

                {/* Center Card Zoom Icon Indicator */}
                {isCenter && (
                  <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-navy-950/70 border border-baroque-400/50 text-baroque-300">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Bottom Caption Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/95 via-navy-950/65 to-transparent pt-6 pb-2.5 px-2.5 text-center pointer-events-none">
                  <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-baroque-100 tracking-wider truncate">
                    {photo.title}
                  </h3>
                  <p className="font-serif italic text-[10px] sm:text-xs text-baroque-300/90 truncate">
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Dots */}
      <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="w-10 h-10 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 max-w-[180px] sm:max-w-[200px] overflow-x-auto py-1">
            {photos.map((photo, idx) => (
              <button
                key={photo.title + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-5 bg-baroque-300' : 'w-2 bg-baroque-400/35 hover:bg-baroque-400/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Photo"
            className="w-10 h-10 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Autoplay Button */}
          <button
            type="button"
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isAutoplay
                ? 'border-baroque-400 bg-baroque-400/25 text-baroque-200 shadow-md'
                : 'border-baroque-400/40 text-baroque-200/70 hover:bg-baroque-400/15'
            }`}
            title={isAutoplay ? 'Pause autoplay' : 'Play slideshow'}
          >
            {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>

        {/* Add photos helper */}
        <label
          htmlFor="galleryPhotoInput"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-baroque-400/35 bg-navy-900/70 hover:bg-baroque-400/15 text-[11px] font-sans text-baroque-200/85 cursor-pointer transition-colors active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Your Photos</span>
          <input
            id="galleryPhotoInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setLightboxPhoto(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative max-w-lg w-full navy-gold-card rounded-2xl p-3 sm:p-4 text-center max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close photo"
              className="absolute top-2 right-2 w-9 h-9 rounded-full bg-baroque-400 text-navy-950 font-bold shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-xl overflow-hidden bg-navy-900 aspect-[3/4] max-h-[68vh] mx-auto w-full flex items-center justify-center">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain sm:object-cover"
              />
            </div>

            <h3 className="font-cinzel text-sm sm:text-base font-bold text-baroque-200 tracking-wider mt-2 sm:mt-3">
              {lightboxPhoto.title}
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-baroque-300/80 mt-0.5">
              {lightboxPhoto.subtitle}
            </p>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-sans">
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/20 active:scale-95"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-full border border-baroque-400/40 text-baroque-200 hover:bg-baroque-400/20 active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

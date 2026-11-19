import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function InvitationIntroOverlay({ onOpened, onStartMusic }) {
  // Opening animation stages:
  // 'closed' -> 'opening' (doors swing 3D 0s-0.85s) -> 'dissolving' (0.65s-1.3s scale & fade) -> 'finished' (unmounted)
  const [stage, setStage] = useState('closed');

  // Lock body scroll while closed or animating
  useEffect(() => {
    if (stage !== 'finished') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [stage]);

  const handleOpen = () => {
    if (stage !== 'closed') return;

    // Step 1: Start 3D door swing
    setStage('opening');

    // Trigger audio music playback if user wants
    if (onStartMusic) {
      onStartMusic();
    }

    // Step 2: Begin Dissolve & Zoom (0.65s)
    setTimeout(() => {
      setStage('dissolving');
    }, 650);

    // Step 3: Complete transition and clean up (1.3s)
    setTimeout(() => {
      setStage('finished');
      if (onOpened) onOpened();
    }, 1300);
  };

  if (stage === 'finished') {
    return null;
  }

  const isOpening = stage === 'opening' || stage === 'dissolving';
  const isDissolving = stage === 'dissolving';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Card"
      onClick={handleOpen}
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{
        opacity: isDissolving ? 0 : 1,
        transform: isDissolving ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease-out',
        pointerEvents: isDissolving ? 'none' : 'auto'
      }}
    >
      {/* Dimmed & Blurred Backdrop over Hero */}
      <div
        className="absolute inset-0 bg-[#040D1E]/88 backdrop-blur-md transition-opacity duration-700"
        style={{ opacity: isDissolving ? 0 : 1 }}
      >
        {/* Subtle royal damask repeating backdrop */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(22, 52, 102, 0.6) 0%, rgba(4, 13, 30, 0.95) 75%),
              repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.04) 0px, rgba(212, 175, 55, 0.04) 1px, transparent 1px, transparent 16px),
              repeating-linear-gradient(-45deg, rgba(212, 175, 55, 0.04) 0px, rgba(212, 175, 55, 0.04) 1px, transparent 1px, transparent 16px)`
          }}
        />

        {/* Ambient Floating Stardust Glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-baroque-400/10 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main 3D Stage Container */}
      <div
        className="relative z-10 w-[92vw] max-w-[360px] xs:max-w-[400px] sm:max-w-[500px] h-[520px] xs:h-[560px] sm:h-[620px] max-h-[86vh]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* --------------------------------------------------------- */}
        {/* INTERIOR CARD (Revealed directly as the doors swing open) */}
        {/* --------------------------------------------------------- */}
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-baroque-400/50 shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between p-6 sm:p-8 text-center"
          style={{
            background: 'radial-gradient(ellipse at 50% 25%, #0F2852 0%, #07152E 55%, #040D1E 100%)'
          }}
        >
          {/* Ornate Gold Inner Hairline */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-xl sm:rounded-2xl border border-baroque-400/30 pointer-events-none" />

          {/* Top Royal Crest */}
          <div className="pt-2 sm:pt-4">
            <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] text-baroque-300 uppercase">
              In The Name of Allah
            </p>
            <p className="font-serif italic text-xs sm:text-sm text-baroque-200/80 mt-1">
              Together with their families
            </p>
          </div>

          {/* Couple Center Names */}
          <div className="my-auto space-y-2">
            <span className="font-cinzel text-xs sm:text-sm tracking-[0.28em] text-baroque-400 uppercase">
              Welcome You To
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase gold-foil-text leading-tight">
              Jeshfique Mahmud
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-baroque-400/50" />
              <span className="font-script text-2xl sm:text-3xl text-baroque-300">&amp;</span>
              <span className="w-8 h-[1px] bg-baroque-400/50" />
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase gold-foil-text leading-tight">
              Faheema Shaheed Tamanna
            </h2>
            <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] text-baroque-200 uppercase pt-2">
              Royal Wedding Celebrations
            </p>
          </div>

          {/* Bottom Date & City */}
          <div className="pb-2 sm:pb-3 space-y-1">
            <p className="font-cinzel text-xs sm:text-sm text-baroque-300 tracking-[0.2em] font-semibold">
              25 &bull; 27 DECEMBER 2026
            </p>
            <p className="font-serif italic text-xs text-baroque-200/70">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* LEFT GATEFOLD DOOR (Swings open to -155deg)              */}
        {/* --------------------------------------------------------- */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1/2 rounded-l-2xl sm:rounded-l-3xl overflow-hidden border-y-2 border-l-2 border-baroque-400/60"
          style={{
            transformOrigin: 'left center',
            transform: isOpening ? 'rotateY(-155deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.85s ease',
            boxShadow: isOpening
              ? '-25px 20px 40px rgba(0,0,0,0.85)'
              : '-10px 15px 35px rgba(0,0,0,0.6)',
            background: 'linear-gradient(135deg, #091D3E 0%, #06152D 50%, #030A17 100%)',
            willChange: 'transform'
          }}
        >
          {/* Luxurious Damask Crosshatch & Bevel Lighting */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.05) 0px, rgba(212, 175, 55, 0.05) 1px, transparent 1px, transparent 12px),
                repeating-linear-gradient(-45deg, rgba(212, 175, 55, 0.05) 0px, rgba(212, 175, 55, 0.05) 1px, transparent 1px, transparent 12px)`
            }}
          />

          {/* Left Door Gold Inset Hairline Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-baroque-400/35 rounded-l-xl pointer-events-none" />

          {/* Right Edge Gold Filigree Border (Meets at the center seam) */}
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-baroque-500 via-baroque-200 to-baroque-600 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />

          {/* Top-Left Baroque Corner Ornament (SVG) */}
          <svg className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 text-baroque-400/80 pointer-events-none" viewBox="0 0 40 40" fill="none">
            <path d="M2 38 L2 2 L38 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 34 L6 6 L34 6" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <path d="M12 12 Q24 14 26 26" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Bottom-Left Baroque Corner Ornament (SVG) */}
          <svg className="absolute bottom-3 left-3 w-8 h-8 sm:w-10 sm:h-10 text-baroque-400/80 pointer-events-none scale-y-[-1]" viewBox="0 0 40 40" fill="none">
            <path d="M2 38 L2 2 L38 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 34 L6 6 L34 6" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>

          {/* Left Door Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 text-right pr-4 sm:pr-6">
            <div className="pt-4">
              <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-baroque-300/80 block">
                The Wedding
              </span>
              <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.22em] text-baroque-400/70 block">
                Invitation
              </span>
            </div>

            <div className="my-auto pr-1">
              <p className="font-cinzel text-xs sm:text-base font-semibold tracking-[0.16em] uppercase gold-foil-text">
                Jeshfique
              </p>
              <p className="font-serif italic text-[11px] sm:text-xs text-baroque-200/70">
                Groom
              </p>
            </div>

            <div className="pb-3 text-right">
              <span className="font-cinzel text-[8px] sm:text-[10px] tracking-[0.25em] text-baroque-400/90 uppercase">
                Dhaka
              </span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* RIGHT GATEFOLD DOOR (Swings open to 155deg)              */}
        {/* --------------------------------------------------------- */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1/2 rounded-r-2xl sm:rounded-r-3xl overflow-hidden border-y-2 border-r-2 border-baroque-400/60"
          style={{
            transformOrigin: 'right center',
            transform: isOpening ? 'rotateY(155deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.85s ease',
            boxShadow: isOpening
              ? '25px 20px 40px rgba(0,0,0,0.85)'
              : '10px 15px 35px rgba(0,0,0,0.6)',
            background: 'linear-gradient(225deg, #091D3E 0%, #06152D 50%, #030A17 100%)',
            willChange: 'transform'
          }}
        >
          {/* Luxurious Damask Crosshatch & Bevel Lighting */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(212, 175, 55, 0.05) 0px, rgba(212, 175, 55, 0.05) 1px, transparent 1px, transparent 12px),
                repeating-linear-gradient(-45deg, rgba(212, 175, 55, 0.05) 0px, rgba(212, 175, 55, 0.05) 1px, transparent 1px, transparent 12px)`
            }}
          />

          {/* Right Door Gold Inset Hairline Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-baroque-400/35 rounded-r-xl pointer-events-none" />

          {/* Left Edge Gold Filigree Border (Meets at the center seam) */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-baroque-500 via-baroque-200 to-baroque-600 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />

          {/* Top-Right Baroque Corner Ornament (SVG) */}
          <svg className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 text-baroque-400/80 pointer-events-none scale-x-[-1]" viewBox="0 0 40 40" fill="none">
            <path d="M2 38 L2 2 L38 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 34 L6 6 L34 6" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <path d="M12 12 Q24 14 26 26" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Bottom-Right Baroque Corner Ornament (SVG) */}
          <svg className="absolute bottom-3 right-3 w-8 h-8 sm:w-10 sm:h-10 text-baroque-400/80 pointer-events-none scale-x-[-1] scale-y-[-1]" viewBox="0 0 40 40" fill="none">
            <path d="M2 38 L2 2 L38 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 34 L6 6 L34 6" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>

          {/* Right Door Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 text-left pl-4 sm:pl-6">
            <div className="pt-4">
              <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-baroque-300/80 block">
                Celebration
              </span>
              <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.22em] text-baroque-400/70 block">
                December 2026
              </span>
            </div>

            <div className="my-auto pl-1">
              <p className="font-cinzel text-xs sm:text-base font-semibold tracking-[0.16em] uppercase gold-foil-text">
                Faheema
              </p>
              <p className="font-serif italic text-[11px] sm:text-xs text-baroque-200/70">
                Bride
              </p>
            </div>

            <div className="pb-3 text-left">
              <span className="font-cinzel text-[8px] sm:text-[10px] tracking-[0.25em] text-baroque-400/90 uppercase">
                2026
              </span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* TACTILE 3D WAX SEAL / EMBOSSED ROYAL MEDALLION            */}
        {/* Placed centered over the seam                             */}
        {/* --------------------------------------------------------- */}
        <div
          className="absolute top-1/2 left-1/2 z-30 flex flex-col items-center pointer-events-auto"
          style={{
            transform: isOpening
              ? 'translate(-50%, -50%) scale(1.25)'
              : 'translate(-50%, -50%) scale(1)',
            opacity: isOpening ? 0 : 1,
            transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
          }}
        >
          {/* Circular Metallic Seal */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 flex items-center justify-center relative shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFF5D6 0%, #D4AF37 45%, #946F19 80%, #5E4307 100%)'
            }}
          >
            {/* Outer Beaded / Cogged Ring */}
            <div className="absolute inset-1 rounded-full border border-[#FFF2CD]/70 shadow-inner" />
            <div className="absolute inset-2 rounded-full border border-[#8C6414]/80" />

            {/* Inner Recessed Medallion Plate */}
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 50% 45%, #0B1E40 0%, #040D1E 100%)',
                border: '1.5px solid #E5C675'
              }}
            >
              {/* Couple Embossed Monogram */}
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider gold-foil-text leading-none pt-0.5">
                J &amp; F
              </span>
              <span className="font-cinzel text-[7px] sm:text-[8px] tracking-[0.25em] text-baroque-300/80 uppercase mt-0.5">
                DHAKA 2026
              </span>

              {/* Shimmer sparkle */}
              <Sparkles className="absolute top-1 right-2 w-2.5 h-2.5 text-baroque-200 animate-pulse opacity-75" />
            </div>
          </div>

          {/* Theme-Matched "Tap to Open" Prompt Pill */}
          <div className="mt-3.5 sm:mt-4 px-3 sm:px-4 py-1.5 rounded-full bg-navy-950/90 border border-baroque-400/50 shadow-xl backdrop-blur-sm flex items-center gap-1.5 animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-baroque-200 font-semibold">
              Tap To Open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

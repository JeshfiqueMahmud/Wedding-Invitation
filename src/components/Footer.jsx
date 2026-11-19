import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onReplayIntro }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-10 pb-8 text-center relative z-20">
      <p className="font-cinzel text-[10px] tracking-[0.28em] uppercase text-baroque-300/75 mb-3">
        With Love &amp; Gratitude
      </p>
      <p className="font-script text-4xl sm:text-5xl gold-foil-text mb-6">
        Jeshfique &amp; Faheema
      </p>

      {/* Bottom Grand Midnight Navy & Baroque Gold Floral Bouquet */}
      <div className="w-full max-w-md mx-auto px-4">
        <svg viewBox="0 0 420 110" className="w-full h-auto" fill="none">
          {/* Gold Sweeping Acanthus Scrolls */}
          <path
            d="M10 102 C35 55, 85 45, 130 72 C155 88, 175 75, 210 55 C245 75, 265 88, 290 72 C335 45, 385 55, 410 102"
            stroke="url(#baroqueGold)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M35 104 C65 72, 105 70, 145 92 M385 104 C355 72, 315 70, 275 92"
            stroke="url(#baroqueGold)"
            strokeWidth="1.6"
          />
          {/* Left Ivory Rose */}
          <circle cx="118" cy="78" r="20" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1.2" />
          <path d="M110 74 C115 66, 125 67, 126 75 C127 83, 114 86, 110 79" fill="none" stroke="#B88924" strokeWidth="1.2" />

          {/* Center Large Midnight Navy Rose */}
          <circle cx="210" cy="64" r="32" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1.3" />
          <path
            d="M196 58 C203 44, 223 46, 226 60 C228 75, 204 82, 195 70 C188 60, 203 48, 214 56"
            fill="none"
            stroke="#3B68B5"
            strokeWidth="1.6"
            opacity="0.75"
          />
          <path d="M203 61 C207 54, 216 55, 217 62 C218 69, 207 72, 203 66" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.7" />

          {/* Flanking Navy & Ivory Roses */}
          <circle cx="164" cy="74" r="22" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1.1" />
          <circle cx="256" cy="74" r="22" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1.1" />
          <circle cx="302" cy="78" r="20" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1.2" />
          <path d="M294 74 C299 66, 309 67, 310 75 C311 83, 298 86, 294 79" fill="none" stroke="#B88924" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-xs font-sans text-baroque-300/60">
        <div className="flex items-center gap-3">
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="px-3 py-1.5 rounded-full border border-baroque-400/40 hover:bg-baroque-400/20 text-baroque-300 transition-all cursor-pointer inline-flex items-center gap-1.5"
              title="Re-open Royal Invitation Card"
            >
              <span className="text-[10px] uppercase tracking-widest font-cinzel">View Invitation Card</span>
            </button>
          )}
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-full border border-baroque-400/30 hover:bg-baroque-400/20 text-baroque-300 transition-all cursor-pointer inline-flex items-center gap-1"
            title="Back to Top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-widest">Back to Top</span>
          </button>
        </div>
        <p className="text-[11px] mt-1">
          December 2026 • Dhaka, Bangladesh
        </p>
      </div>
    </footer>
  );
}

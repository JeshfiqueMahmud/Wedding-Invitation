import React from 'react';

export default function BlessingSection() {
  return (
    <section id="blessing" className="relative py-10 sm:py-14 px-3 sm:px-8 text-center">
      {/* Side Baroque Corner Sprays (Hidden on mobile) */}
      <svg
        className="w-16 h-28 absolute left-0 top-10 opacity-75 pointer-events-none hidden md:block"
        viewBox="0 0 80 140"
        fill="none"
      >
        <circle cx="22" cy="45" r="14" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="0.9" />
        <circle cx="34" cy="74" r="11" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
        <circle cx="20" cy="100" r="13" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="0.9" />
        <path d="M12 20 C35 35, 45 65, 25 120" stroke="url(#baroqueGold)" strokeWidth="1.2" fill="none" />
      </svg>
      <svg
        className="w-16 h-28 absolute right-0 top-10 opacity-75 pointer-events-none hidden md:block scale-x-[-1]"
        viewBox="0 0 80 140"
        fill="none"
      >
        <circle cx="22" cy="45" r="14" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="0.9" />
        <circle cx="34" cy="74" r="11" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
        <circle cx="20" cy="100" r="13" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="0.9" />
        <path d="M12 20 C35 35, 45 65, 25 120" stroke="url(#baroqueGold)" strokeWidth="1.2" fill="none" />
      </svg>

      <p className="font-cinzel text-[10px] sm:text-xs leading-[2] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-baroque-200/90 max-w-md mx-auto">
        In the name of Allah, the Most Gracious, the Most Merciful.
        <br />
        Together with their beloved families, we joyfully invite you to grace the wedding celebrations of
      </p>

      {/* Small Gold Fleur Divider */}
      <div className="my-4 sm:my-5 text-baroque-400 text-sm">❖</div>

      {/* Script Couple Names (Mobile responsive typography) */}
      <div className="space-y-1 sm:space-y-2 my-4 sm:my-6">
        <h3 className="font-script text-3xl xs:text-4xl sm:text-6xl gold-foil-text py-0.5 sm:py-1 leading-tight">
          Jeshfique Mahmud
        </h3>
        <p className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-baroque-300/75">
          with
        </p>
        <h3 className="font-script text-3xl xs:text-4xl sm:text-6xl gold-foil-text py-0.5 sm:py-1 leading-tight">
          Faheema Shaheed Tamanna
        </h3>
      </div>

      <p className="font-serif italic text-xs sm:text-base text-baroque-200/80 max-w-sm mx-auto mt-3 sm:mt-4 px-2">
        “And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.”
      </p>
      <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-baroque-400/80 mt-1">
        — Surah Ar-Rum [30:21]
      </p>

      {/* Ornamental Gold Floral Divider */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center">
        <svg className="w-40 sm:w-48 h-7 sm:h-8" viewBox="0 0 240 36" fill="none">
          <path d="M10 18 L92 18 M148 18 L230 18" stroke="url(#baroqueGold)" strokeWidth="1" opacity="0.75" />
          <path
            d="M95 18 C105 6, 114 8, 120 18 C126 8, 135 6, 145 18 C135 30, 126 28, 120 18 C114 28, 105 30, 95 18 Z"
            fill="url(#baroqueGold)"
          />
          <circle cx="120" cy="18" r="3" fill="#061226" />
        </svg>
      </div>
    </section>
  );
}

import React from 'react';

export default function ItinerarySection() {
  const events = [
    {
      time: '25 Dec • 6:00 PM',
      icon: '🌼',
      title: 'Gaye Holud',
      location: 'Eagle Hall, BAF Base Bashar',
      isLeft: true
    },
    {
      time: '8:30 PM – 11:30 PM',
      icon: '🎶',
      title: 'Holud & Folk Night',
      location: 'Blessings & Feast',
      isLeft: false
    },
    {
      time: '27 Dec • 6:00 PM',
      icon: '✨',
      title: 'Wedding Reception',
      location: 'SKS Convention Hall',
      isLeft: true
    },
    {
      time: '8:30 PM – 11:30 PM',
      icon: '🥂',
      title: 'Royal Banquet',
      location: 'Feast & Portraits',
      isLeft: false
    }
  ];

  return (
    <section id="itinerary" className="py-10 sm:py-14 px-2 sm:px-4 text-center">
      <h2 className="font-cinzel text-sm sm:text-base tracking-[0.28em] uppercase text-baroque-300 mb-6 sm:mb-8 font-semibold">
        Celebration Itinerary
      </h2>

      {/* Vertical Gold Timeline */}
      <div className="max-w-sm mx-auto relative space-y-6 sm:space-y-8">
        {/* Center Vertical Line */}
        <div className="absolute left-1/2 top-2 bottom-2 w-[1px] -translate-x-1/2 bg-baroque-400/50" />

        {events.map((ev, i) => (
          <div key={i} className="relative flex items-center justify-between">
            {ev.isLeft ? (
              <>
                <div className="w-[44%] text-right pr-2 sm:pr-3">
                  <span className="text-lg sm:text-xl inline-block transform hover:scale-125 transition-transform">
                    {ev.icon}
                  </span>
                  <p className="font-sans text-[10px] sm:text-[11px] text-baroque-300 font-semibold mt-0.5 leading-tight">
                    {ev.time}
                  </p>
                </div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-baroque-300 border-2 border-navy-950 z-10 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <div className="w-[44%] text-left pl-2 sm:pl-3">
                  <p className="font-cinzel text-[11px] sm:text-xs font-bold text-baroque-100 uppercase leading-snug">
                    {ev.title}
                  </p>
                  <p className="font-serif italic text-[11px] sm:text-xs text-baroque-200/80 leading-tight">
                    {ev.location}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-[44%] text-right pr-2 sm:pr-3">
                  <p className="font-cinzel text-[11px] sm:text-xs font-bold text-baroque-100 uppercase leading-snug">
                    {ev.title}
                  </p>
                  <p className="font-serif italic text-[11px] sm:text-xs text-baroque-200/80 leading-tight">
                    {ev.location}
                  </p>
                </div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-baroque-300 border-2 border-navy-950 z-10 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                <div className="w-[44%] text-left pl-2 sm:pl-3">
                  <span className="text-lg sm:text-xl inline-block transform hover:scale-125 transition-transform">
                    {ev.icon}
                  </span>
                  <p className="font-sans text-[10px] sm:text-[11px] text-baroque-300 font-semibold mt-0.5 leading-tight">
                    {ev.time}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Ornamental Gold Floral Divider */}
      <div className="mt-8 sm:mt-10 flex items-center justify-center">
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

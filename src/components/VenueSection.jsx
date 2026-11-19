import React, { useState } from 'react';
import { MapPin, Navigation, Car, ExternalLink, Compass } from 'lucide-react';

export default function VenueSection() {
  const [selectedVenue, setSelectedVenue] = useState('holud');
  const [mapMode, setMapMode] = useState('live'); // 'live' for real Google Map, 'vector' for illustrated map

  const venues = {
    holud: {
      title: 'Eagle Hall',
      subtitle: 'BAF Base Bashar',
      fullAddress: 'Eagle Hall, BAF Base Bashar',
      date: '25th December 2026 • 6:00 PM',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Eagle+Hall,+BAF+Base+Bashar',
      appleMapsUrl: 'https://maps.apple.com/?q=Eagle+Hall+BAF+Base+Bashar',
      uberUrl: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=Eagle%20Hall%2C%20BAF%20Base%20Bashar',
      embedUrl: 'https://maps.google.com/maps?q=Eagle+Hall,+BAF+Base+Bashar&t=&z=15&ie=UTF8&iwloc=&output=embed',
      pinTop: '44%',
      pinLeft: '43%',
      areaTag: 'BAF Base Bashar'
    },
    reception: {
      title: 'SKS Convention Hall',
      subtitle: 'SKS Tower, 7 VIP Road, Mohakhali, Dhaka',
      fullAddress: 'SKS Convention Hall, SKS Tower, 7 VIP Road, Mohakhali, Dhaka',
      date: '27th December 2026 • 6:00 PM',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SKS+Convention+Hall+Mohakhali+Dhaka',
      appleMapsUrl: 'https://maps.apple.com/?q=SKS+Convention+Hall+Mohakhali+Dhaka',
      uberUrl: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=SKS%20Convention%20Hall%2C%20Mohakhali%2C%20Dhaka',
      embedUrl: 'https://maps.google.com/maps?q=SKS+Convention+Hall+Mohakhali+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed',
      pinTop: '32%',
      pinLeft: '58%',
      areaTag: 'Mohakhali / VIP Road'
    }
  };

  const current = venues[selectedVenue];

  return (
    <section id="venue" className="py-10 sm:py-14 px-2 sm:px-6 text-center">
      <h2 className="font-cinzel text-sm sm:text-base tracking-[0.28em] uppercase text-baroque-300 mb-1.5 sm:mb-2">
        How To Get There
      </h2>
      <p className="font-serif italic text-xs sm:text-sm text-baroque-200/80 max-w-md mx-auto mb-4 sm:mb-5 px-3">
        Both venues are centrally located in Dhaka. Select an event for maps, directions, and instant ride booking.
      </p>

      {/* Venue Selector Pills (Responsive on mobile) */}
      <div className="inline-flex p-1 rounded-full border border-baroque-400/35 bg-navy-900/80 mb-5 max-w-full shadow-md">
        <button
          type="button"
          onClick={() => setSelectedVenue('holud')}
          className={`px-3 sm:px-4 py-1.5 rounded-full font-cinzel text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer ${
            selectedVenue === 'holud'
              ? 'bg-baroque-400 text-navy-950 font-bold shadow-md'
              : 'text-baroque-200 hover:text-white'
          }`}
        >
          Eagle Hall (25 Dec)
        </button>
        <button
          type="button"
          onClick={() => setSelectedVenue('reception')}
          className={`px-3 sm:px-4 py-1.5 rounded-full font-cinzel text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer ${
            selectedVenue === 'reception'
              ? 'bg-baroque-400 text-navy-950 font-bold shadow-md'
              : 'text-baroque-200 hover:text-white'
          }`}
        >
          SKS Convention Hall (27 Dec)
        </button>
      </div>

      {/* Interactive Map Card */}
      <div className="max-w-md mx-auto rounded-3xl overflow-hidden bg-white text-slate-900 shadow-2xl border-2 border-baroque-400/40 text-left">
        {/* Top Info Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="font-sans font-bold text-sm text-slate-900">
                {current.title}
              </h3>
            </div>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              {current.subtitle}
            </p>
          </div>

          {/* Action buttons (Touch-friendly on mobile) */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <a
              href={current.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-sans text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow"
              title="Open Google Maps"
            >
              <Navigation className="w-3 h-3" />
              <span>Google</span>
            </a>
            <a
              href={current.appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-sans text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow"
              title="Open Apple Maps"
            >
              <Compass className="w-3 h-3" />
              <span>Apple</span>
            </a>
            <a
              href={current.uberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 active:scale-95 text-white font-sans text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow"
              title="Book Uber Ride"
            >
              <Car className="w-3 h-3" />
              <span>Uber</span>
            </a>
          </div>
        </div>

        {/* Map View Mode Switcher Pill */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] font-sans">
          <span className="font-semibold text-slate-700 truncate mr-2">
            📍 {current.fullAddress}
          </span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300 shrink-0">
            <button
              type="button"
              onClick={() => setMapMode('live')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                mapMode === 'live'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Map
            </button>
            <button
              type="button"
              onClick={() => setMapMode('vector')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                mapMode === 'vector'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Route Guide
            </button>
          </div>
        </div>

        {/* Map Display Container */}
        {mapMode === 'live' ? (
          <div className="relative h-56 sm:h-64 bg-slate-100 overflow-hidden">
            <iframe
              title={current.title}
              src={current.embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          /* Stylized Dhaka Map Vector */
          <div className="relative h-48 sm:h-56 bg-[#EBF0F5] overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 400 220" fill="none">
              <rect width="400" height="220" fill="#EEF2F6" />
              <path d="M0 65 L400 95" stroke="#FFFFFF" strokeWidth="10" />
              <path d="M140 0 L175 220" stroke="#FFFFFF" strokeWidth="12" />
              <path d="M275 0 L245 220" stroke="#FCD34D" strokeWidth="6" opacity="0.75" />
              <path d="M40 175 Q200 135 380 165" stroke="#FFFFFF" strokeWidth="8" />

              {/* Landmark areas */}
              <rect x="45" y="95" width="85" height="45" rx="8" fill="#D1FAE5" />
              <rect x="285" y="30" width="80" height="42" rx="8" fill="#DBEAFE" />
              <text x="50" y="122" fill="#065F46" fontFamily="sans-serif" fontSize="9" fontWeight="600">
                BAF Base Bashar
              </text>
              <text x="295" y="55" fill="#1E40AF" fontFamily="sans-serif" fontSize="9" fontWeight="600">
                Mohakhali / Gulshan
              </text>
              <text x="185" y="195" fill="#64748B" fontFamily="sans-serif" fontSize="9">
                Airport Road (VIP Rd)
              </text>
            </svg>

            {/* Animated Red Map Pin */}
            <div
              className="absolute flex flex-col items-center transition-all duration-500 -translate-x-1/2 -translate-y-full"
              style={{ top: current.pinTop, left: current.pinLeft }}
            >
              <span className="px-2 py-0.5 rounded-md bg-white shadow-lg font-sans text-[10px] sm:text-[11px] font-bold text-slate-800 mb-1 whitespace-nowrap border border-slate-200">
                {current.title}
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs animate-bounce">
                <MapPin className="w-3.5 h-3.5 fill-white text-red-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      <a
        href={current.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-3 sm:mt-4 font-cinzel text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-baroque-300 hover:text-white underline underline-offset-4"
      >
        <span>Open in Google Maps</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </section>
  );
}

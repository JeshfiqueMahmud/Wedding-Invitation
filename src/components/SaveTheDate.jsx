import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Download, Clock, ExternalLink } from 'lucide-react';

export default function SaveTheDate() {
  const [selectedEvent, setSelectedEvent] = useState('holud'); // 'holud' or 'reception'
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Countdown target: Gaye Holud on 25th Dec 2026 at 6:00 PM BST (UTC+6)
  useEffect(() => {
    const targetDate = new Date('2026-12-25T18:00:00+06:00').getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Download .ics calendar file
  const downloadICS = (type) => {
    const isHolud = type === 'holud';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jeshfique & Faheema Wedding//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART;TZID=Asia/Dhaka:${isHolud ? '20261225T180000' : '20261227T180000'}`,
      `DTEND;TZID=Asia/Dhaka:${isHolud ? '20261225T233000' : '20261227T233000'}`,
      `SUMMARY:${isHolud ? 'Gaye Holud: Jeshfique Mahmud & Faheema Shaheed Tamanna' : 'Wedding Reception: Jeshfique Mahmud & Faheema Shaheed Tamanna'}`,
      `DESCRIPTION:${isHolud ? 'Join us for the festive Gaye Holud celebrations of Jeshfique & Faheema.' : 'Join us for the Royal Wedding Reception of Jeshfique & Faheema.'}`,
      `LOCATION:${isHolud ? 'Eagle Hall, BAF Base Bashar' : 'SKS Convention Hall, SKS Tower, Mohakhali, Dhaka'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isHolud ? 'Jeshfique-Faheema-Gaye-Holud.ics' : 'Jeshfique-Faheema-Wedding-Reception.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isHolud = selectedEvent === 'holud';

  const googleCalUrl = isHolud
    ? 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Gaye+Holud:+Jeshfique+Mahmud+%26+Faheema+Shaheed+Tamanna&dates=20261225T120000Z/20261225T173000Z&details=Festive+Gaye+Holud+Celebration&location=Eagle+Hall,+BAF+Base+Bashar'
    : 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception:+Jeshfique+Mahmud+%26+Faheema+Shaheed+Tamanna&dates=20261227T120000Z/20261227T173000Z&details=Royal+Wedding+Reception&location=SKS+Convention+Hall,+Mohakhali,+Dhaka';

  return (
    <section id="savedate" className="relative py-10 sm:py-14 px-2 sm:px-6 text-center">
      {/* Top Baroque Floral Corner Brackets */}
      <div className="flex items-center justify-between mb-2 opacity-85 pointer-events-none max-w-lg mx-auto">
        <svg className="w-20 sm:w-32 h-14 sm:h-16" viewBox="0 0 140 70" fill="none">
          <path d="M8 62 C12 24, 42 12, 125 10" stroke="url(#baroqueGold)" strokeWidth="1.6" />
          <circle cx="34" cy="28" r="14" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="58" cy="20" r="10" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1" />
          <circle cx="20" cy="48" r="9" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
        </svg>
        <svg className="w-20 sm:w-32 h-14 sm:h-16 scale-x-[-1]" viewBox="0 0 140 70" fill="none">
          <path d="M8 62 C12 24, 42 12, 125 10" stroke="url(#baroqueGold)" strokeWidth="1.6" />
          <circle cx="34" cy="28" r="14" fill="url(#navyRoseGrad)" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="58" cy="20" r="10" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="1" />
          <circle cx="20" cy="48" r="9" fill="url(#ivoryRoseGrad)" stroke="#B88924" strokeWidth="0.9" />
        </svg>
      </div>

      <h2 className="font-cinzel text-sm sm:text-lg tracking-[0.28em] uppercase text-baroque-300">
        Save Our Dates
      </h2>
      <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.22em] uppercase text-baroque-200/75 mt-1.5 sm:mt-2">
        Two Unforgettable Evenings in Dhaka
      </p>

      {/* Event Date Switcher Pill (Full width friendly on phone) */}
      <div className="inline-flex p-1 rounded-full border border-baroque-400/35 bg-navy-900/80 mt-4 sm:mt-5 mb-5 sm:mb-6 shadow-md max-w-full">
        <button
          type="button"
          onClick={() => setSelectedEvent('holud')}
          className={`px-3.5 sm:px-4 py-1.5 rounded-full font-cinzel text-[10px] sm:text-[11px] tracking-wider uppercase transition-all cursor-pointer ${
            isHolud
              ? 'bg-baroque-400 text-navy-950 font-bold shadow-md'
              : 'text-baroque-200 hover:text-white'
          }`}
        >
          25 Dec • Holud
        </button>
        <button
          type="button"
          onClick={() => setSelectedEvent('reception')}
          className={`px-3.5 sm:px-4 py-1.5 rounded-full font-cinzel text-[10px] sm:text-[11px] tracking-wider uppercase transition-all cursor-pointer ${
            !isHolud
              ? 'bg-baroque-400 text-navy-950 font-bold shadow-md'
              : 'text-baroque-200 hover:text-white'
          }`}
        >
          27 Dec • Reception
        </button>
      </div>

      {/* Featured Ornamental Date Display */}
      <div className="my-3 sm:my-4 transition-all duration-300">
        <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] uppercase text-baroque-300 mb-2">
          {isHolud ? 'FRIDAY • GAYE HOLUD' : 'SUNDAY • WEDDING RECEPTION'}
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Left Laurel */}
          <svg className="w-6 sm:w-10 h-12 sm:h-14 text-baroque-400" viewBox="0 0 40 60" fill="none">
            <path d="M32 54 C14 42, 10 20, 28 6" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="16" cy="40" rx="5" ry="2.5" transform="rotate(-35 16 40)" fill="currentColor" />
            <ellipse cx="13" cy="28" rx="5" ry="2.5" transform="rotate(-15 13 28)" fill="currentColor" />
            <ellipse cx="18" cy="16" rx="5" ry="2.5" transform="rotate(20 18 16)" fill="currentColor" />
          </svg>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="font-cinzel text-4xl sm:text-6xl font-bold gold-foil-text">
              {isHolud ? '25' : '27'}
            </span>
            <div className="text-left font-cinzel text-[11px] sm:text-sm tracking-[0.2em] uppercase text-baroque-200 leading-snug">
              <div>DECEMBER</div>
              <div>2026</div>
            </div>
          </div>

          {/* Right Laurel */}
          <svg className="w-6 sm:w-10 h-12 sm:h-14 text-baroque-400 scale-x-[-1]" viewBox="0 0 40 60" fill="none">
            <path d="M32 54 C14 42, 10 20, 28 6" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="16" cy="40" rx="5" ry="2.5" transform="rotate(-35 16 40)" fill="currentColor" />
            <ellipse cx="13" cy="28" rx="5" ry="2.5" transform="rotate(-15 13 28)" fill="currentColor" />
            <ellipse cx="18" cy="16" rx="5" ry="2.5" transform="rotate(20 18 16)" fill="currentColor" />
          </svg>
        </div>

        <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em] uppercase text-baroque-300 mt-2 sm:mt-3 font-medium px-2">
          {isHolud
            ? '6:00 PM – 11:30 PM • EAGLE HALL, BAF BASE BASHAR'
            : '6:00 PM – 11:30 PM • SKS CONVENTION HALL, DHAKA'}
        </p>
      </div>

      {/* December 2026 Monthly Calendar Grid */}
      <div className="max-w-[320px] sm:max-w-sm mx-auto mt-6 sm:mt-8 mb-6 navy-gold-card rounded-2xl p-3.5 sm:p-5">
        <p className="font-cinzel text-xs tracking-[0.25em] uppercase text-baroque-200 mb-3 sm:mb-4 font-semibold">
          December 2026
        </p>
        <div className="grid grid-cols-7 gap-y-2 text-center font-sans text-xs">
          <span className="text-baroque-400/80 font-semibold">S</span>
          <span className="text-baroque-400/80 font-semibold">M</span>
          <span className="text-baroque-400/80 font-semibold">T</span>
          <span className="text-baroque-400/80 font-semibold">W</span>
          <span className="text-baroque-400/80 font-semibold">T</span>
          <span className="text-baroque-400/80 font-semibold">F</span>
          <span className="text-baroque-400/80 font-semibold">S</span>

          <span></span>
          <span></span>

          {[...Array(24)].map((_, i) => (
            <span key={i + 1} className="text-baroque-100/70 py-1">
              {i + 1}
            </span>
          ))}

          {/* 25th Dec: Holud */}
          <button
            type="button"
            onClick={() => setSelectedEvent('holud')}
            title="25th Dec — Gaye Holud"
            className="relative flex items-center justify-center py-1 font-bold text-navy-950 cursor-pointer group active:scale-95"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform ${
                isHolud
                  ? 'bg-gradient-to-br from-baroque-200 to-baroque-500 ring-2 ring-white text-navy-950 scale-110'
                  : 'bg-baroque-400/70 text-navy-950'
              }`}
            >
              25
            </span>
          </button>

          <span className="text-baroque-100/70 py-1">26</span>

          {/* 27th Dec: Reception */}
          <button
            type="button"
            onClick={() => setSelectedEvent('reception')}
            title="27th Dec — Wedding Reception"
            className="relative flex items-center justify-center py-1 font-bold text-navy-950 cursor-pointer group active:scale-95"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform ${
                !isHolud
                  ? 'bg-gradient-to-br from-baroque-200 to-baroque-500 ring-2 ring-white text-navy-950 scale-110'
                  : 'bg-baroque-400/70 text-navy-950'
              }`}
            >
              27
            </span>
          </button>

          {[28, 29, 30, 31].map((d) => (
            <span key={d} className="text-baroque-100/70 py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Action buttons */}
        <div className="mt-4 pt-3 border-t border-baroque-400/20 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-sans">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-baroque-400/20 hover:bg-baroque-400/35 text-baroque-200 transition-colors cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Google Calendar</span>
          </a>
          <button
            type="button"
            onClick={() => downloadICS('holud')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-navy-900/90 border border-baroque-400/30 text-baroque-200 transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-3 h-3" />
            <span>Holud .ics</span>
          </button>
          <button
            type="button"
            onClick={() => downloadICS('reception')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-navy-900/90 border border-baroque-400/30 text-baroque-200 transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-3 h-3" />
            <span>Reception .ics</span>
          </button>
        </div>
      </div>

      {/* Live Dhaka Countdown Strip (Fitted for mobile screens) */}
      <div className="max-w-sm mx-auto mt-5 sm:mt-6 pt-4 border-t border-baroque-400/20">
        <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-baroque-300/80 mb-3 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Countdown to Festivities (Dhaka BST)</span>
        </p>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
          <div className="navy-gold-card rounded-xl py-2 px-1">
            <div className="font-cinzel text-lg sm:text-2xl font-bold gold-foil-text">
              {String(countdown.days).padStart(2, '0')}
            </div>
            <div className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-baroque-200/70">Days</div>
          </div>
          <div className="navy-gold-card rounded-xl py-2 px-1">
            <div className="font-cinzel text-lg sm:text-2xl font-bold gold-foil-text">
              {String(countdown.hours).padStart(2, '0')}
            </div>
            <div className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-baroque-200/70">Hours</div>
          </div>
          <div className="navy-gold-card rounded-xl py-2 px-1">
            <div className="font-cinzel text-lg sm:text-2xl font-bold gold-foil-text">
              {String(countdown.mins).padStart(2, '0')}
            </div>
            <div className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-baroque-200/70">Mins</div>
          </div>
          <div className="navy-gold-card rounded-xl py-2 px-1">
            <div className="font-cinzel text-lg sm:text-2xl font-bold gold-foil-text">
              {String(countdown.secs).padStart(2, '0')}
            </div>
            <div className="font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-baroque-200/70">Secs</div>
          </div>
        </div>
      </div>
    </section>
  );
}

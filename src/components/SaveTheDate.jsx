import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, ExternalLink, Clock, MapPin } from 'lucide-react';
import { SectionHeading, Reveal, ease } from '../lib/motion';

const EVENTS = {
  holud: {
    key: 'holud',
    day: '25',
    weekday: 'Friday',
    name: 'Sangeet',
    bangla: 'সঙ্গীত',
    time: '6:00 PM – 11:30 PM',
    venue: 'Eagle Hall',
    place: 'BAF Base Bashar, Dhaka',
    blurb: 'An evening of turmeric, marigolds, music and mehndi.',
    google:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet:+Jeshfique+Mahmud+%26+Faheema+Shaheed+Tamanna&dates=20261225T120000Z/20261225T173000Z&details=Festive+Sangeet+Celebration&location=Eagle+Hall,+BAF+Base+Bashar'
  },
  reception: {
    key: 'reception',
    day: '27',
    weekday: 'Sunday',
    name: 'Wedding Reception',
    bangla: 'বিবাহোত্তর সংবর্ধনা',
    time: '6:00 PM – 11:30 PM',
    venue: 'SKS Convention Hall',
    place: 'SKS Tower, Mohakhali, Dhaka',
    blurb: 'A night of ivory, gold and celebration under one roof.',
    google:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Reception:+Jeshfique+Mahmud+%26+Faheema+Shaheed+Tamanna&dates=20261227T120000Z/20261227T173000Z&details=Royal+Wedding+Reception&location=SKS+Convention+Hall,+Mohakhali,+Dhaka'
  }
};

const downloadICS = (type) => {
  const isHolud = type === 'holud';
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jeshfique & Tamanna Wedding//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART;TZID=Asia/Dhaka:${isHolud ? '20261225T180000' : '20261227T180000'}`,
    `DTEND;TZID=Asia/Dhaka:${isHolud ? '20261225T233000' : '20261227T233000'}`,
    `SUMMARY:${isHolud ? 'Sangeet: Jeshfique Mahmud & Faheema Shaheed Tamanna' : 'Wedding Reception: Jeshfique Mahmud & Faheema Shaheed Tamanna'}`,
    `DESCRIPTION:${isHolud ? 'Join us for the festive Sangeet celebrations of Jeshfique & Tamanna.' : 'Join us for the Royal Wedding Reception of Jeshfique & Tamanna.'}`,
    `LOCATION:${isHolud ? 'Eagle Hall, BAF Base Bashar' : 'SKS Convention Hall, SKS Tower, Mohakhali, Dhaka'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = isHolud ? 'Jeshfique-Tamanna-Sangeet.ics' : 'Jeshfique-Tamanna-Wedding-Reception.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* Marigold garland that sways along the top of the Holud card */
function Garland() {
  return (
    <svg viewBox="0 0 400 70" className="absolute -top-1 left-0 w-full h-auto pointer-events-none" aria-hidden="true">
      <path d="M0 6 Q200 70 400 6" fill="none" stroke="#4E7A58" strokeWidth="1.5" />
      {Array.from({ length: 15 }).map((_, i) => {
        const t = (i + 0.5) / 15;
        const x = t * 400;
        const y = 6 + 4 * 64 * t * (1 - t) * 0.92;
        return (
          <motion.g
            key={i}
            style={{ originX: `${x}px`, originY: '0px' }}
            animate={{ rotate: [0, i % 2 ? 4 : -4, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx={x} cy={y} r={i % 3 === 0 ? 9 : 7.5} fill={i % 2 ? '#E0861C' : '#C9432F'} />
            <circle cx={x} cy={y} r={i % 3 === 0 ? 5 : 4} fill={i % 2 ? '#F3B33D' : '#E0861C'} />
            {i % 3 === 1 && <ellipse cx={x + 9} cy={y + 6} rx="7" ry="3" fill="#4E7A58" transform={`rotate(35 ${x + 9} ${y + 6})`} />}
          </motion.g>
        );
      })}
    </svg>
  );
}

function EventCard({ ev, from }) {
  const isHolud = ev.key === 'holud';
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const numX = useTransform(sry, (v) => v * 1.6);
  const numY = useTransform(srx, (v) => v * -1.6);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10);
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: from * 80, rotate: from * 6 }}
      whileInView={{ opacity: 1, x: 0, rotate: from * -1.2 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease }}
      whileHover={{ rotate: 0, y: -8 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className={`stitch relative rounded-[2rem] overflow-hidden p-7 sm:p-9 pt-16 sm:pt-20 ${
        isHolud
          ? 'text-navy-950 bg-[radial-gradient(circle_at_30%_20%,#FFD27A_0%,#F3B33D_40%,#E0861C_100%)] shadow-[0_40px_80px_-30px_rgba(224,134,28,0.6)]'
          : 'text-baroque-100 bg-[radial-gradient(circle_at_70%_10%,#2E2552_0%,#191530_45%,#0B0917_100%)] border border-baroque-400/30 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]'
      }`}
    >
      {isHolud ? (
        <Garland />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-baroque-200"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%` }}
              animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.6, 1.2, 0.6] }}
              transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <p className={`font-bangla text-lg ${isHolud ? 'text-sindoor' : 'text-holud'}`}>{ev.bangla}</p>
        <h3 className="font-serif italic font-light text-4xl sm:text-5xl leading-none mt-1">{ev.name}</h3>

        <div className="flex items-end gap-4 mt-6">
          <motion.span
            style={{ x: numX, y: numY }}
            className={`font-serif font-light text-[7rem] sm:text-[9rem] leading-[0.8] ${isHolud ? 'text-navy-950' : 'gold-foil-text'}`}
          >
            {ev.day}
          </motion.span>
          <div className="pb-2 font-cinzel text-xs tracking-[0.3em] uppercase leading-relaxed opacity-80">
            <div>{ev.weekday}</div>
            <div>December</div>
            <div>2026</div>
          </div>
        </div>

        <p className={`font-serif italic text-lg mt-5 ${isHolud ? 'text-navy-950/80' : 'text-baroque-200/80'}`}>{ev.blurb}</p>

        <div className={`mt-6 pt-5 border-t border-dashed ${isHolud ? 'border-navy-950/30' : 'border-baroque-400/30'} space-y-2 font-sans text-sm`}>
          <p className="flex items-center gap-2"><Clock className="w-4 h-4 opacity-70" /> {ev.time}</p>
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 opacity-70 mt-0.5 shrink-0" />
            <span><strong className="font-medium">{ev.venue}</strong> — {ev.place}</span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 font-sans text-xs">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={ev.google}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium ${
              isHolud ? 'bg-navy-950 text-holud' : 'bg-baroque-400 text-navy-950'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Google Calendar
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => downloadICS(ev.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border cursor-pointer ${
              isHolud ? 'border-navy-950/40 hover:bg-navy-950/10' : 'border-baroque-400/40 hover:bg-baroque-400/10'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Apple / Outlook (.ics)
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* Each digit rolls like an odometer whenever it changes */
function RollingNumber({ value }) {
  return (
    <span className="inline-flex">
      {String(value).padStart(2, '0').split('').map((d, i) => (
        <RollingDigit key={i} d={d} />
      ))}
    </span>
  );
}

function Countdown() {
  const [c, setC] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const target = new Date('2026-12-25T18:00:00+06:00').getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setC({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    ['Days', c.days],
    ['Hours', c.hours],
    ['Minutes', c.mins],
    ['Seconds', c.secs]
  ];

  return (
    <Reveal className="mt-20 sm:mt-28 text-center">
      <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase text-baroque-300/70">
        Until the turmeric is ground · Dhaka time
      </p>
      <div className="mt-6 flex items-start justify-center gap-3 sm:gap-8">
        {units.map(([label, val], i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <span className="font-serif font-light text-5xl sm:text-8xl text-baroque-100 tabular-nums">
                <RollingNumber value={val} />
              </span>
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-holud mt-3">{label}</span>
            </div>
            {i < units.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="font-serif text-4xl sm:text-7xl text-baroque-400/50 leading-none"
              >
                :
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </div>
    </Reveal>
  );
}

function RollingDigit({ d }) {
  return (
    <span className="relative inline-block w-[0.62em] h-[1em] overflow-hidden leading-none">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={d}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="absolute inset-0 text-center"
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* The last days of December, with the two dates circled by hand */
function DecemberStrip() {
  const days = Array.from({ length: 11 }, (_, i) => 21 + i); // 21..31
  const weekday = (d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(2026, 11, d).getDay()];
  return (
    <Reveal className="mt-16 sm:mt-20">
      <p className="text-center font-cinzel text-[10px] tracking-[0.4em] uppercase text-baroque-300/70 mb-5">December 2026</p>
      <div className="no-scrollbar overflow-x-auto">
        <div className="flex justify-center gap-1 sm:gap-3 min-w-max mx-auto px-2">
          {days.map((d, i) => {
            const special = d === 25 || d === 27;
            return (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6, ease }}
                className="relative flex flex-col items-center w-9 sm:w-14 py-2"
              >
                <span className="font-sans text-[10px] text-baroque-300/50">{weekday(d)}</span>
                <span className={`font-serif text-2xl sm:text-3xl mt-1 ${special ? (d === 25 ? 'text-holud' : 'text-baroque-100') : 'text-baroque-200/35'}`}>
                  {d}
                </span>
                {special && (
                  <>
                    <svg viewBox="0 0 60 60" className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-[4.6rem] sm:h-[4.6rem] pointer-events-none" aria-hidden="true">
                      <motion.path
                        d="M30 6 C46 5 55 18 54 31 C53 46 40 55 28 54 C14 53 5 42 6 29 C7 16 17 8 33 7"
                        fill="none"
                        stroke={d === 25 ? '#F3B33D' : '#C9432F'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.6 + (d === 27 ? 0.5 : 0), ease: 'easeInOut' }}
                      />
                    </svg>
                    <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase text-baroque-300 mt-3 sm:mt-4 whitespace-nowrap">
                      {d === 25 ? 'Sangeet' : 'Reception'}
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

export default function SaveTheDate() {
  return (
    <section id="savedate" className="relative py-24 sm:py-32 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          numeral="II."
          kicker="Save the Dates"
          title="Two evenings in Dhaka"
          sub="One painted in turmeric and marigold, the other in ivory and gold."
        />
        <div className="grid md:grid-cols-2 gap-8 md:gap-10" style={{ perspective: 1200 }}>
          <EventCard ev={EVENTS.holud} from={-1} />
          <EventCard ev={EVENTS.reception} from={1} />
        </div>
        <DecemberStrip />
        <Countdown />
      </div>
    </section>
  );
}

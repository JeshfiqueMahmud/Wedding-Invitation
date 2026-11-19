import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Car, Compass } from 'lucide-react';
import { SectionHeading, ease } from '../lib/motion';

const VENUES = {
  holud: {
    label: 'Gaye Holud',
    date: '25 December · 6:00 PM',
    title: 'Eagle Hall',
    subtitle: 'BAF Base Bashar, Dhaka',
    fullAddress: 'Eagle Hall, BAF Base Bashar',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Eagle+Hall,+BAF+Base+Bashar',
    appleMapsUrl: 'https://maps.apple.com/?q=Eagle+Hall+BAF+Base+Bashar',
    uberUrl: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=Eagle%20Hall%2C%20BAF%20Base%20Bashar',
    embedUrl: 'https://maps.google.com/maps?q=Eagle+Hall,+BAF+Base+Bashar&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pin: { top: '50%', left: '28%' }
  },
  reception: {
    label: 'Reception',
    date: '27 December · 6:00 PM',
    title: 'SKS Convention Hall',
    subtitle: 'SKS Tower, 7 VIP Road, Mohakhali, Dhaka',
    fullAddress: 'SKS Convention Hall, SKS Tower, 7 VIP Road, Mohakhali, Dhaka',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SKS+Convention+Hall+Mohakhali+Dhaka',
    appleMapsUrl: 'https://maps.apple.com/?q=SKS+Convention+Hall+Mohakhali+Dhaka',
    uberUrl: 'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=SKS%20Convention%20Hall%2C%20Mohakhali%2C%20Dhaka',
    embedUrl: 'https://maps.google.com/maps?q=SKS+Convention+Hall+Mohakhali+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed',
    pin: { top: '30%', left: '78%' }
  }
};

function Segmented({ value, onChange, options, id }) {
  return (
    <div className="inline-flex p-1 rounded-full border border-baroque-400/25 bg-navy-900/70 backdrop-blur">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`relative px-4 sm:px-5 py-2 rounded-full font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] uppercase cursor-pointer transition-colors ${
            value === key ? 'text-navy-950' : 'text-baroque-200/70 hover:text-baroque-100'
          }`}
        >
          {value === key && (
            <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-holud" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function VenueSection() {
  const [selected, setSelected] = useState('holud');
  const [mapMode, setMapMode] = useState('live');
  const v = VENUES[selected];

  return (
    <section id="venue" className="relative py-24 sm:py-32 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">
        <SectionHeading numeral="VI." kicker="Finding Us" title="Where we gather" />

        <div className="flex justify-center mb-8">
          <Segmented id="venue" value={selected} onChange={setSelected} options={[['holud', 'Eagle Hall · 25'], ['reception', 'SKS Hall · 27']]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease }}
          className="navy-gold-card rounded-[2rem] overflow-hidden grid md:grid-cols-[1fr_1.35fr]"
        >
          {/* details */}
          <div className="p-7 sm:p-10 flex flex-col justify-between gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease }}
              >
                <p className={`font-cinzel text-[10px] tracking-[0.3em] uppercase ${selected === 'holud' ? 'text-holud' : 'text-baroque-300'}`}>
                  {v.label} · {v.date}
                </p>
                <h3 className="font-serif italic font-light text-4xl sm:text-5xl text-baroque-100 mt-3 leading-none">{v.title}</h3>
                <p className="font-sans text-sm text-baroque-200/70 mt-3 flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-sindoor" /> {v.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-2 font-sans text-xs">
              {[
                [v.mapsUrl, Navigation, 'Google'],
                [v.appleMapsUrl, Compass, 'Apple'],
                [v.uberUrl, Car, 'Uber']
              ].map(([href, Icon, label]) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-baroque-400/25 hover:border-holud hover:bg-holud/10 text-baroque-200 transition-colors"
                >
                  <Icon className="w-4 h-4 text-holud" />
                  {label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* map */}
          <div className="relative min-h-[300px] md:min-h-[400px] bg-navy-900 border-t md:border-t-0 md:border-l border-baroque-400/15">
            <div className="absolute top-3 right-3 z-10">
              <Segmented id="map" value={mapMode} onChange={setMapMode} options={[['live', 'Live map'], ['vector', 'Route']]} />
            </div>
            <AnimatePresence mode="wait">
              {mapMode === 'live' ? (
                <motion.iframe
                  key={`live-${selected}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  title={v.title}
                  src={v.embedUrl}
                  className="absolute inset-0 w-full h-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)_sepia(0.25)]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <motion.div key="vector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
                    <rect width="400" height="300" fill="#120F22" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 26} x2="400" y2={i * 26} stroke="#E2A63E" strokeOpacity="0.05" />
                    ))}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 26} y1="0" x2={i * 26} y2="300" stroke="#E2A63E" strokeOpacity="0.05" />
                    ))}
                    <path d="M0 110 L400 140" stroke="#231D40" strokeWidth="12" />
                    <path d="M150 0 L185 300" stroke="#231D40" strokeWidth="14" />
                    <motion.path
                      d="M300 0 L262 300"
                      stroke="#F3B33D"
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6 }}
                    />
                    <text x="270" y="290" fill="#EBC57E" fontFamily="Jost" fontSize="9" opacity="0.7">Airport Rd (VIP Road)</text>
                    <rect x="50" y="130" width="96" height="44" rx="10" fill="#4E7A58" fillOpacity="0.25" />
                    <text x="60" y="156" fill="#A8C8AE" fontFamily="Jost" fontSize="10">BAF Base Bashar</text>
                    <rect x="280" y="60" width="96" height="40" rx="10" fill="#C9432F" fillOpacity="0.2" />
                    <text x="290" y="84" fill="#F2B9A9" fontFamily="Jost" fontSize="10">Mohakhali</text>
                  </svg>
                  <motion.div
                    className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
                    animate={{ top: v.pin.top, left: v.pin.left }}
                    transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                  >
                    <span className="px-2.5 py-1 rounded-md bg-holud text-navy-950 font-sans text-[11px] font-medium mb-1 whitespace-nowrap shadow-lg">{v.title}</span>
                    <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                      <MapPin className="w-7 h-7 text-sindoor fill-sindoor/30" />
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

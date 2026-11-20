import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Flower2, Music2, Sparkles, UtensilsCrossed } from 'lucide-react';
import { SectionHeading, ease } from '../lib/motion';

const EVENTS = [
  { date: '25 Dec', time: '6:00 PM', Icon: Flower2, title: 'Sangeet', place: 'Eagle Hall, BAF Base Bashar', note: 'Turmeric, marigolds & the first blessings', tone: 'holud' },
  { date: '25 Dec', time: '8:30 – 11:30 PM', Icon: Music2, title: 'Sangeet & Folk Night', place: 'Blessings & feast', note: 'Songs, dholak and dancing till late', tone: 'holud' },
  { date: '27 Dec', time: '6:00 PM', Icon: Sparkles, title: 'Wedding Reception', place: 'SKS Convention Hall', note: 'The couple welcomes you in ivory & gold', tone: 'gold' },
  { date: '27 Dec', time: '8:30 – 11:30 PM', Icon: UtensilsCrossed, title: 'Royal Banquet', place: 'Feast & portraits', note: 'Dinner, duas and photographs together', tone: 'gold' }
];

export default function ItinerarySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="itinerary" className="relative py-24 sm:py-32 px-5">
      <div className="max-w-4xl mx-auto">
        <SectionHeading numeral="IV." kicker="The Order of Evenings" title="How the nights unfold" />

        <div ref={ref} className="relative">
          {/* rail + scroll-driven fill */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-baroque-400/15" />
          <motion.div
            style={{ scaleY: fill, originY: 0 }}
            className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-holud via-holud-deep to-baroque-300"
          />

          <div className="space-y-14 sm:space-y-20">
            {EVENTS.map((ev, i) => {
              const left = i % 2 === 0;
              const { Icon } = ev;
              return (
                <div key={ev.title} className={`relative md:grid md:grid-cols-2 md:gap-16 items-center`}>
                  {/* node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-30% 0px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className={`absolute left-5 md:left-1/2 top-1 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10 ${
                      ev.tone === 'holud' ? 'bg-holud text-navy-950' : 'bg-navy-900 border border-baroque-400 text-baroque-300'
                    } shadow-[0_0_0_6px_#0B0917]`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: left ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{ duration: 0.9, ease }}
                    className={`pl-16 md:pl-0 ${left ? 'md:text-right md:pr-6' : 'md:col-start-2 md:pl-6'}`}
                  >
                    <p className={`font-cinzel text-[10px] tracking-[0.3em] uppercase ${ev.tone === 'holud' ? 'text-holud' : 'text-baroque-300'}`}>
                      {ev.date} · {ev.time}
                    </p>
                    <h3 className="font-serif italic font-light text-3xl sm:text-4xl text-baroque-100 mt-1">{ev.title}</h3>
                    <p className="font-sans text-sm text-baroque-200/70 mt-1">{ev.place}</p>
                    <p className="font-serif italic text-base text-baroque-200/50 mt-2">{ev.note}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

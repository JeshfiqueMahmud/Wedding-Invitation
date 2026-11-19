import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Printer, X, Share2, Minus, Plus, ArrowRight } from 'lucide-react';
import { SectionHeading, ease } from '../lib/motion';
import Alpana from './Alpana';
import { apiFetch } from '../lib/api';

const EMPTY = { name: '', phone: '', email: '', attendance: 'both', guests_count: 1, dietary: '', message: '' };

const OPTIONS = [
  { value: 'both', label: 'Joyfully attending both', detail: '25 & 27 December' },
  { value: 'holud', label: 'Gaye Holud only', detail: '25 Dec · Eagle Hall' },
  { value: 'reception', label: 'Reception only', detail: '27 Dec · SKS Hall' },
  { value: 'unable', label: 'Regretfully absent', detail: 'Sending warm wishes' }
];

function Field({ id, label, children }) {
  return (
    <div className="group">
      <label htmlFor={id} className="block font-cinzel text-[10px] tracking-[0.25em] uppercase text-navy-950/60 mb-1 group-focus-within:text-sindoor transition-colors">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-transparent border-0 border-b border-navy-950/25 px-0 py-2 font-serif text-xl text-navy-950 placeholder:text-navy-950/30 focus:outline-none focus:border-sindoor transition-colors';

export default function RsvpSection({ onRsvpSubmitted }) {
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit RSVP');

      const colors = ['#F3B33D', '#E0861C', '#C9432F', '#F7EFE1'];
      confetti({ particleCount: 90, spread: 80, origin: { x: 0.2, y: 0.7 }, angle: 60, colors });
      confetti({ particleCount: 90, spread: 80, origin: { x: 0.8, y: 0.7 }, angle: 120, colors });

      setConfirmedPass(data.entry);
      if (onRsvpSubmitted) onRsvpSubmitted();
      setFormData(EMPTY);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!confirmedPass) return;
    const text = encodeURIComponent(
      `Assalamu Alaikum! I have confirmed my RSVP for Jeshfique Mahmud & Faheema Shaheed Tamanna's wedding celebration in Dhaka. Digital Pass: #${String(
        confirmedPass.id
      ).padStart(4, '0')} (${confirmedPass.name}).`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const attending = formData.attendance !== 'unable';

  return (
    <section id="rsvp" className="relative py-24 sm:py-32 px-4 sm:px-5">
      <div className="max-w-3xl mx-auto">
        <SectionHeading numeral="V." kicker="Kindly Reply" title="Will you be there?" sub="We would be honoured — please respond by 10 December 2026." />

        <motion.div
          initial={{ opacity: 0, y: 80, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease }}
          className="stitch relative frosted-rsvp-card text-sindoor rounded-[2rem] px-5 py-10 sm:p-14 overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]"
        >
          {/* corner mandala watermark */}
          <div aria-hidden="true" className="absolute -right-24 -top-24 w-72 h-72 text-holud/40 pointer-events-none">
            <Alpana className="w-full h-full" inView duration={3} />
          </div>

          <div className="relative text-navy-950">
            <p className="font-bangla text-2xl sm:text-3xl text-sindoor">আপনার উপস্থিতি একান্ত কাম্য</p>
            <p className="font-serif italic text-lg text-navy-950/60 mt-1">Your presence is our greatest gift.</p>

            <AnimatePresence>
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', x: [0, -8, 8, -4, 4, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 font-sans text-sm text-sindoor"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <Field id="rsvpName" label="Your full name *">
                <input id="rsvpName" type="text" required value={formData.name} onChange={set('name')} placeholder="e.g. Sabrina Khan" className={inputCls} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-8">
                <Field id="rsvpPhone" label="Phone">
                  <input id="rsvpPhone" type="tel" value={formData.phone} onChange={set('phone')} placeholder="+880 17…" className={inputCls} />
                </Field>
                <Field id="rsvpEmail" label="Email">
                  <input id="rsvpEmail" type="email" value={formData.email} onChange={set('email')} placeholder="name@example.com" className={inputCls} />
                </Field>
              </div>

              <fieldset>
                <legend className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-navy-950/60 mb-3">Will you grace our celebrations? *</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {OPTIONS.map((opt) => {
                    const active = formData.attendance === opt.value;
                    return (
                      <label key={opt.value} className="relative cursor-pointer rounded-2xl px-4 py-3.5 border border-navy-950/15 hover:border-navy-950/40 transition-colors">
                        {active && (
                          <motion.span
                            layoutId="rsvp-choice"
                            className="absolute inset-0 rounded-2xl bg-navy-950"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <input
                          type="radio"
                          name="rsvpAttendance"
                          value={opt.value}
                          checked={active}
                          onChange={set('attendance')}
                          className="sr-only"
                        />
                        <span className={`relative block font-serif text-lg leading-tight transition-colors ${active ? 'text-holud' : 'text-navy-950'}`}>{opt.label}</span>
                        <span className={`relative block font-sans text-xs mt-0.5 transition-colors ${active ? 'text-ivory/70' : 'text-navy-950/50'}`}>{opt.detail}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {attending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-8 pt-1">
                      <div>
                        <p className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-navy-950/60 mb-2">Total attendees</p>
                        <div className="flex items-center gap-4">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => setFormData({ ...formData, guests_count: Math.max(1, formData.guests_count - 1) })}
                            className="w-11 h-11 rounded-full border border-navy-950/30 flex items-center justify-center hover:bg-navy-950 hover:text-holud transition-colors cursor-pointer"
                            aria-label="Decrease attendee count"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="relative w-10 h-12 overflow-hidden flex items-center justify-center font-serif text-4xl">
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={formData.guests_count}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              >
                                {formData.guests_count}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => setFormData({ ...formData, guests_count: Math.min(10, formData.guests_count + 1) })}
                            className="w-11 h-11 rounded-full border border-navy-950/30 flex items-center justify-center hover:bg-navy-950 hover:text-holud transition-colors cursor-pointer"
                            aria-label="Increase attendee count"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      <Field id="rsvpDietary" label="Dietary notes">
                        <input id="rsvpDietary" type="text" value={formData.dietary} onChange={set('dietary')} placeholder="Allergies, vegetarian…" className={inputCls} />
                      </Field>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field id="rsvpMessage" label="A prayer or note for the couple">
                <textarea id="rsvpMessage" rows={2} value={formData.message} onChange={set('message')} placeholder="Leave a few words…" className={`${inputCls} resize-none`} />
              </Field>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative w-full overflow-hidden rounded-full bg-navy-950 text-holud py-4 font-cinzel text-xs sm:text-sm tracking-[0.35em] uppercase disabled:opacity-60 cursor-pointer"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-holud/30 to-transparent"
                  animate={{ x: ['-120%', '420%'] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                />
                <span className="relative inline-flex items-center gap-3">
                  {loading ? 'Sending your reply…' : 'Send my reply'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Digital pass */}
      {createPortal(
      <AnimatePresence>
        {confirmedPass && (
          <motion.div
            className="fixed inset-0 z-[70] bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmedPass(null)}
          >
            <motion.div
              initial={{ y: 120, rotateX: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              style={{ transformPerspective: 1000 }}
              className="relative max-w-sm w-full gold-pass-ticket rounded-[1.75rem] text-baroque-100 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" onClick={() => setConfirmedPass(null)} className="absolute top-3 right-3 text-baroque-300 hover:text-white p-2 z-10 cursor-pointer" aria-label="Close">
                <X className="w-5 h-5" />
              </button>

              <div className="p-7 text-center">
                <div className="relative w-24 h-24 mx-auto text-holud">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
                    <Alpana className="w-full h-full" duration={1.6} />
                  </motion.div>
                  <span className="absolute inset-0 flex items-center justify-center font-script text-3xl text-baroque-100">J&amp;T</span>
                </div>
                <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-holud mt-4">Invitation Pass</p>
                <h3 className="font-serif italic text-3xl mt-1 gold-foil-text">{confirmedPass.name}</h3>
              </div>

              {/* perforation */}
              <div className="relative flex items-center">
                <span className="absolute -left-3 w-6 h-6 rounded-full bg-navy-950" />
                <span className="flex-1 mx-5 border-t-2 border-dashed border-baroque-400/30" />
                <span className="absolute -right-3 w-6 h-6 rounded-full bg-navy-950" />
              </div>

              <div className="p-7 pt-5 font-sans text-sm space-y-2 text-baroque-200/90">
                <p>
                  <span className="text-baroque-400">Events · </span>
                  {confirmedPass.attendance === 'both'
                    ? 'Gaye Holud (25 Dec) & Reception (27 Dec)'
                    : confirmedPass.attendance === 'holud'
                    ? 'Gaye Holud (25 Dec, Eagle Hall, BAF Base Bashar)'
                    : confirmedPass.attendance === 'reception'
                    ? 'Wedding Reception (27 Dec, SKS Hall)'
                    : 'Warm regrets & prayers'}
                </p>
                {confirmedPass.attendance !== 'unable' && (
                  <p>
                    <span className="text-baroque-400">Party · </span>
                    {confirmedPass.guests_count} {confirmedPass.guests_count === 1 ? 'guest' : 'guests'}
                  </p>
                )}
                <p className="font-mono text-[11px] text-baroque-400/70 pt-1">PASS #JFT-{String(confirmedPass.id).padStart(4, '0')}</p>
                <p className="font-serif italic text-base text-baroque-300/80 pt-2">We can’t wait to celebrate with you. Please show this pass at the entrance.</p>

                <div className="pt-4 flex flex-wrap gap-2 justify-center">
                  <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={handleShareWhatsApp} className="px-4 py-2 rounded-full bg-leaf text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> WhatsApp
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => window.print()} className="px-4 py-2 rounded-full border border-baroque-400/50 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Print
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} type="button" onClick={() => setConfirmedPass(null)} className="px-5 py-2 rounded-full bg-holud text-navy-950 font-medium text-xs cursor-pointer">
                    Done
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, QrCode, Download, Printer, X, Sparkles, Share2 } from 'lucide-react';

export default function RsvpSection({ onRsvpSubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    attendance: 'both',
    guests_count: 1,
    dietary: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const attendanceOptions = [
    { value: 'both', label: 'Yes, I will attend both events (25 & 27 Dec)' },
    { value: 'holud', label: 'Gaye Holud only (25th Dec, Eagle Hall)' },
    { value: 'reception', label: 'Reception only (27th Dec, SKS Hall)' },
    { value: 'unable', label: 'Unable to attend (sending warm wishes)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      // Golden confetti celebration explosion
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E4B8', '#B88924', '#FFFFFF']
      });

      // Show digital VIP invitation pass
      setConfirmedPass(data.entry);

      if (onRsvpSubmitted) onRsvpSubmitted();

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        attendance: 'both',
        guests_count: 1,
        dietary: '',
        message: ''
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  return (
    <section id="rsvp" className="py-10 sm:py-14 px-2 sm:px-6">
      <div className="frosted-rsvp-card max-w-md mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white relative overflow-hidden">
        {/* Ornate corner flourish */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-baroque-400/20 to-transparent pointer-events-none rounded-bl-full" />

        <div className="text-center mb-5 sm:mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[10px] font-sans tracking-widest uppercase text-baroque-200 mb-2 font-semibold">
            RSVP Confirmation
          </span>
          <h2 className="font-sans text-xl sm:text-3xl font-bold text-white mb-1">
            Confirm Your Attendance
          </h2>
          <p className="font-sans text-xs text-white/85">
            Kindly respond by 10th December 2026 to help us welcome you
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/80 border border-red-500/50 text-white text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 font-sans text-left">
          {/* Full Name */}
          <div>
            <label htmlFor="rsvpName" className="block text-xs font-semibold text-white/95 mb-1">
              Full Name *
            </label>
            <input
              id="rsvpName"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Kazi Nazmul / Sabrina Khan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-baroque-400 shadow-inner"
            />
          </div>

          {/* Contact: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label htmlFor="rsvpPhone" className="block text-xs font-medium text-white/95 mb-1">
                Phone Number
              </label>
              <input
                id="rsvpPhone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 17..."
                className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-baroque-400"
              />
            </div>
            <div>
              <label htmlFor="rsvpEmail" className="block text-xs font-medium text-white/95 mb-1">
                Email Address
              </label>
              <input
                id="rsvpEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-baroque-400"
              />
            </div>
          </div>

          {/* Attendance Radio Cards */}
          <div>
            <label className="block text-xs font-semibold text-white/95 mb-1.5">
              Will you grace our celebrations? *
            </label>
            <div className="space-y-2">
              {attendanceOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                    formData.attendance === opt.value
                      ? 'bg-white/40 border-baroque-300 shadow-md ring-1 ring-baroque-300'
                      : 'bg-white/20 border-white/25 hover:bg-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="rsvpAttendance"
                    value={opt.value}
                    checked={formData.attendance === opt.value}
                    onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                    className="accent-navy-950 w-4 h-4 cursor-pointer shrink-0"
                  />
                  <span className="text-xs sm:text-sm font-medium text-white leading-snug">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Party Count (Only if attending) */}
          {formData.attendance !== 'unable' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
              <div>
                <label className="block text-xs font-medium text-white/95 mb-1">
                  Total Attendees
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        guests_count: Math.max(1, formData.guests_count - 1)
                      })
                    }
                    className="w-10 h-10 rounded-xl bg-white/30 hover:bg-white/40 active:scale-95 text-white font-bold flex items-center justify-center text-base"
                    aria-label="Decrease attendee count"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-base text-white">
                    {formData.guests_count}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        guests_count: Math.min(10, formData.guests_count + 1)
                      })
                    }
                    className="w-10 h-10 rounded-xl bg-white/30 hover:bg-white/40 active:scale-95 text-white font-bold flex items-center justify-center text-base"
                    aria-label="Increase attendee count"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="rsvpDietary" className="block text-xs font-medium text-white/95 mb-1">
                  Dietary / Note
                </label>
                <input
                  id="rsvpDietary"
                  type="text"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  placeholder="Halal, Veg, Allergies..."
                  className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-baroque-400"
                />
              </div>
            </div>
          )}

          {/* Personal Blessing Note */}
          <div>
            <label htmlFor="rsvpMessage" className="block text-xs font-medium text-white/95 mb-1">
              Special Prayer or Note for the Couple
            </label>
            <textarea
              id="rsvpMessage"
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Leave a prayer or message..."
              className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-baroque-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-baroque-300 hover:bg-baroque-200 active:scale-95 text-navy-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Saving Response...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm RSVP</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Digital Royal VIP Pass Modal */}
      {confirmedPass && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          onClick={() => setConfirmedPass(null)}
        >
          <div
            className="relative max-w-md w-full gold-pass-ticket rounded-3xl p-5 sm:p-8 text-center text-baroque-100 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConfirmedPass(null)}
              className="absolute top-3 right-3 text-baroque-300 hover:text-white p-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-baroque-300/80 bg-baroque-400/20 flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-baroque-300" />
            </div>

            <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-baroque-400 font-bold">
              Royal Invitation Pass
            </p>
            <h3 className="font-cinzel text-lg sm:text-2xl font-bold gold-foil-text mt-1">
              {confirmedPass.name}
            </h3>

            <div className="my-3 sm:my-4 py-2.5 sm:py-3 border-y border-baroque-400/30 text-xs font-sans space-y-1 text-baroque-200/90 text-left sm:text-center">
              <p>
                <strong className="text-baroque-300">Events:</strong>{' '}
                {confirmedPass.attendance === 'both'
                  ? 'Gaye Holud (25 Dec) & Reception (27 Dec)'
                  : confirmedPass.attendance === 'holud'
                  ? 'Gaye Holud (25th Dec, Eagle Hall, BAF Base Bashar)'
                  : confirmedPass.attendance === 'reception'
                  ? 'Wedding Reception (27th Dec, SKS Hall)'
                  : 'Warm Regrets & Prayers'}
              </p>
              {confirmedPass.attendance !== 'unable' && (
                <p>
                  <strong className="text-baroque-300">Party Size:</strong>{' '}
                  {confirmedPass.guests_count} {confirmedPass.guests_count === 1 ? 'Guest' : 'Guests'}
                </p>
              )}
              <p className="text-[10px] text-baroque-400/70 font-mono">
                PASS ID: #JFT-{String(confirmedPass.id).padStart(4, '0')} • SAVED IN DATABASE
              </p>
            </div>

            {/* Stylized QR Code Graphic */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto p-2 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-navy-950" fill="currentColor">
                <rect x="10" y="10" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="16" width="12" height="12" />
                <rect x="66" y="10" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="72" y="16" width="12" height="12" />
                <rect x="10" y="66" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="16" y="72" width="12" height="12" />
                <rect x="42" y="15" width="8" height="8" />
                <rect x="52" y="25" width="6" height="6" />
                <rect x="44" y="44" width="12" height="12" />
                <rect x="66" y="66" width="10" height="10" />
                <rect x="80" y="76" width="8" height="8" />
                <rect x="25" y="45" width="8" height="8" />
                <rect x="75" y="45" width="8" height="8" />
              </svg>
            </div>

            <p className="font-serif italic text-xs text-baroque-300/80 mt-2 sm:mt-3">
              We look forward to celebrating with you! Present this pass at the entrance.
            </p>

            <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold inline-flex items-center gap-1.5 active:scale-95 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-full border border-baroque-400/50 hover:bg-baroque-400/20 text-xs text-baroque-200 inline-flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmedPass(null)}
                className="px-5 py-2 rounded-full bg-baroque-300 text-navy-950 font-bold text-xs hover:bg-baroque-200 active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

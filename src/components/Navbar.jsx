import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, Calendar, MapPin, HeartHandshake } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function Navbar({ isAudioPlaying, setIsAudioPlaying, onOpenAdmin }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
      setScrollProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#blessing', label: 'Invitation' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#savedate', label: 'Dates' },
    { href: '#rsvp', label: 'RSVP' },
    { href: '#venue', label: 'Venue' },
    { href: '#itinerary', label: 'Itinerary' },
    { href: '#guestbook', label: 'Wishes' }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-baroque-500 via-baroque-200 to-baroque-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Top Navigation Pill */}
      <header className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl">
        <nav className="navy-gold-card rounded-full px-3.5 sm:px-6 py-2 flex items-center justify-between text-xs font-sans tracking-widest uppercase shadow-xl">
          <a
            href="#hero"
            className="font-cinzel font-bold text-sm sm:text-base gold-foil-text tracking-wider hover:opacity-90 transition-opacity"
          >
            J &amp; F
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5 text-[11px] text-baroque-200/80">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-baroque-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Controls: Audio, Admin, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AudioPlayer
              isPlaying={isAudioPlaying}
              onToggle={() => setIsAudioPlaying(!isAudioPlaying)}
            />

            {/* Admin RSVP Manager Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-1.5 sm:p-2 rounded-full border border-baroque-400/35 hover:bg-baroque-400/20 text-baroque-300 transition-all"
              title="RSVP Database & Guest Analytics"
              aria-label="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full border border-baroque-400/35 text-baroque-300 hover:bg-baroque-400/20 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/95 backdrop-blur-lg flex flex-col justify-center items-center px-6 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-baroque-400 font-bold mb-4">
              Jeshfique &amp; Faheema
            </p>

            <div className="flex flex-col space-y-3 font-cinzel text-sm tracking-widest uppercase">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="py-2.5 px-4 rounded-xl border border-baroque-400/20 bg-navy-900/60 hover:bg-baroque-400/20 text-baroque-200 hover:text-white transition-all shadow-sm"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-baroque-400/20">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-xl border border-baroque-400/40 text-baroque-300 font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Organizer Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Bottom Quick-Action Bar */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-sm pointer-events-auto">
        <div className="navy-gold-card rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-baroque-400/40 backdrop-blur-xl">
          <a
            href="#savedate"
            className="flex-1 py-2 text-center font-sans text-[11px] font-semibold text-baroque-200/90 hover:text-white flex items-center justify-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-baroque-300" />
            <span>Dates</span>
          </a>

          <a
            href="#rsvp"
            className="flex-1 py-2 px-3 mx-1 rounded-full bg-gradient-to-r from-baroque-300 to-baroque-400 text-navy-950 font-sans text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-1 hover:brightness-105 active:scale-95 transition-all text-center"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </a>

          <a
            href="#venue"
            className="flex-1 py-2 text-center font-sans text-[11px] font-semibold text-baroque-200/90 hover:text-white flex items-center justify-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-baroque-300" />
            <span>Venue</span>
          </a>
        </div>
      </div>
    </>
  );
}

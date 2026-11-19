import React, { useEffect, useState } from 'react';
import { MotionConfig, AnimatePresence } from 'framer-motion';
import StardustCanvas from './components/StardustCanvas';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Marquee from './components/Marquee';
import BlessingSection from './components/BlessingSection';
import PhotoGallery from './components/PhotoGallery';
import SaveTheDate from './components/SaveTheDate';
import RsvpSection from './components/RsvpSection';
import VenueSection from './components/VenueSection';
import ItinerarySection from './components/ItinerarySection';
import GuestbookSection from './components/GuestbookSection';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import InvitationIntroOverlay from './components/InvitationIntroOverlay';
import ServerWakeToast from './components/ServerWakeToast';
import { wakeServer } from './lib/api';

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  // Start waking the (possibly sleeping) backend while the guest watches the intro.
  useEffect(() => {
    wakeServer();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-baroque-200 overflow-x-clip">
        <AnimatePresence>
          {isIntroOpen && (
            <InvitationIntroOverlay
              key="intro"
              onStartMusic={() => {
                setIsAudioPlaying(true);
                setHeroReady(true);
              }}
              onOpened={() => setIsIntroOpen(false)}
            />
          )}
        </AnimatePresence>

        <StardustCanvas />

        <Navbar isAudioPlaying={isAudioPlaying} setIsAudioPlaying={setIsAudioPlaying} onOpenAdmin={() => setIsAdminOpen(true)} />

        <main className="relative z-20">
          <HeroSection ready={heroReady || !isIntroOpen} />
          <Marquee />
          <BlessingSection />
          <SaveTheDate />
          <PhotoGallery />
          <ItinerarySection />
          <RsvpSection />
          <VenueSection />
          <GuestbookSection />
          <Footer
            onReplayIntro={() => {
              window.scrollTo({ top: 0 });
              setIsIntroOpen(true);
            }}
          />
        </main>

        <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <ServerWakeToast />
      </div>
    </MotionConfig>
  );
}

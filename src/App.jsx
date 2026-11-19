import React, { useState } from 'react';
import StardustCanvas from './components/StardustCanvas';
import Navbar from './components/Navbar';
import HeroCameo from './components/HeroCameo';
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

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(true);

  return (
    <div className="relative min-h-screen text-[#F5E4B8] overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#040D1E]">
      {/* 3D Gatefold Royal Invitation Overlay (First Greeting on Landing) */}
      {isIntroOpen && (
        <InvitationIntroOverlay
          onOpened={() => setIsIntroOpen(false)}
          onStartMusic={() => setIsAudioPlaying(true)}
        />
      )}

      {/* Golden Stardust & Petals Particle Canvas */}
      <StardustCanvas />

      {/* Floating Header Navbar + Mobile Navigation */}
      <Navbar
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Centered Royal Invitation Column (With safe bottom spacing for mobile bottom bar) */}
      <main className="relative z-20 max-w-[680px] mx-auto px-3 sm:px-6 pt-16 sm:pt-20 pb-24 md:pb-16">
        <HeroCameo />
        <BlessingSection />
        <PhotoGallery />
        <SaveTheDate />
        <RsvpSection onRsvpSubmitted={() => {}} />
        <VenueSection />
        <ItinerarySection />
        <GuestbookSection />
        <Footer onReplayIntro={() => setIsIntroOpen(true)} />
      </main>

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

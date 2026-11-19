import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioPlayer({ isPlaying, onToggle }) {
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Pentatonic classical notes (D-major / Kalyan raag harmony)
  const notes = [293.66, 369.99, 440.0, 554.37, 587.33, 739.99];

  useEffect(() => {
    if (isPlaying) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const playTone = () => {
        if (!isPlaying || !audioCtxRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Harmonic sine with warm overtone
        osc.type = 'sine';
        const noteFreq = notes[Math.floor(Math.random() * notes.length)];
        osc.frequency.setValueAtTime(noteFreq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.2, now + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 2.7);
      };

      playTone();
      intervalRef.current = setInterval(playTone, 2200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-sans ${
        isPlaying
          ? 'border-baroque-400 bg-baroque-400/20 text-baroque-200 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
          : 'border-baroque-400/40 text-baroque-200/80 hover:bg-baroque-400/15'
      }`}
      title={isPlaying ? 'Mute ambient melody' : 'Play ambient royal melody'}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-3 bg-baroque-300 animate-pulse"></span>
            <span className="w-0.5 h-2 bg-baroque-300 animate-pulse delay-75"></span>
            <span className="w-0.5 h-3.5 bg-baroque-300 animate-pulse delay-150"></span>
          </div>
          <span>Playing</span>
        </>
      ) : (
        <>
          <Music className="w-3.5 h-3.5" />
          <span>Music</span>
        </>
      )}
    </button>
  );
}

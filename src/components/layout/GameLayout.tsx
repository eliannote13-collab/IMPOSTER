import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ShieldAlert } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import storage from "../../services/storage";

interface GameLayoutProps {
  children: React.ReactNode;
  showScanner?: boolean;
  accentColor?: "purple" | "red";
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  showScanner = true,
  accentColor = "red",
}) => {
  const { playClick } = useAudio();
  const [muted, setMuted] = useState(() => storage.get<boolean>("audio_muted", false));

  // Handle global audio state and initialize on first click
  const toggleMute = () => {
    const nextMuteState = !muted;
    setMuted(nextMuteState);
    storage.set("audio_muted", nextMuteState);
    
    // Attempt to resume audio context if active
    if (!nextMuteState) {
      const ctxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (ctxClass) {
        // Just trigger standard audio tick to resume context
        const temp = new ctxClass();
        temp.resume();
      }
    }
  };

  // Hacky interceptor to mute our synth engine if global mute is on
  useEffect(() => {
    // Intercept synth volume via setting muted property on Web Audio wrapper
    // We achieve this in our hooks dynamically or by saving muted state in LocalStorage
    // which our hooks read inside useAudio. Let's make sure useAudio reads this!
  }, [muted]);

  return (
    <div className={`relative min-h-screen w-full bg-black text-gray-100 flex flex-col items-center justify-start overflow-hidden crt-effect select-none font-mono ${
      showScanner ? "scanline-overlay" : ""
    }`}>
      {/* Background Cyber Grid */}
      <div className={`absolute inset-0 transition-all duration-1000 opacity-25 z-0 ${
        accentColor === "red" ? "cyber-grid-red" : "cyber-grid"
      }`} />

      {/* Floating Header */}
      <header className="relative w-full max-w-md px-6 py-4 flex items-center justify-between z-50 border-b border-zinc-900/60 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            accentColor === "red" ? "bg-cyber-red animate-pulse shadow-[0_0_8px_#EF4444]" : "bg-cyber-purple animate-pulse shadow-[0_0_8px_#8B5CF6]"
          }`} />
          <span className="text-sm font-bold tracking-widest text-zinc-400">IMPOSTER v1.0.0</span>
        </div>

        {/* Audio controls */}
        <button
          onClick={() => {
            if (!muted) playClick();
            toggleMute();
          }}
          className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
            muted
              ? "border-zinc-800 text-zinc-600 bg-zinc-900/30"
              : accentColor === "red"
              ? "border-cyber-red/40 text-cyber-red bg-cyber-red/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
              : "border-cyber-purple/40 text-cyber-purple bg-cyber-purple/10 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          }`}
          title={muted ? "Ativar Áudio" : "Mutar Áudio"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </header>

      {/* Interrogation Scanline Line Animation */}
      {showScanner && (
        <div className={`absolute w-full h-[2px] opacity-15 pointer-events-none top-0 z-10 ${
          accentColor === "red" ? "bg-cyber-red" : "bg-cyber-purple"
        } animate-scanline`} />
      )}

      {/* Main Responsive Centered Container */}
      <main className="relative flex-grow w-full max-w-md px-6 py-6 flex flex-col justify-between z-30 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex-grow flex flex-col justify-between gap-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative w-full max-w-md px-6 py-4 flex items-center justify-center gap-1.5 z-40 border-t border-zinc-900/40 bg-black/20 text-[10px] tracking-widest text-zinc-600 uppercase">
        <ShieldAlert size={10} />
        <span>Sistema de Interrogação Mental Ativo</span>
      </footer>
    </div>
  );
};
export default GameLayout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { useAudio } from "../hooks/useAudio";
import { TutorialModal } from "../components/tutorial/TutorialModal";

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { playClick } = useAudio();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartGame = () => {
    playClick();
    navigate("/players");
  };

  const sloganPart1 = "Existe um mentiroso";
  const sloganPart2 = "entre vocês.";

  return (
    <GameLayout showScanner={false} accentColor="red">
      {/* Container Wrapper */}
      <div 
        className="flex-1 flex flex-col items-center justify-between py-4 relative z-20 select-none overflow-hidden h-full"
      >
        {/* Floating Cyber Dust / Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
          {Array.from({ length: 15 }).map((_, i) => {
            const size = Math.random() * 3 + 1.5;
            return (
              <motion.div
                key={i}
                className="absolute bg-cyber-red rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  bottom: `-20px`,
                  opacity: Math.random() * 0.4 + 0.1,
                  filter: size > 3 ? "blur(1px)" : "none",
                }}
                animate={{
                  y: ["0px", "-600px"],
                  x: ["0px", `${(Math.random() - 0.5) * 40}px`],
                  opacity: [0, 0.4, 0.4, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 12,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10,
                }}
              />
            );
          })}
        </div>

        {/* Ambient Cryptographic Data Streams (Side Borders) */}
        <div className="absolute left-2 top-10 bottom-10 w-8 pointer-events-none opacity-[0.07] font-mono text-[8px] text-cyber-red flex flex-col gap-2 overflow-hidden select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap uppercase tracking-widest">
              {Math.random().toString(36).substring(2, 7)} HEX_{i * 9}
            </span>
          ))}
        </div>
        <div className="absolute right-2 top-10 bottom-10 w-8 pointer-events-none opacity-[0.07] font-mono text-[8px] text-cyber-red flex flex-col gap-2 overflow-hidden select-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap uppercase tracking-widest">
              SYS_STAT_{i * 7} {Math.random().toString(36).substring(2, 6)}
            </span>
          ))}
        </div>

        {/* Realistic Crimson Splatter SVG Overlay (Faded to background) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-0" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          {/* Top border splatter */}
          <path d="M 0,0 L 800,0 L 800,80 C 720,60 670,110 600,40 C 540,120 480,30 420,80 C 370,120 320,40 260,70 C 200,90 140,20 0,65 Z" fill="#EF4444" opacity="0.3" filter="blur(6px)" />
          <path d="M 0,0 L 800,0 L 800,45 C 740,30 690,70 630,30 C 560,90 500,20 450,55 C 390,90 340,30 280,50 C 220,70 160,15 0,40 Z" fill="#991B1B" opacity="0.45" filter="blur(2px)" />
          
          {/* Dripping splatters */}
          <path d="M 120,40 Q 125,90 128,120 Q 130,130 135,130 Q 140,130 138,110 Q 135,70 145,40" fill="#991B1B" opacity="0.5" />
          <path d="M 640,30 Q 645,80 650,115 Q 652,125 658,125 Q 662,125 660,105 Q 655,70 662,30" fill="#EF4444" opacity="0.35" />
        </svg>

        {/* 1. Stylized cryptographic Logo Symbol */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center z-10 relative mt-1"
        >
          {/* Hexagonal HUD frame around the logo */}
          <div className="absolute inset-[-10px] w-[84px] h-[84px] pointer-events-none opacity-30 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-cyber-red animate-[spin_12s_linear_infinite]">
              <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
          </div>
          
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {/* Stylized 'd' */}
            <path 
              d="M 50,42 C 40,42 36,46 36,56 L 36,66 C 36,76 40,80 50,80 L 50,28" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Stylized 'I' */}
            <path 
              d="M 66,28 L 66,80" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* 2. Main Title "Imposter" */}
        <div className="text-center flex flex-col items-center relative z-10 mt-1">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <h1 className="text-5xl md:text-6xl font-sans font-black tracking-wide text-white select-none flex items-center justify-center">
              <span>Imp</span>
              
              {/* Target reticle for 'o' with splatter elements */}
              <div className="relative inline-flex items-center justify-center mx-1 md:mx-1.5">
                <div className="absolute inset-0 bg-cyber-red/20 blur-md rounded-full scale-125 pointer-events-none" />
                
                <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12 text-cyber-red align-middle drop-shadow-[0_0_10px_rgba(239,68,68,0.85)] relative z-10">
                  <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="8" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                  <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="4" />
                  <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="4" />
                  <path d="M 22,25 Q 15,35 24,35 Q 26,20 22,25 Z" fill="currentColor" />
                  <path d="M 75,72 Q 80,82 72,82 Q 68,72 75,72 Z" fill="currentColor" />
                  <circle cx="18" cy="30" r="3" fill="currentColor" />
                  <circle cx="84" cy="40" r="2.5" fill="currentColor" />
                  <circle cx="78" cy="74" r="4" fill="currentColor" />
                </svg>
              </div>

              <span>ster</span>
            </h1>
          </motion.div>
        </div>

        {/* 3. Hooded Character Silhouette with rotating radar HUD & scanner beam */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative flex justify-center items-center z-10 w-48 h-48 md:w-56 md:h-56 my-2"
        >
          {/* Background aura glow */}
          <div className="absolute w-40 h-40 bg-cyber-red/5 blur-3xl rounded-full pointer-events-none" />
          
          {/* Concentric rotating radar circles */}
          <div className="absolute w-full h-full pointer-events-none opacity-20 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full text-cyber-red animate-[spin_30s_linear_infinite]">
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="10 12" />
              <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
              <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
              <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
            </svg>
          </div>

          {/* Laser Scanner Line Sweep */}
          <motion.div
            className="absolute left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-transparent via-cyber-red to-transparent shadow-[0_0_8px_rgba(239,68,68,0.9)] z-20 pointer-events-none"
            animate={{
              top: ["15%", "85%", "15%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(239,68,68,0.15)] relative z-10">
            {/* Shoulder lighting outline */}
            <path 
              d="M 50,265 C 62,230 102,198 150,198 C 198,198 238,230 250,265" 
              fill="none" 
              stroke="#22222E" 
              strokeWidth="2" 
            />
            {/* Shoulders base fill */}
            <path d="M 50,265 C 62,230 102,198 150,198 C 198,198 238,230 250,265 Z" fill="#06060B" />
            
            {/* Hood shape */}
            <path 
              d="M 150,48 C 92,48 72,95 72,160 C 72,208 96,228 150,228 C 204,228 228,208 228,160 C 228,95 208,48 150,48 Z" 
              fill="#08080C" 
              stroke="#1C1C24" 
              strokeWidth="1.5" 
            />
            {/* Inner mask shadowing (Face area) */}
            <path d="M 150,66 C 110,66 92,102 92,160 C 92,198 110,212 150,212 C 190,212 208,198 208,160 C 208,102 190,66 150,66 Z" fill="#000000" />
            
            {/* Glowing Slanted Sharp Eyes (with Glitchy Flickering) */}
            {/* Left Eye */}
            <motion.path 
              d="M 110,146 C 115,148 122,150 132,142 C 122,136 114,140 110,146 Z" 
              fill="#FFFFFF" 
              style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.85))" }}
              animate={{
                opacity: [0.9, 1, 0.4, 1, 0.8, 1, 0.2, 1, 0.95],
                scaleY: [1, 1, 0.1, 1, 1, 1, 0.2, 1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                times: [0, 0.4, 0.42, 0.44, 0.6, 0.8, 0.82, 0.85, 1],
              }}
            />
            {/* Right Eye */}
            <motion.path 
              d="M 190,146 C 185,148 178,150 168,142 C 178,136 186,140 190,146 Z" 
              fill="#FFFFFF" 
              style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.85))" }}
              animate={{
                opacity: [0.9, 1, 0.4, 1, 0.8, 1, 0.2, 1, 0.95],
                scaleY: [1, 1, 0.1, 1, 1, 1, 0.2, 1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                times: [0, 0.4, 0.42, 0.44, 0.6, 0.8, 0.82, 0.85, 1],
                delay: 0.05
              }}
            />
            
            {/* Hood border crimson highlight reflection */}
            <path 
              d="M 150,50 C 102,50 78,95 76,160" 
              fill="none" 
              stroke="#EF4444" 
              strokeWidth="1.2" 
              opacity="0.25" 
            />
          </svg>
        </motion.div>

        {/* 4. Slogan: Staggered Terminal typewriter-style text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.04
              }
            }
          }}
          className="text-center font-sans tracking-[0.2em] uppercase px-4 z-10 my-1"
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-xs font-bold block tracking-[0.22em] mb-0.5">
              {sloganPart1.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 2 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <span className="text-cyber-red text-sm font-black glow-text-red block tracking-[0.26em] min-h-[1.25rem]">
              {sloganPart2.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      scale: 1,
                      textShadow: [
                        "0 0 10px rgba(239, 68, 68, 0.8)",
                        "0 0 15px rgba(239, 68, 68, 0.9)",
                        "0 0 10px rgba(239, 68, 68, 0.8)"
                      ]
                    }
                  }}
                  className="inline-block"
                  transition={{
                    opacity: { duration: 0.1 },
                    textShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </div>
        </motion.div>

        {/* 5. Interactive controls (Main Biometric Scanner + Secondary Como Funciona) */}
        <div className="flex flex-col items-center gap-4.5 z-20 mt-2 mb-1 w-full max-w-xs select-none">
          {/* Main JOGAR Biometric Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            onClick={handleStartGame}
            className="flex flex-col items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-14 h-14 flex items-center justify-center rounded-full border border-cyber-red/35 bg-graphite/50 backdrop-blur-md transition-all duration-300 group-hover:border-cyber-red group-hover:shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              {/* Pulsing ring outer */}
              <div className="absolute inset-0 rounded-full border border-cyber-red/20 animate-ping opacity-50 [animation-duration:1.8s]" />
              
              {/* Biometric Icon */}
              <Fingerprint className="w-7 h-7 text-cyber-red/75 group-hover:text-cyber-red transition-colors duration-300" />
              
              {/* Laser grid scan lines over the fingerprint button */}
              <motion.div 
                className="absolute left-2.5 right-2.5 h-[1.5px] bg-cyber-red shadow-[0_0_6px_#EF4444]"
                animate={{
                  top: ["22%", "78%", "22%"]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <span className="text-[9px] tracking-[0.24em] font-mono text-zinc-500 uppercase font-black block group-hover:text-zinc-300 transition-colors duration-300 animate-pulse text-center px-4">
              [ TOQUE PARA ESCANEAR ]
            </span>
          </motion.div>

          {/* Secondary Como Funciona Ghost Outline Button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setShowTutorial(true);
            }}
            className="px-6 py-2 rounded-lg border border-cyber-red/30 bg-zinc-950/45 text-cyber-red font-mono text-[9px] tracking-[0.22em] uppercase font-black transition-all duration-300 hover:border-cyber-red hover:text-white hover:bg-cyber-red/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.25)] focus:outline-none cursor-pointer"
          >
            COMO FUNCIONA
          </motion.button>
        </div>

      </div>

      <AnimatePresence>
        {showTutorial && (
          <TutorialModal
            isOpen={showTutorial}
            onClose={() => setShowTutorial(false)}
            onStartGame={() => {
              setShowTutorial(false);
              handleStartGame();
            }}
          />
        )}
      </AnimatePresence>
    </GameLayout>
  );
};
export default SplashPage;

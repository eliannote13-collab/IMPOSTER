import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ShieldAlert } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";
import { useAudio } from "../hooks/useAudio";
import { formatTime } from "../utils/game/timerEngine";

export const MatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    players, 
    categoryName, 
    clues, 
    gameMode, 
    secondsRemaining, 
    totalDuration, 
    tickTimer, 
    phase 
  } = useGame();
  
  const { startSuspenseDrone, updateDroneSpeed, stopSuspenseDrone, playClick } = useAudio();
  const [showLeaderHints, setShowLeaderHints] = useState(false);

  // Route protection
  useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  // Navigate when context phase changes to VOTING
  useEffect(() => {
    if (phase === "VOTING") {
      navigate("/voting");
    }
  }, [phase, navigate]);

  // Map remaining time ratio to a heart rate (BPM)
  const ratio = secondsRemaining / totalDuration;
  const currentBpm = useMemo(() => {
    if (secondsRemaining <= 10) return 150; // Critical final 10s
    if (ratio < 0.25) return 120;           // Under 25% duration
    if (ratio < 0.5) return 90;             // Under 50% duration
    return 60;                              // Calm baseline
  }, [secondsRemaining, ratio, totalDuration]);

  // Set up the countdown timer and synthesized background drone
  useEffect(() => {
    // Start background drone with current BPM tension
    startSuspenseDrone(currentBpm);

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      clearInterval(timer);
      stopSuspenseDrone();
    };
  }, [tickTimer, startSuspenseDrone, stopSuspenseDrone]);

  // Dynamically update synthesizer heartbeat pace as BPM threshold steps change
  useEffect(() => {
    updateDroneSpeed(currentBpm);
  }, [currentBpm, updateDroneSpeed]);

  const handleVoteNow = () => {
    // Navigate to voting phase in context
    navigate("/voting");
  };

  const isCritical = secondsRemaining <= 10;
  const isWarning = ratio < 0.25 && !isCritical;

  // Header border glow color mapping
  const activeColor = isCritical ? "red" : "purple";

  return (
    <GameLayout showScanner={true} accentColor={activeColor}>
      <div className="flex flex-col justify-between min-h-[75vh] py-2">
        {/* Category Header */}
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono">
            DISCUSSÃO EM ANDAMENTO
          </span>
          <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest mt-1">
            CATEGORIA ATIVA
          </h3>
          <span className="text-2xl font-mono text-cyber-purple font-black tracking-wider glow-text-purple block mt-0.5">
            {categoryName.toUpperCase()}
          </span>
        </div>

        {/* Giant Timer Section */}
        <div className="my-4 flex flex-col items-center justify-center relative">
          <motion.div
            animate={
              isCritical
                ? { scale: [1, 1.1, 1], opacity: 1 }
                : isWarning
                ? { scale: [1, 1.03, 1], opacity: 1 }
                : {}
            }
            transition={{ repeat: Infinity, duration: isCritical ? 0.4 : 0.8 }}
            className={`w-[200px] h-[200px] rounded-full border-2 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm transition-all duration-300 relative ${
              isCritical
                ? "border-cyber-red shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                : isWarning
                ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                : "border-cyber-purple/40 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            }`}
          >
            {/* Inner background pulsars */}
            <div className={`absolute inset-0 rounded-full scale-95 opacity-5 ${
              isCritical ? "bg-cyber-red animate-ping" : "bg-cyber-purple"
            }`} />

            <span className={`text-4xl md:text-5xl font-mono font-black tracking-wider transition-colors duration-300 ${
              isCritical ? "text-cyber-red glow-text-red" : "text-white"
            }`}>
              {formatTime(secondsRemaining)}
            </span>
            <span className={`text-[9px] uppercase tracking-widest font-mono mt-1 ${
              isCritical ? "text-cyber-red animate-pulse font-black" : "text-zinc-500"
            }`}>
              {isCritical ? "ALERTA CRÍTICO" : "RESTANTE"}
            </span>
          </motion.div>
        </div>

        {/* Leader Hints Overlay (Protected) */}
        {gameMode === "IMPOSTER_LEADER" && (
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => {
                playClick();
                setShowLeaderHints(!showLeaderHints);
              }}
              className="text-[10px] text-zinc-500 hover:text-cyber-purple uppercase font-bold tracking-widest flex items-center gap-1.5 py-1 px-3 border border-zinc-900 hover:border-cyber-purple/30 rounded-full bg-zinc-950/40 transition-all duration-300 cursor-pointer"
            >
              <HelpCircle size={12} />
              {showLeaderHints ? "OCULTAR DICAS DO LÍDER" : "CONSULTAR DICAS (APENAS LÍDER)"}
            </button>

            <AnimatePresence>
              {showLeaderHints && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="w-full mt-3 overflow-hidden"
                >
                  <Card variant="dark" grid={false} className="border-cyber-purple/20 bg-zinc-950/80 p-4">
                    <span className="text-[10px] uppercase tracking-widest text-cyber-purple font-black block mb-2">
                      🔒 ARQUIVO CONFIDENCIAL DO LÍDER:
                    </span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 text-left pr-1 custom-scrollbar">
                      {clues.map((clue, idx) => (
                        <div key={idx} className="text-[10px] text-zinc-400 leading-snug border-b border-zinc-900 pb-1 flex gap-1.5">
                          <span className="text-cyber-purple font-black">#{idx + 1}</span>
                          <span>{clue}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full flex flex-col gap-4 mt-6">
          <Button
            variant={isCritical ? "red" : "purple"}
            size="md"
            fullWidth={true}
            onClick={handleVoteNow}
            glow={isCritical}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert size={16} />
              Votagem Inicial
            </span>
          </Button>

          <p className="text-[9px] text-zinc-600 font-sans leading-relaxed text-center px-4">
            Discutam, debatam e analisem as reações de cada jogador. O tempo corre. Se o cronômetro zerar, a votação será iniciada compulsoriamente.
          </p>
        </div>
      </div>
    </GameLayout>
  );
};
export default MatchPage;

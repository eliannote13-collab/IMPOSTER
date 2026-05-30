import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldAlert, BookOpen, AlertTriangle } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";
import { useAudio } from "../hooks/useAudio";
import { useHoldToReveal } from "../hooks/useHoldToReveal";

export const RevealPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    players, 
    currentPlayerIndex, 
    impostorId, 
    leaderId, 
    word, 
    categoryName, 
    clues, 
    nextReveal, 
    phase 
  } = useGame();
  
  const { playRevealWhoosh } = useAudio();
  const [isRevealed, setIsRevealed] = useState(false);

  // Route protection - If no players or phase is not reveal, go back
  React.useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  // Navigate when context phase changes to DISCUSSION
  React.useEffect(() => {
    if (phase === "DISCUSSION") {
      navigate("/match");
    }
  }, [phase, navigate]);

  const activePlayer = players[currentPlayerIndex];
  if (!activePlayer) return null;

  const isImposter = activePlayer.id === impostorId;
  const isLeader = activePlayer.id === leaderId;

  // Triggered when the 1.5 second hold completes
  const handleRevealComplete = () => {
    playRevealWhoosh();
    setIsRevealed(true);
  };

  const { isHolding, progress, holdHandlers } = useHoldToReveal({
    duration: 1500,
    onRevealComplete: handleRevealComplete,
  });

  const handleNextPlayer = () => {
    setIsRevealed(false);
    // Wait for the 3D flip-back animation (600ms) to finish before changing the player index.
    // This prevents the next player's role from flashing briefly on screen.
    setTimeout(() => {
      nextReveal();
    }, 600);
  };

  // Card flipping animation parameters
  const cardVariants = {
    hidden: { rotateY: 0 },
    revealed: { rotateY: 180 }
  };

  return (
    <GameLayout showScanner={true} accentColor={isRevealed && isImposter ? "red" : "purple"}>
      <div className="flex flex-col justify-between min-h-[75vh] py-2">
        {/* Header Instructions */}
        <div className="text-center flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono">
            REVELAÇÃO DE IDENTIDADES ({currentPlayerIndex + 1}/{players.length})
          </span>
          <h2 className="text-xl font-mono font-black text-white tracking-widest uppercase">
            Passe o dispositivo para:
          </h2>
          <span className="text-2xl font-mono text-cyber-purple font-black tracking-wider glow-text-purple block mt-1">
            {activePlayer.avatar} {activePlayer.name.toUpperCase()}
          </span>
        </div>

        {/* 3D Card Area */}
        <div className="my-6 flex justify-center items-center perspective-1000 min-h-[360px]">
          <motion.div
            variants={cardVariants}
            animate={isRevealed ? "revealed" : "hidden"}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full max-w-[300px] h-[340px] relative cursor-pointer"
          >
            {/* CARD FRONT (HIDDEN LAYER) */}
            <div 
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 w-full h-full"
            >
              <Card variant="purple" className="w-full h-full flex flex-col justify-between items-center border-cyber-purple/40 bg-zinc-950 p-6 text-center select-none">
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="text-4xl animate-pulse">🔒</div>
                  <h3 className="font-mono text-sm font-bold text-zinc-400 uppercase tracking-widest mt-2">
                    DADOS CRIPTOGRAFADOS
                  </h3>
                  <p className="text-[10px] text-zinc-600 font-sans max-w-[200px] mt-1">
                    Mantenha o botão pressionado para que outros jogadores não vejam sua função.
                  </p>
                </div>

                {/* HOLD BUTTON */}
                <div className="w-full relative mt-6">
                  <button
                    {...holdHandlers}
                    className={`w-full py-4 rounded-xl border font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 relative overflow-hidden select-none active:scale-95 cursor-pointer ${
                      isHolding 
                        ? "border-cyber-purple text-cyber-purple bg-cyber-purple/5 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                        : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-zinc-900/40"
                    }`}
                  >
                    {/* Hold Progress Bar Overlay */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-cyber-purple/20 transition-all duration-75 pointer-events-none"
                      style={{ width: `${progress * 100}%` }}
                    />
                    
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Eye size={14} className={isHolding ? "animate-pulse" : ""} />
                      {isHolding ? "REVELANDO ARQUIVO..." : "SEGURE PARA REVELAR"}
                    </span>
                  </button>

                  {/* Anti-accidental release prompt */}
                  <span className="text-[9px] text-zinc-500 font-sans tracking-wide block mt-2 text-center">
                    (Requer 1.5s de contato contínuo)
                  </span>
                </div>
              </Card>
            </div>

            {/* CARD BACK (REVEALED LAYER) */}
            <div 
              style={{ 
                backfaceVisibility: "hidden", 
                transform: "rotateY(180deg)" 
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Card 
                variant={isImposter ? "red" : "purple"} 
                className={`w-full h-full flex flex-col justify-between p-6 border-2 ${
                  isImposter ? "border-cyber-red/60" : "border-cyber-purple/60"
                }`}
                grid={true}
              >
                {/* Imposter View */}
                {isImposter && (
                  <div className="flex-grow flex flex-col justify-between items-center text-center">
                    <div className="flex flex-col items-center mt-2">
                      <ShieldAlert size={44} className="text-cyber-red animate-pulse" />
                      <h3 className="text-2xl font-mono font-black text-cyber-red uppercase tracking-widest mt-3 glow-text-red">
                        IMPOSTOR
                      </h3>
                      <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-widest mt-1 block">
                        Você foi hackeado
                      </span>
                    </div>

                    <div className="p-3 bg-cyber-red/5 border border-cyber-red/20 rounded-xl max-w-[240px]">
                      <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                        Você <span className="font-bold text-cyber-red">não sabe</span> a palavra secreta. Observe as respostas dos outros, finja conhecer o tema e evite ser votado!
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                      <AlertTriangle size={10} />
                      <span>Fique frio sob pressão</span>
                    </div>
                  </div>
                )}

                {/* Victim View */}
                {!isImposter && !isLeader && (
                  <div className="flex-grow flex flex-col justify-between items-center text-center">
                    <div className="flex flex-col items-center mt-2">
                      <BookOpen size={40} className="text-cyber-purple" />
                      <h3 className="text-lg font-mono font-bold text-zinc-400 uppercase tracking-widest mt-3">
                        CATEGORIA: {categoryName.toUpperCase()}
                      </h3>
                    </div>

                    <div className="flex flex-col items-center gap-1 py-4">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest">A Palavra Secreta é:</span>
                      <h4 className="text-2xl font-mono font-black text-cyber-purple uppercase tracking-widest glow-text-purple">
                        {word}
                      </h4>
                    </div>

                    <div className="p-3 bg-cyber-purple/5 border border-cyber-purple/20 rounded-xl max-w-[240px]">
                      <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                        Faça perguntas inteligentes aos outros para identificar o impostor. Evite dar dicas óbvias sobre a palavra!
                      </p>
                    </div>
                  </div>
                )}

                {/* Leader View */}
                {isLeader && (
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="text-center">
                      <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                        LÍDER DA INTERROGAÇÃO
                      </h3>
                      <h4 className="text-xl font-mono font-black text-cyber-purple uppercase tracking-widest glow-text-purple mt-1">
                        {word}
                      </h4>
                    </div>

                    {/* Clues listing */}
                    <div className="my-2 border border-zinc-900 bg-zinc-950/60 rounded-xl p-3 flex-grow overflow-y-auto max-h-[170px] custom-scrollbar text-left flex flex-col gap-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                        10 Dicas Criptografadas:
                      </span>
                      {clues.map((clue, idx) => (
                        <div key={idx} className="text-[10px] text-zinc-300 leading-snug border-b border-zinc-900/60 pb-1 flex gap-1.5 items-start">
                          <span className="text-cyber-purple font-black">#{idx + 1}</span>
                          <span>{clue}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="text-[9px] text-zinc-400 font-sans leading-relaxed">
                        Guie as vítimas usando estas dicas progressivas. Se o impostor descobrir que você é o líder, ele ganha!
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Action Controls - Visible only after reveal */}
        <div className="h-[46px] flex items-center justify-center">
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-[300px]"
              >
                <Button
                  variant={isImposter ? "red" : "purple"}
                  size="md"
                  fullWidth={true}
                  onClick={handleNextPlayer}
                >
                  OK, ENTENDI
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameLayout>
  );
};
export default RevealPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldAlert, Check } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";

export const VotingPage: React.FC = () => {
  const navigate = useNavigate();
  const { players, submitVote, finishVoting, phase } = useGame();
  
  // Track which player is currently casting their secret vote (0 to players.length - 1)
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);
  // Whether the voter is active or if we are in the "Pass device" screen
  const [showVoterBoard, setShowVoterBoard] = useState(false);
  // Who the current voter selected
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  // Route protection
  React.useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  // Navigate when context phase changes to RESULT
  React.useEffect(() => {
    if (phase === "RESULT") {
      navigate("/result");
    }
  }, [phase, navigate]);

  const activeVoter = players[currentVoterIdx];
  if (!activeVoter) return null;

  // Filter out the voter from the target choices (can't vote for themselves)
  const targets = players.filter((p) => p.id !== activeVoter.id);

  const handleConfirmVote = () => {
    if (!selectedTargetId) return;

    // Register vote in context
    submitVote(activeVoter.id, selectedTargetId);
    
    // Clear selection
    setSelectedTargetId(null);

    // Check if there are more players to vote
    const nextIdx = currentVoterIdx + 1;
    if (nextIdx < players.length) {
      // Move to next player but go back to pass screen first
      setCurrentVoterIdx(nextIdx);
      setShowVoterBoard(false);
    } else {
      // Everyone has voted, resolve results
      finishVoting();
    }
  };

  return (
    <GameLayout showScanner={true} accentColor="purple">
      <div className="flex flex-col justify-between min-h-[75vh] py-2">
        
        {/* Pass Device Intermission Screen */}
        <AnimatePresence mode="wait">
          {!showVoterBoard ? (
            <motion.div
              key="pass-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-grow flex flex-col justify-between"
            >
              <div className="text-center my-6">
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono">
                  SALA DE DETENÇÃO E VOTOS
                </span>
                <h2 className="text-xl font-mono font-black text-white tracking-widest uppercase mt-2">
                  PASSE O DISPOSITIVO PARA:
                </h2>
                <span className="text-2xl font-mono text-cyber-purple font-black tracking-wider glow-text-purple block mt-1">
                  {activeVoter.avatar} {activeVoter.name.toUpperCase()}
                </span>
                <p className="text-[10px] text-zinc-600 font-sans max-w-[240px] mx-auto mt-4 leading-relaxed">
                  Sua escolha deve ser secreta. Não revele em quem está votando para os outros interrogados.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center my-6">
                <div className="text-5xl animate-pulse">🕵️</div>
              </div>

              <Button
                variant="purple"
                size="md"
                fullWidth={true}
                onClick={() => setShowVoterBoard(true)}
              >
                <span className="flex items-center justify-center gap-2">
                  <Eye size={14} />
                  Entrar na Sala de Votação
                </span>
              </Button>
            </motion.div>
          ) : (
            /* Active Voting Screen */
            <motion.div
              key="vote-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="text-center mb-4">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    INTERROGANTE: {activeVoter.name.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wide mt-1">
                    Quem é o Impostor?
                  </h3>
                </div>

                {/* Player Grid Choices */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  {targets.map((target) => {
                    const isSelected = selectedTargetId === target.id;
                    return (
                      <button
                        key={target.id}
                        onClick={() => setSelectedTargetId(target.id)}
                        className="text-left focus:outline-none cursor-pointer"
                      >
                        <Card
                          variant={isSelected ? "purple" : "dark"}
                          glow={isSelected}
                          grid={false}
                          className={`p-3 border flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[96px] ${
                            isSelected
                              ? "border-cyber-purple bg-cyber-purple/5"
                              : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800"
                          }`}
                        >
                          <span className="text-2xl mb-1">{target.avatar}</span>
                          <span className="font-mono text-xs font-bold text-gray-200 truncate max-w-[110px]">
                            {target.name}
                          </span>
                          
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-cyber-purple text-white p-0.5 rounded-full shadow-[0_0_8px_#8B5CF6]">
                              <Check size={10} />
                            </div>
                          )}
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Action Button */}
              <div className="mt-6">
                <Button
                  variant="purple"
                  size="md"
                  fullWidth={true}
                  onClick={handleConfirmVote}
                  disabled={!selectedTargetId}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShieldAlert size={14} />
                    Confirmar Voto
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
};
export default VotingPage;

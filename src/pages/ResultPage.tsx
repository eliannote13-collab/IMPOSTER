import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, RefreshCw, Home, ShieldAlert, Award } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";
import { useAudio } from "../hooks/useAudio";
import { calculateVotes } from "../utils/game/voteCalculator";

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    players, 
    impostorId, 
    leaderId, 
    word, 
    categoryName, 
    votes, 
    winner, 
    resetMatch, 
    restartSession 
  } = useGame();
  
  const { playResult } = useAudio();

  // Route protection
  useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  // Trigger win/lose musical fanfare once on mount
  useEffect(() => {
    if (winner) {
      playResult(winner === "VICTIM");
    }
  }, [winner, playResult]);

  // Retrieve voting calculations for the scoreboard
  const voteAnalysis = useMemo(() => {
    return calculateVotes(votes, impostorId);
  }, [votes, impostorId]);

  const imposterPlayer = players.find((p) => p.id === impostorId);
  const leaderPlayer = players.find((p) => p.id === leaderId);

  const handlePlayAgain = () => {
    resetMatch();
    navigate("/theme"); // Start new round directly
  };

  const handleReturnMenu = () => {
    restartSession();
    navigate("/");
  };

  const isVictimVictory = winner === "VICTIM";
  const accentColor = isVictimVictory ? "purple" : "red";

  return (
    <GameLayout showScanner={true} accentColor={accentColor}>
      <div className="flex flex-col justify-between min-h-[75vh] py-2">
        
        {/* Victory Announcement Header */}
        <div className="text-center mt-2">
          <div className="flex justify-center mb-2">
            <Trophy size={48} className={isVictimVictory ? "text-cyber-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "text-cyber-red drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"} />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono">
            ARQUIVO DE INTERROGAÇÃO FECHADO
          </span>
          <h2 className={`text-3xl font-mono font-black tracking-widest uppercase mt-1 ${
            isVictimVictory ? "text-cyber-purple glow-text-purple" : "text-cyber-red glow-text-red"
          }`}>
            {isVictimVictory ? "VÍTIMAS VENCERAM!" : "IMPOSTOR VENCEU!"}
          </h2>
        </div>

        {/* Secret Info Reveal Panel */}
        <Card variant={accentColor} className="my-4">
          <div className="flex flex-col gap-4 text-center">
            
            {/* Word details */}
            <div className="border-b border-zinc-900 pb-3">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-0.5">
                Palavra do Tema ({categoryName})
              </span>
              <h3 className="text-xl font-mono font-black text-white uppercase tracking-wider">
                {word}
              </h3>
            </div>

            {/* Imposter Reveal */}
            <div className="flex justify-between items-center px-2 py-1">
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-cyber-red" />
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Impostor Oculto
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyber-red bg-cyber-red/10 border border-cyber-red/30 px-3 py-1 rounded-lg">
                {imposterPlayer ? `${imposterPlayer.avatar} ${imposterPlayer.name.toUpperCase()}` : "NENHUM"}
              </span>
            </div>

            {/* Leader Reveal */}
            {leaderPlayer && (
              <div className="flex justify-between items-center px-2 py-1 border-t border-zinc-900/60 pt-2">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-cyber-purple" />
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Líder Tático
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyber-purple bg-cyber-purple/10 border border-cyber-purple/30 px-3 py-1 rounded-lg">
                  {leaderPlayer.avatar} {leaderPlayer.name.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Voting Tally Board */}
        <div className="flex-grow my-2">
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-2 text-center md:text-left px-1">
            ANÁLISE DOS VOTOS DA DETENÇÃO
          </span>
          <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1 custom-scrollbar">
            {players.map((player) => {
              const votesReceived = voteAnalysis.tally[player.id] || 0;
              const votedForId = votes[player.id];
              const votedForPlayer = players.find((p) => p.id === votedForId);
              
              const isImposterNode = player.id === impostorId;
              const gotAccused = player.id === voteAnalysis.accusedId;

              return (
                <div 
                  key={player.id} 
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-300 ${
                    gotAccused
                      ? isImposterNode
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-cyber-red/30 bg-cyber-red/5"
                      : "border-zinc-900/60 bg-zinc-950/20"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${isImposterNode ? "text-cyber-red" : "text-gray-200"}`}>
                      {player.avatar} {player.name} {isImposterNode && "(Impostor)"}
                    </span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                      Votou em: {votedForPlayer ? votedForPlayer.name : "Ninguém"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      votesReceived > 0 
                        ? isImposterNode 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-cyber-red/10 text-cyber-red border border-cyber-red/20"
                        : "bg-zinc-900 text-zinc-600"
                    }`}>
                      {votesReceived} {votesReceived === 1 ? "voto" : "votos"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="graphite"
            size="md"
            fullWidth={true}
            onClick={handleReturnMenu}
          >
            <span className="flex items-center gap-2">
              <Home size={16} />
              Menu
            </span>
          </Button>

          <Button
            variant={isVictimVictory ? "purple" : "red"}
            size="md"
            fullWidth={true}
            onClick={handlePlayAgain}
            glow={true}
          >
            <span className="flex items-center gap-2 animate-pulse">
              <RefreshCw size={16} />
              De novo
            </span>
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
export default ResultPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, UserCheck, Users } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";

export const GameModePage: React.FC = () => {
  const navigate = useNavigate();
  const { gameMode, setGameMode, players } = useGame();

  // Route protection - Redirect back to players page if empty
  React.useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  const selectMode = (mode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER") => {
    setGameMode(mode);
  };

  return (
    <GameLayout showScanner={true} accentColor="purple">
      <div className="flex flex-col justify-between min-h-[75vh]">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left mt-2">
          <h2 className="text-2xl font-mono font-black text-white tracking-widest uppercase">
            MODO DE JOGO
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
            Selecione o nível de espionagem tática
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 my-6">
          {/* Mode 1 Card */}
          <button
            onClick={() => selectMode("SINGLE_IMPOSTER")}
            className="text-left w-full focus:outline-none cursor-pointer"
          >
            <Card
              variant={gameMode === "SINGLE_IMPOSTER" ? "purple" : "dark"}
              glow={gameMode === "SINGLE_IMPOSTER"}
              className={`border transition-all duration-300 ${
                gameMode === "SINGLE_IMPOSTER"
                  ? "border-cyber-purple bg-cyber-purple/5"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl border ${
                  gameMode === "SINGLE_IMPOSTER" 
                    ? "border-cyber-purple bg-cyber-purple/10 text-cyber-purple" 
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                }`}>
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Infiltração Padrão
                  </h3>
                  <span className="text-[10px] text-cyber-purple/80 uppercase font-black tracking-widest block mt-0.5">
                    1 Impostor
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans mt-2 leading-relaxed">
                    Um impostor oculto tenta se passar por vítima. As vítimas sabem a palavra e debatem para descobrir o traidor.
                  </p>
                </div>
              </div>
            </Card>
          </button>

          {/* Mode 2 Card */}
          <button
            onClick={() => selectMode("IMPOSTER_LEADER")}
            className="text-left w-full focus:outline-none cursor-pointer"
          >
            <Card
              variant={gameMode === "IMPOSTER_LEADER" ? "purple" : "dark"}
              glow={gameMode === "IMPOSTER_LEADER"}
              className={`border transition-all duration-300 ${
                gameMode === "IMPOSTER_LEADER"
                  ? "border-cyber-purple bg-cyber-purple/5"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl border ${
                  gameMode === "IMPOSTER_LEADER" 
                    ? "border-cyber-purple bg-cyber-purple/10 text-cyber-purple" 
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                }`}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Operação Líder
                  </h3>
                  <span className="text-[10px] text-cyber-purple/80 uppercase font-black tracking-widest block mt-0.5">
                    1 Impostor + 1 Líder
                  </span>
                  <p className="text-[11px] text-zinc-400 font-sans mt-2 leading-relaxed">
                    Adiciona o Líder ao jogo, que sabe a palavra e recebe 10 dicas para guiar as vítimas sutilmente sem revelar sua identidade secreta ao impostor.
                  </p>
                </div>
              </div>
            </Card>
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex gap-4">
          <Button
            variant="graphite"
            size="md"
            fullWidth={true}
            onClick={() => navigate("/players")}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Voltar
            </span>
          </Button>

          <Button
            variant="purple"
            size="md"
            fullWidth={true}
            onClick={() => navigate("/time")}
          >
            <span className="flex items-center gap-2">
              Avançar
              <ArrowRight size={16} />
            </span>
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};
export default GameModePage;

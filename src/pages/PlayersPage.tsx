import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { useGame } from "../hooks/useGame";

export const PlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const { players, addPlayer, removePlayer } = useGame();
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = nameInput.trim();

    if (!trimmed) {
      setError("Por favor, digite um nome.");
      return;
    }
    
    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Este nome já está em uso.");
      return;
    }

    if (players.length >= 10) {
      setError("Máximo de 10 jogadores alcançado.");
      return;
    }

    addPlayer(trimmed);
    setNameInput("");
  };

  const handleNext = () => {
    if (players.length < 3) {
      setError("Mínimo de 3 jogadores necessários.");
      return;
    }
    navigate("/mode");
  };

  return (
    <GameLayout showScanner={true} accentColor="purple">
      <div className="flex flex-col justify-between min-h-[75vh]">
        {/* Title area */}
        <div className="flex flex-col gap-2 text-center md:text-left mt-2">
          <h2 className="text-2xl font-mono font-black text-white tracking-widest uppercase">
            REGISTRAR JOGADORES
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
            Cadastre os participantes (3 a 10)
          </p>
        </div>

        {/* Input area */}
        <Card variant="purple" className="my-4">
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex gap-2 items-end">
              <Input
                label="Codinome do Jogador"
                placeholder="Ex: Hunter, Neo, Trinity..."
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                maxLength={14}
              />
              <Button
                variant="purple"
                size="md"
                type="submit"
                className="h-[46px]"
                glow={false}
              >
                <Plus size={18} />
              </Button>
            </div>
          </form>
        </Card>

        {/* List area */}
        <div className="flex-grow overflow-y-auto max-h-[35vh] px-1 py-2 flex flex-col gap-2">
          {players.length === 0 ? (
            <div className="text-center text-xs text-zinc-600 uppercase tracking-widest py-8 font-mono">
              Nenhum jogador registrado.
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-900/60 bg-graphite/40 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
                      {player.avatar}
                    </span>
                    <span className="font-mono text-sm font-semibold tracking-wide text-gray-200">
                      {player.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-zinc-500 hover:text-cyber-red transition-colors duration-300 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="graphite"
            size="md"
            fullWidth={true}
            onClick={() => navigate("/")}
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
            onClick={handleNext}
            disabled={players.length < 3}
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
export default PlayersPage;

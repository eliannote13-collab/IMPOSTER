import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { GameLayout } from "../components/layout/GameLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useGame } from "../hooks/useGame";

export const TimePage: React.FC = () => {
  const navigate = useNavigate();
  const { timerPreset, setTimerPreset, customMinutes, setCustomMinutes, players } = useGame();
  
  // Custom minutes input state
  const [minutesInput, setMinutesInput] = useState(customMinutes.toString());
  const [error, setError] = useState("");

  // Route protection
  React.useEffect(() => {
    if (players.length < 3) {
      navigate("/players");
    }
  }, [players, navigate]);

  const handlePresetSelect = (preset: string) => {
    setTimerPreset(preset);
  };

  const handleCustomMinutesChange = (val: string) => {
    setMinutesInput(val);
    setError("");
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Insira um número maior que 0.");
      return;
    }
    if (parsed > 60) {
      setError("Máximo de 60 minutos.");
      return;
    }
    setCustomMinutes(parsed);
  };

  const handleNext = () => {
    if (timerPreset === "custom") {
      const parsed = parseInt(minutesInput, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 60) {
        setError("Insira um valor válido para avançar.");
        return;
      }
    }
    navigate("/theme");
  };

  const presets = [
    { id: "1m", label: "1 Minuto", desc: "Debate relâmpago e tenso" },
    { id: "3m", label: "3 Minutos", desc: "Tempo ideal para dedução" },
    { id: "5m", label: "5 Minutos", desc: "Interrogação profunda" },
    { id: "10m", label: "10 Minutos", desc: "Investigação tática" },
  ];

  return (
    <GameLayout showScanner={true} accentColor="purple">
      <div className="flex flex-col justify-between min-h-[75vh]">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left mt-2">
          <h2 className="text-2xl font-mono font-black text-white tracking-widest uppercase">
            TEMPO DE DISCUSSÃO
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
            Defina o cronômetro para o interrogatório
          </p>
        </div>

        {/* Timer Presets Selection */}
        <div className="flex flex-col gap-3 my-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className="text-left w-full focus:outline-none cursor-pointer"
            >
              <Card
                variant={timerPreset === preset.id ? "purple" : "dark"}
                glow={timerPreset === preset.id}
                grid={false}
                className={`py-3.5 px-4 border transition-all duration-300 ${
                  timerPreset === preset.id
                    ? "border-cyber-purple bg-cyber-purple/5"
                    : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Clock size={16} className={timerPreset === preset.id ? "text-cyber-purple" : "text-zinc-500"} />
                    <div>
                      <h4 className="font-mono text-sm font-bold text-white tracking-wide">
                        {preset.label}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{preset.desc}</p>
                    </div>
                  </div>
                  {timerPreset === preset.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyber-purple shadow-[0_0_8px_#8B5CF6]" />
                  )}
                </div>
              </Card>
            </button>
          ))}

          {/* Custom Option Card */}
          <button
            onClick={() => handlePresetSelect("custom")}
            className="text-left w-full focus:outline-none cursor-pointer"
          >
            <Card
              variant={timerPreset === "custom" ? "purple" : "dark"}
              glow={timerPreset === "custom"}
              grid={false}
              className={`py-3.5 px-4 border transition-all duration-300 ${
                timerPreset === "custom"
                  ? "border-cyber-purple bg-cyber-purple/5"
                  : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Clock size={16} className={timerPreset === "custom" ? "text-cyber-purple" : "text-zinc-500"} />
                  <h4 className="font-mono text-sm font-bold text-white tracking-wide">
                    Personalizado
                  </h4>
                </div>
                {timerPreset === "custom" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyber-purple shadow-[0_0_8px_#8B5CF6]" />
                )}
              </div>
            </Card>
          </button>

          {/* Custom Input Panel - Only visible when custom is active */}
          {timerPreset === "custom" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="px-1 overflow-hidden"
            >
              <Card variant="dark" grid={false} className="border-zinc-900 bg-zinc-950/40 p-4 mt-1">
                <Input
                  label="Minutos do Cronômetro"
                  type="number"
                  placeholder="Ex: 4"
                  value={minutesInput}
                  onChange={(e) => handleCustomMinutesChange(e.target.value)}
                  error={error}
                  min={1}
                  max={60}
                />
              </Card>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-4">
          <Button
            variant="graphite"
            size="md"
            fullWidth={true}
            onClick={() => navigate("/mode")}
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
export default TimePage;

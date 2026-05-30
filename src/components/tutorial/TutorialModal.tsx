import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Shield, 
  Crown, 
  Skull, 
  AlertCircle,
  Play,
  FileText
} from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import { Button } from "../ui/Button";
import { RoleCard } from "./RoleCard";
import { StepIndicator } from "./StepIndicator";
import { TutorialStep } from "./TutorialStep";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward
  const { playClick, playRevealWhoosh } = useAudio();

  const totalSteps = 5;

  // Listen to Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      playRevealWhoosh();
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      playRevealWhoosh();
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGoToStep = (step: number) => {
    if (step === currentStep) return;
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Dark overlay with glass blur effect) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Futuristic briefing modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative w-full max-w-2xl h-[88vh] md:h-auto max-h-[88vh] md:max-h-[90vh] flex flex-col justify-between bg-zinc-950 border border-cyber-red/30 shadow-[0_0_30px_rgba(239,68,68,0.15),inset_0_0_15px_rgba(239,68,68,0.05)] rounded-2xl overflow-hidden crt-effect scanline-overlay z-10"
      >
        {/* Cyber Grid background layer */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] cyber-grid-red z-0" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-900/60 bg-zinc-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-ping" />
            <h3 className="font-mono text-[10px] md:text-xs font-black tracking-[0.25em] text-zinc-400 uppercase">
              [ BRIEFING DE MISSÃO OPERACIONAL ]
            </h3>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1 rounded-md text-zinc-500 hover:text-cyber-red hover:bg-cyber-red/10 border border-transparent hover:border-cyber-red/20 transition-all duration-300 cursor-pointer focus:outline-none"
            aria-label="Fechar tutorial"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 md:px-7 scrollbar-thin flex flex-col justify-center min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <TutorialStep stepDirection={direction} stepKey={0} key="step-0">
                <div className="flex flex-col items-center gap-4 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
                    <HelpCircle size={32} className="text-cyber-red" />
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-mono font-black text-white tracking-widest uppercase">
                    O QUE É O IMPOSTER?
                  </h2>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                    Um jogo estratégico de espionagem e dedução social projetado para animar qualquer roda de amigos. Apenas sua inteligência e capacidade de improviso garantirão a vitória.
                  </p>

                  <div className="flex flex-col gap-2 w-full mt-3 text-left">
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-red mt-1.5 shrink-0" />
                      <p className="text-[11px] text-zinc-400 font-mono leading-normal">
                        <strong className="text-white">Dedução Coletiva:</strong> A rodada inicia e os agentes recebem uma palavra secreta em comum.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-red mt-1.5 shrink-0" />
                      <p className="text-[11px] text-zinc-400 font-mono leading-normal">
                        <strong className="text-white">O Infiltrado:</strong> Um dos jogadores não recebe a palavra secreta — ele é o <span className="text-cyber-red font-bold">Impostor</span>.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-red mt-1.5 shrink-0" />
                      <p className="text-[11px] text-zinc-400 font-mono leading-normal">
                        <strong className="text-white">O Combate:</strong> Através de perguntas e respostas, o grupo tenta expor quem está mentindo.
                      </p>
                    </div>
                  </div>
                </div>
              </TutorialStep>
            )}

            {currentStep === 1 && (
              <TutorialStep stepDirection={direction} stepKey={1} key="step-1">
                <div className="w-full flex flex-col gap-4">
                  <div className="text-center mb-1">
                    <h2 className="text-lg md:text-xl font-mono font-black text-white tracking-widest uppercase">
                      ESCOLHA SEU LADO: PAPÉIS ATIVOS
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                      Cada cargo possui responsabilidades exclusivas na inteligência tática
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[48vh] md:max-h-none pr-1 scrollbar-thin">
                    <RoleCard
                      title="Impostor"
                      color="red"
                      icon={Skull}
                      description="O agente duplo infiltrado na simulação que não recebeu as coordenadas."
                      bullets={[
                        "Não sabe a palavra secreta.",
                        "Precisa mentir e improvisar.",
                        "Tenta adivinhar o tema."
                      ]}
                    />
                    <RoleCard
                      title="Vítima"
                      color="cyan"
                      icon={Shield}
                      description="Membro da equipe tática que recebeu a palavra secreta."
                      bullets={[
                        "Sabe a palavra secreta.",
                        "Identifica desvios de respostas.",
                        "Tenta eliminar o Impostor."
                      ]}
                    />
                    <RoleCard
                      title="Líder"
                      color="amber"
                      icon={Crown}
                      description="Agente coordenador com vantagens especiais de segurança."
                      bullets={[
                        "Sabe a palavra secreta.",
                        "Recebe pistas criptografadas.",
                        "Direciona a linha de debate."
                      ]}
                    />
                  </div>
                </div>
              </TutorialStep>
            )}

            {currentStep === 2 && (
              <TutorialStep stepDirection={direction} stepKey={2} key="step-2">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
                  <div className="text-center mb-1">
                    <h2 className="text-lg md:text-xl font-mono font-black text-white tracking-widest uppercase">
                      FLUXO DE OPERAÇÃO
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                      Siga o protocolo estabelecido passo a passo
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[45vh] pr-1 scrollbar-thin">
                    {[
                      { num: "01", title: "Configuração Básica", desc: "Adicione os codinomes dos jogadores e defina o tempo do debate tático." },
                      { num: "02", title: "Sincronização", desc: "Escolha o modo de jogo e escaneie o código QR do tema na mesa." },
                      { num: "03", title: "Cifragem de Papéis", desc: "Passe o dispositivo. Cada jogador toca na digital para revelar seu papel secretamente." },
                      { num: "04", title: "Debate Aberto", desc: "Faça perguntas em roda. Cuidado para não revelar demais ao dar pistas." },
                      { num: "05", title: "A Votação", desc: "O tempo expira. Todos votam simultaneamente no suspeito de ser o impostor." }
                    ].map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        key={index}
                        className="p-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl flex gap-3.5 items-center transition-colors duration-200"
                      >
                        <div className="w-9 h-9 rounded-lg bg-cyber-red/5 border border-cyber-red/20 text-cyber-red font-mono font-black text-xs flex items-center justify-center shrink-0">
                          {item.num}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TutorialStep>
            )}

            {currentStep === 3 && (
              <TutorialStep stepDirection={direction} stepKey={3} key="step-3">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
                  <div className="text-center mb-1">
                    <h2 className="text-lg md:text-xl font-mono font-black text-white tracking-widest uppercase">
                      DIRETRIZES DE SEGURANÇA
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                      Regras críticas que ditam a sobrevivência operacional
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[45vh] pr-1 scrollbar-thin">
                    {[
                      {
                        title: "Cifragem Total",
                        desc: "NUNCA revele a tela com seu papel para outros agentes. O segredo é sua única arma.",
                        icon: AlertCircle,
                        color: "border-cyber-red/20 text-cyber-red"
                      },
                      {
                        title: "Pistas Sutis",
                        desc: "Diga coisas que apenas quem sabe a palavra entenda. Respostas diretas entregam o jogo ao Impostor.",
                        icon: FileText,
                        color: "border-cyan-500/20 text-cyan-400"
                      },
                      {
                        title: "Infiltração Tática",
                        desc: "Se você for o Impostor, roube termos das perguntas alheias para simular que conhece a palavra.",
                        icon: Skull,
                        color: "border-purple-500/20 text-purple-400"
                      },
                      {
                        title: "Vitória do Impostor",
                        desc: "O Impostor vence se não for o mais votado, se houver empate ou se adivinhar o tema secreto.",
                        icon: Crown,
                        color: "border-amber-500/20 text-amber-400"
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className={`p-3.5 rounded-xl border bg-zinc-950/80 ${item.color.split(" ")[0]} flex flex-col gap-1.5`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={14} className={item.color.split(" ")[1]} />
                          <h4 className={`text-xs font-mono font-bold uppercase tracking-wide ${item.color.split(" ")[1]}`}>
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TutorialStep>
            )}

            {currentStep === 4 && (
              <TutorialStep stepDirection={direction} stepKey={4} key="step-4">
                <div className="flex flex-col items-center gap-4 text-center max-w-sm mx-auto">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-cyber-red/35 bg-cyber-red/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <span className="absolute inset-0 rounded-full border border-cyber-red/25 animate-ping opacity-60" />
                    <Play size={24} className="text-cyber-red ml-1 animate-pulse" />
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-mono font-black text-white tracking-widest uppercase">
                    VOCÊ ESTÁ PRONTO?
                  </h2>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    A simulação de infiltração está pronta para ser executada. O impostor está mascarado entre vocês. Descubra-o antes que seja tarde.
                  </p>

                  <div className="flex flex-col gap-2 w-full mt-4">
                    <Button
                      variant="red"
                      size="md"
                      fullWidth={true}
                      onClick={onStartGame}
                    >
                      <span className="flex items-center gap-2 font-mono">
                        COMEÇAR SIMULAÇÃO
                      </span>
                    </Button>
                    
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                      }}
                      className="py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-500 font-mono text-[10px] tracking-widest uppercase hover:border-zinc-700 hover:text-zinc-300 transition-all duration-300 cursor-pointer focus:outline-none"
                    >
                      FECHAR E VOLTAR
                    </button>
                  </div>
                </div>
              </TutorialStep>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        <div className="relative z-10 flex items-center justify-between px-5 py-4 border-t border-zinc-900/60 bg-zinc-950/80 backdrop-blur-sm">
          {/* Back Button */}
          <div className="w-20">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-[10px] font-mono font-bold text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none uppercase"
              >
                <ChevronLeft size={14} /> Voltar
              </button>
            ) : (
              <span className="block w-full h-1" />
            )}
          </div>

          {/* Steps Indicator dots */}
          <StepIndicator
            totalSteps={totalSteps}
            currentStep={currentStep}
            onStepClick={handleGoToStep}
          />

          {/* Next Button */}
          <div className="w-20 flex justify-end">
            {currentStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-cyber-red hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none uppercase"
              >
                Avançar <ChevronRight size={14} />
              </button>
            ) : (
              <span className="block w-full h-1" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default TutorialModal;

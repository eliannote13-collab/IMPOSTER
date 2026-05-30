import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "../../hooks/useAudio";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  onStepClick,
}) => {
  const { playClick } = useAudio();

  const handleStepClick = (step: number) => {
    playClick();
    onStepClick(step);
  };

  return (
    <div className="flex gap-2.5 items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isActive = idx === currentStep;
        return (
          <button
            key={idx}
            onClick={() => handleStepClick(idx)}
            className="relative focus:outline-none cursor-pointer p-1"
            aria-label={`Ir para etapa ${idx + 1}`}
          >
            {/* Pulsing neon highlight under the active dot */}
            {isActive && (
              <motion.div
                layoutId="activeDotGlow"
                className="absolute inset-0 rounded-full bg-cyber-red/25 blur-[3px]"
              />
            )}
            
            <motion.div
              animate={{
                scale: isActive ? 1.25 : 1,
                backgroundColor: isActive ? "#EF4444" : "#27272A", // cyber-red vs zinc-800
                boxShadow: isActive ? "0 0 8px #EF4444" : "none"
              }}
              transition={{ duration: 0.3 }}
              className="w-2.5 h-2.5 rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
};
export default StepIndicator;

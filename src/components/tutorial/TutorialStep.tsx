import React from "react";
import { motion } from "framer-motion";

interface TutorialStepProps {
  children: React.ReactNode;
  stepDirection: number; // 1 for next, -1 for back
  stepKey: number; // current step index to force re-render/animation
}

export const TutorialStep: React.FC<TutorialStepProps> = ({
  children,
  stepDirection,
  stepKey,
}) => {
  // Cinematic slide-and-fade animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        filter: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 60 : -60,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        filter: { duration: 0.15 },
      },
    }),
  };

  return (
    <motion.div
      key={stepKey}
      custom={stepDirection}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full flex-1 flex flex-col justify-center items-center"
    >
      {children}
    </motion.div>
  );
};
export default TutorialStep;

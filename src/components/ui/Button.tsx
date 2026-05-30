import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "../../hooks/useAudio";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "purple" | "red" | "graphite" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "purple",
  size = "md",
  fullWidth = false,
  glow = true,
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  const { playClick } = useAudio();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    playClick();
    if (onClick) {
      onClick(e);
    }
  };

  // Neon color styles
  const variantStyles = {
    purple: `bg-cyber-purple text-white border border-cyber-purple hover:bg-neon-purple-dark hover:border-neon-purple-dark ${
      glow ? "shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]" : ""
    }`,
    red: `bg-cyber-red text-white border border-cyber-red hover:bg-neon-red-dark hover:border-neon-red-dark ${
      glow ? "shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]" : ""
    }`,
    graphite: "bg-graphite text-gray-200 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700",
    outline: "bg-transparent text-cyber-purple border border-cyber-purple/50 hover:bg-cyber-purple/10 hover:border-cyber-purple",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-md",
    md: "px-5 py-2.5 text-sm font-bold tracking-wider uppercase rounded-lg",
    lg: "px-8 py-3.5 text-base font-extrabold tracking-widest uppercase rounded-xl",
    xl: "px-10 py-4.5 text-lg font-black tracking-widest uppercase rounded-2xl",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={handleOnClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-mono transition-all duration-300 select-none cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
export default Button;

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "purple" | "red" | "dark";
  glow?: boolean;
  pulse?: boolean;
  grid?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "purple",
  glow = true,
  pulse = false,
  grid = true,
  className = "",
  ...props
}) => {
  const baseClasses = "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border backdrop-blur-md";
  
  const variantClasses = {
    purple: `bg-graphite/80 border-cyber-purple/30 ${
      glow ? "shadow-[0_0_20px_rgba(239,68,68,0.15),inset_0_0_10px_rgba(239,68,68,0.05)]" : ""
    } ${pulse ? "animate-[neon-pulse_2.5s_infinite_alternate]" : ""}`,
    
    red: `bg-graphite/80 border-cyber-red/30 ${
      glow ? "shadow-[0_0_20px_rgba(239,68,68,0.15),inset_0_0_10px_rgba(239,68,68,0.05)]" : ""
    } ${pulse ? "animate-[neon-pulse-red_2.5s_infinite_alternate]" : ""}`,
    
    dark: "bg-black/90 border-zinc-800 shadow-none",
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Optional grid background inside the card */}
      {grid && (
        <div 
          className={`absolute inset-0 pointer-events-none opacity-20 ${
            variant === "red" ? "cyber-grid-red" : "cyber-grid"
          }`} 
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
export default Card;

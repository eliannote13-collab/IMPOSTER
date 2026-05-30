import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  color: "red" | "cyan" | "amber";
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  bullets,
  icon: Icon,
  color,
}) => {
  const themeStyles = {
    red: {
      text: "text-cyber-red",
      border: "border-cyber-red/35 group-hover:border-cyber-red",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]",
      bg: "bg-cyber-red/5",
      bulletColor: "text-cyber-red",
    },
    cyan: {
      text: "text-cyan-400",
      border: "border-cyan-500/35 group-hover:border-cyan-400",
      glow: "shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]",
      bg: "bg-cyan-500/5",
      bulletColor: "text-cyan-400",
    },
    amber: {
      text: "text-amber-400",
      border: "border-amber-500/35 group-hover:border-amber-400",
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.15)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]",
      bg: "bg-amber-500/5",
      bulletColor: "text-amber-400",
    },
  };

  const currentTheme = themeStyles[color];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden rounded-xl border p-4 bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 group flex flex-col justify-between ${currentTheme.border} ${currentTheme.glow}`}
    >
      {/* Decorative inner corner lines */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-800 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-800 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-800 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-800 pointer-events-none" />

      {/* Grid Pattern inside the card (low opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-5 cyber-grid-red z-0" />

      <div className="relative z-10 flex flex-col gap-2">
        {/* Header Icon + Title */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-900">
          <div className={`p-2 rounded-lg ${currentTheme.bg}`}>
            <Icon size={18} className={`${currentTheme.text} animate-pulse`} />
          </div>
          <span className={`text-xs font-mono font-bold tracking-[0.2em] uppercase ${currentTheme.text}`}>
            {title}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed mt-1">
          {description}
        </p>

        {/* Detailed Bullets */}
        <ul className="flex flex-col gap-1.5 mt-2">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-500 font-mono">
              <span className={`text-[12px] font-bold ${currentTheme.bulletColor}`}>▪</span>
              <span className="leading-tight">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

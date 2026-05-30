import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glow?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  glow = true,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input_${Math.random().toString(36).substr(2, 5)}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left font-mono">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs uppercase tracking-widest text-zinc-400 font-bold select-none"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 bg-black/60 border rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none transition-all duration-300
            ${
              error
                ? "border-cyber-red focus:border-cyber-red/80 focus:ring-1 focus:ring-cyber-red shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "border-zinc-800 focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple/50 focus:bg-graphite/40"
            }
            ${
              glow && !error
                ? "focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        
        {/* Futuristic bottom accent line */}
        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyber-purple/40 to-transparent scale-x-0 transition-transform duration-300 origin-center input-accent" />
      </div>
      
      {error && (
        <span className="text-xs text-cyber-red mt-0.5 tracking-wide animate-pulse">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};
export default Input;

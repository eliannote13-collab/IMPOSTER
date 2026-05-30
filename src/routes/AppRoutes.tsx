import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Code splitting / Lazy loading for pages
const SplashPage = lazy(() => import("../pages/SplashPage"));
const PlayersPage = lazy(() => import("../pages/PlayersPage"));
const GameModePage = lazy(() => import("../pages/GameModePage"));
const TimePage = lazy(() => import("../pages/TimePage"));
const ThemeCodePage = lazy(() => import("../pages/ThemeCodePage"));
const RevealPage = lazy(() => import("../pages/RevealPage"));
const MatchPage = lazy(() => import("../pages/MatchPage"));
const VotingPage = lazy(() => import("../pages/VotingPage"));
const ResultPage = lazy(() => import("../pages/ResultPage"));

// Suspense fallbacks aligned with the cyber-interrogation theme
const CyberSpinner: React.FC = () => (
  <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center font-mono text-zinc-400 select-none">
    <div className="relative w-16 h-16 mb-4">
      {/* Outer spinning ring */}
      <div className="absolute inset-0 border-4 border-cyber-purple/20 border-t-cyber-purple rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.4)]" />
      {/* Inner counter-spinning ring */}
      <div className="absolute inset-2 border-4 border-cyber-red/20 border-b-cyber-red rounded-full animate-spin [animation-duration:1s] [animation-direction:reverse] shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
    </div>
    <span className="text-xs uppercase tracking-[0.2em] animate-pulse">
      CONECTANDO AO TERMINAL...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<CyberSpinner />}>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/mode" element={<GameModePage />} />
        <Route path="/time" element={<TimePage />} />
        <Route path="/theme" element={<ThemeCodePage />} />
        <Route path="/reveal" element={<RevealPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/voting" element={<VotingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;

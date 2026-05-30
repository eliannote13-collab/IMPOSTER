import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import storage from "../services/storage";
import { assignRoles } from "../utils/game/roleGenerator";
import { selectWord } from "../utils/game/wordSelector";
import { calculateVotes } from "../utils/game/voteCalculator";

export type MatchPhase = "SETUP" | "REVEAL" | "DISCUSSION" | "VOTING" | "RESULT";

export interface Player {
  id: string;
  name: string;
  avatar: string; // Neon avatar identifier
}

export interface SettingsState {
  players: Player[];
  gameMode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER";
  timerPreset: string; // '1m' | '3m' | '5m' | '10m' | 'custom'
  customMinutes: number;
  categoryCode: string; // Theme numeric code or 'random'
}

export interface MatchState {
  impostorId: string;
  leaderId: string | null;
  word: string;
  categoryName: string;
  clues: string[];
  votes: Record<string, string>; // voterId -> votedId
  winner: "IMPOSTER" | "VICTIM" | null;
  phase: MatchPhase;
  currentPlayerIndex: number;
  secondsRemaining: number;
  totalDuration: number;
  playedWords: string[];
}

export interface GameContextType {
  // Settings
  players: Player[];
  gameMode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER";
  timerPreset: string;
  customMinutes: number;
  categoryCode: string;
  
  // Match state
  impostorId: string;
  leaderId: string | null;
  word: string;
  categoryName: string;
  clues: string[];
  votes: Record<string, string>;
  winner: "IMPOSTER" | "VICTIM" | null;
  phase: MatchPhase;
  currentPlayerIndex: number;
  secondsRemaining: number;
  totalDuration: number;
  
  // Setters & Actions
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setGameMode: (mode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER") => void;
  setTimerPreset: (preset: string) => void;
  setCustomMinutes: (minutes: number) => void;
  setCategoryCode: (code: string) => void;
  
  // Game Flow Commands
  startMatch: () => void;
  nextReveal: () => void;
  startDiscussion: () => void;
  tickTimer: () => void;
  submitVote: (voterId: string, votedId: string) => void;
  finishVoting: () => void;
  resetMatch: () => void;
  restartSession: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

// Preset list of cyberpunk neon avatars
const AVATARS = [
  "🤖", "👾", "💀", "🧬", "🕸️", "🔮", "🔌", "🖲️", "💾", "📡", "🎭", "🕵️", "🕶️", "🦾", "🦿"
];

const INITIAL_SETTINGS: SettingsState = {
  players: [],
  gameMode: "SINGLE_IMPOSTER",
  timerPreset: "3m",
  customMinutes: 3,
  categoryCode: "random",
};

const INITIAL_MATCH: MatchState = {
  impostorId: "",
  leaderId: null,
  word: "",
  categoryName: "",
  clues: [],
  votes: {},
  winner: null,
  phase: "SETUP",
  currentPlayerIndex: 0,
  secondsRemaining: 180,
  totalDuration: 180,
  playedWords: [],
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings from localStorage if present
  const [settings, setSettings] = useState<SettingsState>(() => {
    const savedPlayers = storage.get<Player[]>("players", []);
    const savedMode = storage.get<"SINGLE_IMPOSTER" | "IMPOSTER_LEADER">("gameMode", "SINGLE_IMPOSTER");
    const savedPreset = storage.get<string>("timerPreset", "3m");
    const savedCustomMin = storage.get<number>("customMinutes", 3);
    const savedCategoryCode = storage.get<string>("categoryCode", "random");

    return {
      players: savedPlayers,
      gameMode: savedMode,
      timerPreset: savedPreset,
      customMinutes: savedCustomMin,
      categoryCode: savedCategoryCode,
    };
  });

  const [match, setMatch] = useState<MatchState>(INITIAL_MATCH);
  const [lastImpostorId, setLastImpostorId] = useState<string | null>(null);

  // Sync players list to LocalStorage on updates
  useEffect(() => {
    storage.set("players", settings.players);
  }, [settings.players]);

  // Actions
  const addPlayer = useCallback((name: string) => {
    if (settings.players.length >= 10) return;
    const cleanName = name.trim();
    if (!cleanName) return;

    setSettings((prev) => {
      // Pick random avatar not currently used if possible
      const usedAvatars = prev.players.map((p) => p.avatar);
      const available = AVATARS.filter((a) => !usedAvatars.includes(a));
      const avatar = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : AVATARS[Math.floor(Math.random() * AVATARS.length)];

      const newPlayer: Player = {
        id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: cleanName,
        avatar,
      };
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
  }, [settings.players.length]);

  const removePlayer = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
  }, []);

  const setGameMode = useCallback((gameMode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER") => {
    storage.set("gameMode", gameMode);
    setSettings((prev) => ({ ...prev, gameMode }));
  }, []);

  const setTimerPreset = useCallback((timerPreset: string) => {
    storage.set("timerPreset", timerPreset);
    setSettings((prev) => ({ ...prev, timerPreset }));
  }, []);

  const setCustomMinutes = useCallback((customMinutes: number) => {
    storage.set("customMinutes", customMinutes);
    setSettings((prev) => ({ ...prev, customMinutes }));
  }, []);

  const setCategoryCode = useCallback((categoryCode: string) => {
    storage.set("categoryCode", categoryCode);
    setSettings((prev) => ({ ...prev, categoryCode }));
  }, []);

  // Calculate timer duration based on settings
  const calculatedDuration = useMemo(() => {
    switch (settings.timerPreset) {
      case "1m": return 60;
      case "3m": return 180;
      case "5m": return 300;
      case "10m": return 600;
      case "custom": return settings.customMinutes * 60;
      default: return 180;
    }
  }, [settings.timerPreset, settings.customMinutes]);

  // Start a new match
  const startMatch = useCallback(() => {
    const { players, gameMode, categoryCode } = settings;
    if (players.length < 3) return;

    // 1. Assign Roles
    const roles = assignRoles(players.map(p => p.id), gameMode, lastImpostorId);
    
    let impostorId = "";
    let leaderId: string | null = null;
    
    Object.entries(roles).forEach(([pId, role]) => {
      if (role === "IMPOSTOR") impostorId = pId;
      if (role === "LEADER") leaderId = pId;
    });

    // Save for next round to prevent duplicate Imposter consecutively
    setLastImpostorId(impostorId);

    // 2. Select Category & Word
    const { category, word } = selectWord(categoryCode, match.playedWords);

    // 3. Initialize Match State
    setMatch((prev) => ({
      ...prev,
      impostorId,
      leaderId,
      word: word.word,
      categoryName: category.name,
      clues: word.hints,
      votes: {},
      winner: null,
      phase: "REVEAL",
      currentPlayerIndex: 0,
      secondsRemaining: calculatedDuration,
      totalDuration: calculatedDuration,
      playedWords: [...prev.playedWords, word.word],
    }));
  }, [settings, calculatedDuration, match.playedWords, lastImpostorId]);

  // Next player reveal
  const nextReveal = useCallback(() => {
    setMatch((prev) => {
      const nextIndex = prev.currentPlayerIndex + 1;
      if (nextIndex >= settings.players.length) {
        // All players revealed, proceed to discussion
        return {
          ...prev,
          phase: "DISCUSSION",
        };
      }
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
      };
    });
  }, [settings.players.length]);

  // Force start discussion directly
  const startDiscussion = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      phase: "DISCUSSION",
    }));
  }, []);

  const tickTimer = useCallback(() => {
    setMatch((prev) => {
      if (prev.secondsRemaining <= 0) {
        // Automatically go to Voting when timer runs out
        return {
          ...prev,
          secondsRemaining: 0,
          phase: "VOTING",
        };
      }
      return {
        ...prev,
        secondsRemaining: prev.secondsRemaining - 1,
      };
    });
  }, []);

  // Submit a player's vote
  const submitVote = useCallback((voterId: string, votedId: string) => {
    setMatch((prev) => {
      const newVotes = { ...prev.votes, [voterId]: votedId };
      return {
        ...prev,
        votes: newVotes,
      };
    });
  }, []);

  // Trigger result resolution
  const finishVoting = useCallback(() => {
    setMatch((prev) => {
      const result = calculateVotes(prev.votes, prev.impostorId);
      return {
        ...prev,
        winner: result.winner,
        phase: "RESULT",
      };
    });
  }, []);

  // Reset match to play again
  const resetMatch = useCallback(() => {
    setMatch((prev) => ({
      ...INITIAL_MATCH,
      playedWords: prev.playedWords, // Keep history of words to avoid repeat
    }));
  }, []);

  // Clear everything (useful to clear session / start over)
  const restartSession = useCallback(() => {
    storage.clear();
    setSettings(INITIAL_SETTINGS);
    setMatch(INITIAL_MATCH);
    setLastImpostorId(null);
  }, []);

  // Context value bundle memoized to avoid redundant renders
  const contextValue = useMemo<GameContextType>(() => ({
    // Settings
    players: settings.players,
    gameMode: settings.gameMode,
    timerPreset: settings.timerPreset,
    customMinutes: settings.customMinutes,
    categoryCode: settings.categoryCode,
    
    // Match state
    impostorId: match.impostorId,
    leaderId: match.leaderId,
    word: match.word,
    categoryName: match.categoryName,
    clues: match.clues,
    votes: match.votes,
    winner: match.winner,
    phase: match.phase,
    currentPlayerIndex: match.currentPlayerIndex,
    secondsRemaining: match.secondsRemaining,
    totalDuration: match.totalDuration,

    // Operations
    addPlayer,
    removePlayer,
    setGameMode,
    setTimerPreset,
    setCustomMinutes,
    setCategoryCode,
    startMatch,
    nextReveal,
    startDiscussion,
    tickTimer,
    submitVote,
    finishVoting,
    resetMatch,
    restartSession,
  }), [
    settings,
    match,
    addPlayer,
    removePlayer,
    setGameMode,
    setTimerPreset,
    setCustomMinutes,
    setCategoryCode,
    startMatch,
    nextReveal,
    startDiscussion,
    tickTimer,
    submitVote,
    finishVoting,
    resetMatch,
    restartSession
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
export default GameProvider;

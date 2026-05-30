import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

/**
 * Custom hook to consume the GameContext state and functions.
 * Must be used within a GameProvider.
 */
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame deve ser utilizado dentro de um GameProvider");
  }
  return context;
}
export default useGame;

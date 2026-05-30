export type GameRole = "IMPOSTOR" | "LEADER" | "VICTIM";

export interface RoleAssignment {
  [playerId: string]: GameRole;
}

/**
 * Randomly assigns roles to a list of player IDs based on the selected game mode.
 * @param playerIds Array of player IDs
 * @param mode "SINGLE_IMPOSTER" (1 Imposter, rest Victims) or "IMPOSTER_LEADER" (1 Imposter, 1 Leader, rest Victims)
 * @param lastImpostorId The ID of the imposter from the previous round to prevent repetition
 * @returns Map of playerId to GameRole
 */
export function assignRoles(
  playerIds: string[], 
  mode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER",
  lastImpostorId: string | null = null
): RoleAssignment {
  if (playerIds.length < 3) {
    throw new Error("Mínimo de 3 jogadores necessários para iniciar o jogo.");
  }

  // Shuffle player IDs using Fisher-Yates algorithm
  const shuffled = [...playerIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Prevent same Imposter consecutively by swapping with the next player
  if (lastImpostorId && shuffled[0] === lastImpostorId && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  const assignments: RoleAssignment = {};

  // First shuffled player is always the Imposter
  const imposterId = shuffled[0];
  assignments[imposterId] = "IMPOSTOR";

  let leaderId: string | null = null;
  if (mode === "IMPOSTER_LEADER" && shuffled.length >= 3) {
    // Second shuffled player is the Leader
    leaderId = shuffled[1];
    assignments[leaderId] = "LEADER";
  }

  // Everyone else is a Victim
  shuffled.forEach((id) => {
    if (id !== imposterId && id !== leaderId) {
      assignments[id] = "VICTIM";
    }
  });

  return assignments;
}

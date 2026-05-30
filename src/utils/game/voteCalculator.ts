export interface VoteTally {
  [playerId: string]: number;
}

export interface VoteResult {
  tally: VoteTally;
  accusedId: string | null; // Player who got the most votes (null if tie)
  isTie: boolean;
  winner: "IMPOSTER" | "VICTIM";
  imposterCaught: boolean;
}

/**
 * Tallies player votes and determines the outcome of the match.
 * @param votes Map of voterPlayerId to votedPlayerId
 * @param imposterId The ID of the imposter player
 * @returns VoteResult object
 */
export function calculateVotes(
  votes: { [voterId: string]: string },
  imposterId: string
): VoteResult {
  const tally: VoteTally = {};

  // Initialize tally for all voted players
  Object.values(votes).forEach((votedId) => {
    if (votedId) {
      tally[votedId] = (tally[votedId] || 0) + 1;
    }
  });

  let maxVotes = 0;
  let accusedId: string | null = null;
  let isTie = false;
  const candidates: string[] = [];

  Object.entries(tally).forEach(([playerId, voteCount]) => {
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      accusedId = playerId;
      isTie = false;
      candidates.length = 0; // Clear candidates
      candidates.push(playerId);
    } else if (voteCount === maxVotes) {
      isTie = true;
      candidates.push(playerId);
    }
  });

  // If there's a tie or no votes cast, the Imposter wins (survives)
  if (isTie || !accusedId || maxVotes === 0) {
    return {
      tally,
      accusedId: null,
      isTie: true,
      winner: "IMPOSTER",
      imposterCaught: false,
    };
  }

  // If the accused player is indeed the imposter, victims win. Otherwise imposter wins.
  const imposterCaught = accusedId === imposterId;
  const winner = imposterCaught ? "VICTIM" : "IMPOSTER";

  return {
    tally,
    accusedId,
    isTie: false,
    winner,
    imposterCaught,
  };
}

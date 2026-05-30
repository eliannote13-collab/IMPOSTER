/**
 * Firebase Config & Service Stub
 * Prepared for future online multiplayer, ranking, login, analytics, and private room support.
 * 
 * To connect to Firebase:
 * 1. Run `npm install firebase`
 * 2. Uncomment the initialization lines below
 * 3. Replace the configuration object with your project details
 */

/*
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "imposter-game.firebaseapp.com",
  projectId: "imposter-game",
  storageBucket: "imposter-game.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
*/

// STUBS & INTERFACES FOR FUTURE EXPANSION
export interface OnlineRoom {
  id: string;
  hostId: string;
  players: { id: string; name: string; avatar: string }[];
  status: "LOBBY" | "PLAYING" | "FINISHED";
  settings: {
    gameMode: "SINGLE_IMPOSTER" | "IMPOSTER_LEADER";
    timer: number;
    categoryCode: string;
  };
}

export const firebaseService = {
  // Authentication Stub
  loginAnonymously: async (displayName: string) => {
    console.log("Firebase Auth stub: logging in anonymously as", displayName);
    return { uid: `online_${Math.random().toString(36).substr(2, 9)}`, displayName };
  },

  // Database Room Stubs
  createPrivateRoom: async (host: { id: string; name: string }) => {
    console.log("Firebase DB stub: Creating room for host", host.name);
    const mockRoomId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    return { roomId: mockRoomId };
  },

  joinPrivateRoom: async (roomId: string, player: { id: string; name: string }) => {
    console.log("Firebase DB stub: Joining room", roomId, "as player", player.name);
    return { success: true };
  },

  updateMatchState: async (roomId: string, matchState: any) => {
    console.log("Firebase DB stub: Updating match state in room", roomId, matchState);
  },

  // Analytics Stub
  logEvent: (eventName: string, params?: Record<string, any>) => {
    console.log("Firebase Analytics stub: Logged event", eventName, params);
  }
};

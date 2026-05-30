const PREFIX = "imposter_";

export const storage = {
  /**
   * Retrieves an item from localStorage and parses it.
   * @param key Key name without prefix
   * @param fallback Default value if not found or on error
   */
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(`${PREFIX}${key}`);
      if (value === null) return fallback;
      return JSON.parse(value) as T;
    } catch (e) {
      console.warn(`LocalStorage retrieve failed for key "${key}":`, e);
      return fallback;
    }
  },

  /**
   * Saves an item to localStorage.
   * @param key Key name without prefix
   * @param value Data to serialize
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorage save failed for key "${key}":`, e);
    }
  },

  /**
   * Removes an item from localStorage.
   * @param key Key name without prefix
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
    } catch (e) {
      console.warn(`LocalStorage remove failed for key "${key}":`, e);
    }
  },

  /**
   * Clears all localStorage items belonging to the game.
   */
  clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("LocalStorage clear failed:", e);
    }
  },
};
export default storage;

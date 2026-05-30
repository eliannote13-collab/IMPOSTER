import { categories } from "../../data/categories";
import type { Category, GameWord } from "../../data/categories";

interface SelectionResult {
  category: Category;
  word: GameWord;
}

/**
 * Validates if a category code exists.
 * @param code Theme numeric code
 */
export function validateCategoryCode(code: string): Category | null {
  const normalized = code.trim();
  const match = categories.find((cat) => cat.code === normalized);
  return match || null;
}

/**
 * Selects a word and category based on theme code (or random) and filters out played words.
 * @param themeCode Numeric theme code or "random"
 * @param playedWords Set or array of words that were already used in this session
 */
export function selectWord(
  themeCode: string,
  playedWords: string[] = []
): SelectionResult {
  let selectedCategory: Category;

  if (themeCode && themeCode.toLowerCase() !== "random") {
    const matched = validateCategoryCode(themeCode);
    if (!matched) {
      // Fallback to random if code is invalid
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    } else {
      selectedCategory = matched;
    }
  } else {
    // Select completely random category
    selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  }

  // Filter out played words if possible
  let availableWords = selectedCategory.words.filter(
    (item) => !playedWords.includes(item.word)
  );

  // If all words have been played, reset and make all words available
  if (availableWords.length === 0) {
    availableWords = selectedCategory.words;
  }

  const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];

  return {
    category: selectedCategory,
    word: selectedWord,
  };
}

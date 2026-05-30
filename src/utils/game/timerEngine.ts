/**
 * Formats a duration in seconds into a string MM:SS.
 * @param totalSeconds Number of seconds
 */
export function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");
  
  return `${minutesStr}:${secondsStr}`;
}

/**
 * Converts standard preset choices to seconds
 * @param preset Option selected by the user
 * @param customMinutes Custom minutes input if "custom"
 */
export function getSecondsFromPreset(preset: string, customMinutes: number = 1): number {
  switch (preset) {
    case "1m":
      return 60;
    case "3m":
      return 180;
    case "5m":
      return 300;
    case "10m":
      return 600;
    case "custom":
      return Math.max(1, customMinutes) * 60;
    default:
      return 180; // Default to 3 minutes
  }
}

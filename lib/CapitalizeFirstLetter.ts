export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  const lowerStr = str.toLowerCase();
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
};

/**
 * Generates a random room ID similar to Google Meet format
 * @param length The total length of the room ID (excluding hyphens)
 * @param addHyphens Whether to add hyphens after every 3 characters
 * @returns A random room ID string
 */
export const generateRoomId = (
  length: number = 10,
  addHyphens: boolean = true
): string => {
  // Characters to use (Google Meet uses mostly lowercase letters)
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  // Generate the random string
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);

    // Add hyphens after every 3 characters (except at the end)
    if (addHyphens && (i + 1) % 3 === 0 && i < length - 1) {
      result += "-";
    }
  }

  return result;
};

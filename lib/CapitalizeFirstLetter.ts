export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  const lowerStr = str.toLowerCase();
  return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1);
};

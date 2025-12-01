// Truncate string to limit displayed character
export const truncateString = (string, charLimit = 15) =>
  string.length > charLimit ? string.slice(0, charLimit) + "..." : string;

//
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

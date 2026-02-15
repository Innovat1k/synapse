export const getDeterministicOffset = (str, maxOffset = 15) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return (hash % (maxOffset * 2)) - maxOffset;
};

export const getLinkCurvature = (sourceId, targetId) => {
  const combined = sourceId + targetId;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 1.0 + (hash % 40) / 100;
};

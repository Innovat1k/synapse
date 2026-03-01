import { useState, useEffect, useCallback, useMemo } from "react";

// Tracks skill completion with prerequisite validation and localStorage persistence.
// A skill becomes "available" only when all its dependencies are completed.

export const useSkillProgress = (initialNodes = [], links = [], storageKey) => {
  // Ensure inputs are always valid arrays
  const safeNodes = useMemo(
    () => (Array.isArray(initialNodes) ? initialNodes : []),
    [initialNodes],
  );

  const safeLinks = useMemo(() => (Array.isArray(links) ? links : []), [links]);

  // Validate storage key before using localStorage
  const hasStorage = typeof storageKey === "string" && storageKey.length > 0;

  const [progress, setProgress] = useState(() => {
    if (!hasStorage) {return {};}

    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Compute dynamic status for each node (always returns a valid array)
  const nodesWithStatus = safeNodes.map((node) => {
    const savedStatus = progress[node.id];

    if (savedStatus === "completed") {
      return { ...node, status: "completed" };
    }

    // Get prerequisite skill IDs (incoming links)
    const prerequisites = safeLinks
      .filter((link) => link.target === node.id)
      .map((link) => link.source);

    if (prerequisites.length === 0) {
      return { ...node, status: "available" };
    }

    const allPrereqsCompleted = prerequisites.every(
      (prereqId) => progress[prereqId] === "completed",
    );

    return {
      ...node,
      status: allPrereqsCompleted ? "available" : "locked",
    };
  });

  // Persist progress changes to localStorage
  useEffect(() => {
    if (!hasStorage) {return;}

    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      return;
    }
  }, [progress, storageKey, hasStorage]);

  // Mark a skill as completed if all prerequisites are satisfied
  const completeSkill = useCallback(
    (skillId) => {
      setProgress((prev) => {
        if (prev[skillId] === "completed") {return prev;}

        const prerequisites = safeLinks
          .filter((link) => link.target === skillId)
          .map((link) => link.source);

        const allPrereqsCompleted = prerequisites.every(
          (prereqId) => prev[prereqId] === "completed",
        );

        if (!allPrereqsCompleted) {return prev;}

        return {
          ...prev,
          [skillId]: "completed",
        };
      });
    },
    [safeLinks],
  );

  return {
    nodesWithStatus,
    completeSkill,
  };
};

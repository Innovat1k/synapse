import { useState, useEffect, useCallback } from "react";

// Tracks skill completion progress with prerequisite validation and localStorage persistence.
// Skills are "available" only when all dependencies are completed; status updates auto-save to storage.

export const useSkillProgress = (initialNodes, links, storageKey) => {
  // Local state with persistence
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });

  // Compute dynamic status for each node
  const nodesWithStatus = initialNodes.map((node) => {
    const savedStatus = progress[node.id];

    if (savedStatus === "completed") {
      return { ...node, status: "completed" };
    }

    // Get all prerequisites (incoming links)
    const prerequisites = links
      .filter((link) => link.target === node.id)
      .map((link) => link.source);

    if (prerequisites.length === 0) {
      return { ...node, status: "available" };
    }

    // Check if all prerequisites are completed
    const allPrereqsCompleted = prerequisites.every(
      (prereqId) => progress[prereqId] === "completed",
    );

    return {
      ...node,
      status: allPrereqsCompleted ? "available" : "locked",
    };
  });

  // Persist progress in localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  // Toggle skill completion status
  const completeSkill = useCallback(
    (skillId) => {
      setProgress((prev) => {
        if (prev[skillId] === "completed") return prev;

        const prerequisites = links
          .filter((link) => link.target === skillId)
          .map((link) => link.source);

        const allPrereqsCompleted = prerequisites.every(
          (prereqId) => prev[prereqId] === "completed",
        );

        if (!allPrereqsCompleted) return prev;

        return {
          ...prev,
          [skillId]: "completed",
        };
      });
    },
    [links],
  );

  return { nodesWithStatus, completeSkill };
};

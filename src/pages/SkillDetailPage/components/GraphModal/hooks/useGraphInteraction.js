import { useEffect, useMemo, useState } from "react";
import { useSkillProgress } from "./useSkillProgress";

// Orchestrates graph interactions: hover/tap handling, mouse tracking (desktop), and skill completion.
// Adapts behavior between mobile (tap-to-toggle) and desktop (hover + click-to-complete).

export const useGraphInteraction = ({
  centerSkillId,
  nodes = [],
  links = [],
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Detect screen size changes to determine mobile mode
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track mouse position (desktop only)
  const handleMouseMove = (e) => {
    if (!isMobile) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Manage skill progress using local storage
  const storageKey = `skill-progress-${centerSkillId}`;
  const { nodesWithStatus = [], completeSkill } = useSkillProgress(
    nodes,
    links,
    storageKey,
  );

  // Memoized reference to the currently hovered node
  const hoveredNode = useMemo(() => {
    return nodesWithStatus.find((n) => n.id === hoveredNodeId);
  }, [nodesWithStatus, hoveredNodeId]);

  // Handle hover (desktop) or tap toggle (mobile)
  const handleNodeInteraction = (nodeId, isCenter) => {
    if (isCenter) return;

    if (isMobile) {
      setHoveredNodeId((prev) => (prev === nodeId ? null : nodeId));
    } else {
      setHoveredNodeId(nodeId);
    }
  };

  // Complete skill on click (desktop only if available)
  const handleNodeClick = (nodeId, status) => {
    if (!isMobile && status === "available") {
      completeSkill(nodeId);
    }
  };

  return {
    isMobile,
    state: { hoveredNodeId, hoveredNode, nodesWithStatus, mousePos },
    methods: {
      setHoveredNode: setHoveredNodeId,
      handleMouseMove,
      handleNodeInteraction,
      handleNodeClick,
      completeSkill,
    },
  };
};

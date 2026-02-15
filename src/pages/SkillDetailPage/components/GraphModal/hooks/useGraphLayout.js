import { useMemo } from "react";
import { getDeterministicOffset } from "../utils/graphUtils";

/**
 * Calculates graph layout, relationships, and adaptive config.
 * @param {Object} params
 * @param {string} params.centerSkillId - ID of the central skill
 * @param {Array} params.nodes - All skill nodes
 * @param {Array} params.links - All skill links
 * @param {boolean} params.isMobile - Whether viewport is mobile-sized
 * @returns {Object} Layout data and relationship sets
 */
export const useGraphLayout = ({
  centerSkillId,
  nodes = [],
  links = [],
  isMobile,
}) => {
  const centerNode = nodes.find((n) => n.id === centerSkillId);

  // Calculate relationship types: prerequisites, unlocks, mutual dependencies
  const { mutualSkills, incoming, outgoing } = useMemo(() => {
    if (!centerNode) {
      return {
        mutualSkills: new Set(),
        incoming: new Set(),
        outgoing: new Set(),
      };
    }

    const incomingSet = new Set();
    const outgoingSet = new Set();

    links.forEach((link) => {
      if (link.target === centerSkillId) incomingSet.add(link.source);
      if (link.source === centerSkillId) outgoingSet.add(link.target);
    });

    const mutual = new Set();
    incomingSet.forEach((id) => {
      if (outgoingSet.has(id)) mutual.add(id);
    });

    return {
      mutualSkills: mutual,
      incoming: incomingSet,
      outgoing: outgoingSet,
    };
  }, [centerSkillId, links, centerNode]);

  // Adaptive configuration for mobile vs desktop
  const config = useMemo(() => {
    if (isMobile) {
      return {
        viewBox: "0 0 500 750",
        centerX: 250,
        centerY: 375,
        radius: 180,
        centerSize: 64,
        nodeSize: 48,
        fontSize: "18px",
        legendSize: "text-[11px]",
        legendTop: "12px",
        tooltipBottom: "20px",
        markerRefX: 34,
      };
    }
    return {
      viewBox: "-50 -50 900 600",
      centerX: 400,
      centerY: 250,
      radius: 220,
      centerSize: 54,
      nodeSize: 38,
      fontSize: "11px",
      legendSize: "text-[9px]",
      legendTop: "16px",
      tooltipBottom: "24px",
      markerRefX: 28,
    };
  }, [isMobile]);

  // Calculate node positions
  const layout = useMemo(() => {
    if (!centerNode) return null;
    const { centerX, centerY, radius } = config;
    const nodePositions = new Map();

    nodePositions.set(centerSkillId, {
      x: centerX,
      y: centerY,
      type: "center",
    });

    const setupPositions = (ids, side) => {
      const idList = Array.from(ids);
      const total = idList.length;
      const angleRange = isMobile ? Math.PI / 1.1 : Math.PI / 1.5;

      idList.forEach((id, i) => {
        const baseAngle =
          total === 1 ? 0 : (i / (total - 1)) * angleRange - angleRange / 2;
        let x =
          centerX + (side === "left" ? -radius : radius) * Math.cos(baseAngle);
        let y = centerY + radius * Math.sin(baseAngle);

        x += getDeterministicOffset(id, isMobile ? 8 : 20);
        y += getDeterministicOffset(id + "-y", isMobile ? 12 : 15);

        nodePositions.set(id, {
          x,
          y,
          type: side === "left" ? "prerequisite" : "unlock",
        });
      });
    };

    setupPositions(incoming, "left");
    setupPositions(outgoing, "right");
    return { nodePositions };
  }, [centerSkillId, incoming, outgoing, config, isMobile, centerNode]);

  return {
    nodePositions: layout?.nodePositions || null,
    mutualSkills,
    incoming,
    outgoing,
    config,
  };
};

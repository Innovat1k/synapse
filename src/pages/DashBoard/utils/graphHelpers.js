const EDGE_COLORS = {
  prerequisite: "#f59e0b",
  unlock: "#22d3ee",
  mutual: "#6366f1",
  locked: "#475569",
};

export const getEdgeConfig = (link, sourceNode) => {
  const { source_skill_id, target_skill_id, type } = link;
  const isLocked = sourceNode?.status === "locked";
  const level = sourceNode?.level || 0;

  let strokeColor = EDGE_COLORS[type] || EDGE_COLORS.unlock;
  if (type === "mutual") {strokeColor = EDGE_COLORS.mutual;}
  else if (isLocked) {strokeColor = EDGE_COLORS.locked;}

  const isAnimated = !isLocked && level > 0;

  return {
    id: `e-${source_skill_id}-${target_skill_id}`,
    source: String(source_skill_id),
    target: String(target_skill_id),
    type: "default",
    animated: isAnimated,
    style: {
      stroke: strokeColor,
      strokeWidth: type === "mutual" ? "3.5px" : "2.5px",
      opacity: isLocked ? 0.3 : 0.8,
      filter: isAnimated ? `drop-shadow(0 0 8px ${strokeColor}aa)` : "none",
      transition: "all 0.5s ease",
    },
    markerEnd: {
      type: "arrowclosed",
      color: strokeColor,
      width: 12,
      height: 12,
    },
    curvature: type === "mutual" ? 0.6 : 0.3,
  };
};

const positionNodesByLevelAndTrack = (nodes) => {
  if (nodes.length === 0) {return nodes;}

  const tracksMap = new Map();
  nodes.forEach((n) => {
    const tid = n.data.trackId || "default";
    if (!tracksMap.has(tid)) {tracksMap.set(tid, []);}
    tracksMap.get(tid).push(n);
  });

  const positioned = [];
  const TRACK_WIDTH = 520;
  const LEVEL_HEIGHT = 290;
  const NODE_SPACING = 210;

  let currentTrackX = 0;

  tracksMap.forEach((nodeList) => {
    const levels = {};
    nodeList.forEach((n) => {
      const lvl = n.data.level;
      if (!levels[lvl]) {levels[lvl] = [];}
      levels[lvl].push(n);
    });

    Object.keys(levels).forEach((lvlStr) => {
      const lvl = Number(lvlStr);
      const nodesAtLvl = levels[lvl];
      const startX =
        currentTrackX - ((nodesAtLvl.length - 1) * NODE_SPACING) / 2;

      nodesAtLvl.forEach((node, i) => {
        const angle = (i * 1.3) % (2 * Math.PI);
        const spiralOffset = Math.sqrt(i) * 25;
        const offsetX = Math.cos(angle) * spiralOffset;
        const offsetY = Math.sin(angle) * spiralOffset;

        positioned.push({
          ...node,
          position: {
            x: startX + i * NODE_SPACING + offsetX,
            y: -(lvl * LEVEL_HEIGHT) + offsetY,
          },
        });
      });
    });

    currentTrackX += TRACK_WIDTH;
  });

  return positioned;
};

export const transformSkillsToGraphData = (skills = [], links = []) => {
  const skillsMap = new Map(skills.map((s) => [String(s.skill_id), s]));

  const nodes = skills.map((skill) => ({
    id: String(skill.skill_id),
    type: "skillNode",
    data: {
      label: skill.name,
      level: skill.level,
      category: skill.category,
      trackId: skill.track_id,
      status: skill.status || "available",
    },
    position: { x: 0, y: 0 },
  }));

  const edges = links.map((link) =>
    getEdgeConfig(link, skillsMap.get(String(link.source_skill_id))),
  );

  return {
    nodes: positionNodesByLevelAndTrack(nodes),
    edges,
  };
};

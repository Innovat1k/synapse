import { useTooltipPosition } from "./hooks/useTooltipPosition";
import { GraphTooltip } from "./components/GraphTooltip";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { getLinkCurvature } from "./utils/graphUtils";
import { GraphNavigator } from "./components/GraphNavigator/GraphNavigator";
import { useGraphInteraction } from "./hooks/useGraphInteraction";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * Knowledge Graph View
 * - Teal: current skill (center)
 * - Amber: prerequisite
 * - Cyan: unlock
 * - Indigo: mutual dependency with center
 */
export const GraphView = ({ centerSkillId, nodes = [], links = [] }) => {
  const { isMobile, state, methods } = useGraphInteraction({
    centerSkillId,
    nodes,
    links,
  });

  // Compute node positions and relationships
  const { nodePositions, mutualSkills, incoming, config } = useGraphLayout({
    centerSkillId,
    nodes,
    links,
    isMobile,
  });

  // Tooltip visibility for hovered node
  const { visible } = useTooltipPosition(state.hoveredNodeId);

  if (!nodePositions) return null;

  return (
    <div
      data-testid="graph-container"
      className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden rounded-xl border border-slate-800 shadow-inner"
      onMouseMove={methods.handleMouseMove}
      onClick={() => isMobile && methods.setHoveredNode(null)}
    >
      {/* Legend */}
      <div
        data-testid="graph-legend"
        className={`absolute left-4 flex gap-3 pointer-events-none z-10 ${isMobile ? "flex-col" : "flex-row"}`}
        style={{ top: config.legendTop }}
      >
        {[
          {
            color: "bg-amber-500",
            shadow: "#f59e0b",
            label: "Base Req",
            "data-testid": "legend-amber",
          },
          {
            color: "bg-indigo-500",
            shadow: "#6366f1",
            label: "Mutual Link",
            "data-testid": "legend-indigo",
          },
          {
            color: "bg-cyan-400",
            shadow: "#22d3ee",
            label: "Unlocks",
            "data-testid": "legend-cyan",
          },
        ].map((item) => (
          <div
            key={item.label}
            data-testid={item["data-testid"]}
            className="flex items-center gap-1.5"
          >
            <div
              className={`w-2 h-2 rounded-full ${item.color}`}
              style={{ boxShadow: `0 0 6px ${item.shadow}` }}
            />
            <span
              className={`${config.legendSize} uppercase tracking-widest text-slate-500 font-bold`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Zoomable Graph */}
      <div className="absolute inset-0 overflow-hidden">
        <GraphNavigator nodeCount={nodes.length}>
          <svg
            width="100%"
            height="100%"
            viewBox={config.viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
            style={{
              transformOrigin: "center",
              shapeRendering: "geometricPrecision",
            }}
          >
            {/* Arrow marker definitions */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur
                  stdDeviation={isMobile ? "4" : "3"}
                  result="blur"
                />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {["amber", "cyan", "indigo"].map((color) => (
                <marker
                  key={color}
                  id={`arrow-${color}`}
                  viewBox="0 0 10 10"
                  refX={config.markerRefX}
                  refY="5"
                  markerWidth={isMobile ? "5" : "4"}
                  markerHeight={isMobile ? "5" : "4"}
                  orient="auto"
                >
                  <path
                    d="M 0 0 L 10 5 L 0 10 Z"
                    fill={
                      color === "amber"
                        ? "#f59e0b"
                        : color === "indigo"
                          ? "#6366f1"
                          : "#22d3ee"
                    }
                  />
                </marker>
              ))}
            </defs>

            {/* Curved links */}
            {links.map((link) => {
              const s = nodePositions.get(link.source);
              const t = nodePositions.get(link.target);
              if (!s || !t) return null;

              const sourceNode = state.nodesWithStatus.find(
                (n) => n.id === link.source,
              );
              const isSourceCompleted = sourceNode?.status === "completed";
              const isPrereq = link.target === centerSkillId;
              const isActive =
                state.hoveredNodeId === link.source ||
                state.hoveredNodeId === link.target;

              const dr =
                Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2)) *
                getLinkCurvature(link.source, link.target);

              const color = isPrereq ? "#f59e0b" : "#22d3ee";

              return (
                <g key={`link-group-${link.source}-${link.target}`}>
                  <path
                    d={`M${s.x},${s.y} A${dr},${dr} 0 0,1 ${t.x},${t.y}`}
                    stroke={color}
                    strokeWidth={isMobile ? "1" : "0.8"}
                    fill="none"
                    opacity={0.2}
                  />

                  <motion.path
                    d={`M${s.x},${s.y} A${dr},${dr} 0 0,1 ${t.x},${t.y}`}
                    stroke={color}
                    strokeWidth={
                      isActive
                        ? isMobile
                          ? "3"
                          : "2.5"
                        : isMobile
                          ? "1.5"
                          : "1.2"
                    }
                    fill="none"
                    strokeLinecap="round"
                    filter={isSourceCompleted || isActive ? "url(#glow)" : ""}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isSourceCompleted || isActive ? 0.8 : 0.15,
                    }}
                    transition={{ opacity: { duration: 0.5 } }}
                    markerEnd={`url(#arrow-${isPrereq ? "amber" : "cyan"})`}
                    className="transition-all"
                  />
                </g>
              );
            })}

            {/* Skill nodes */}
            {state.nodesWithStatus.map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;

              const isCenter = node.id === centerSkillId;
              const isHovered = state.hoveredNodeId === node.id;
              const size = isCenter ? config.centerSize : config.nodeSize;

              let ringColor = isCenter
                ? "#2dd4bf"
                : mutualSkills.has(node.id)
                  ? "#6366f1"
                  : incoming.has(node.id)
                    ? "#f59e0b"
                    : "#22d3ee";

              const opacity = node.status === "locked" ? 0.65 : 1;
              const isCompleted = node.status === "completed";

              return (
                <motion.g
                  key={`node-${node.id}`}
                  data-testid={`graph-node-${node.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity,
                    x: pos.x,
                    y: pos.y,
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="cursor-pointer"
                  onHoverStart={
                    !isMobile
                      ? () => methods.setHoveredNode(node.id)
                      : undefined
                  }
                  onHoverEnd={
                    !isMobile ? () => methods.setHoveredNode(null) : undefined
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile) {
                      methods.handleNodeInteraction(node.id, isCenter);
                    } else {
                      methods.handleNodeClick(node.id, node.status);
                    }
                  }}
                >
                  <circle
                    r={size * (isMobile ? 1.3 : 1.1)}
                    fill="transparent"
                  />
                  <circle
                    r={size / 2}
                    fill="#0f172a"
                    stroke={ringColor}
                    strokeWidth={isCenter || isHovered ? "3" : "2"}
                    strokeDasharray={node.status === "locked" ? "4 3" : "0"}
                    filter={isHovered || isCenter ? "url(#glow)" : ""}
                    className="transition-all"
                  />
                  {isCompleted && (
                    <path
                      d="M-5 0 L-1 4 L6 -4"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}
                  <text
                    y={size / 2 + (isMobile ? 26 : 20)}
                    textAnchor="middle"
                    fill={
                      isCenter || isHovered
                        ? "#f8fafc"
                        : node.status === "locked"
                          ? "#475569"
                          : "#94a3b8"
                    }
                    className="font-bold select-none pointer-events-none"
                    fontSize={config.fontSize}
                    dominantBaseline="middle"
                  >
                    {node.label?.length > (isMobile ? 11 : 14)
                      ? `${node.label.substring(0, isMobile ? 9 : 12)}...`
                      : node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </GraphNavigator>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {visible && state.hoveredNode && (
          <GraphTooltip
            key="skill-tooltip"
            node={state.hoveredNode}
            isMobile={isMobile}
            mutualSkills={mutualSkills}
            incoming={incoming}
            config={config}
            onComplete={isMobile ? methods.completeSkill : undefined}
            mousePos={state.mousePos}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

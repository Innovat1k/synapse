import { useTooltipPosition } from "./hooks/useTooltipPosition";
import { GraphTooltip } from "./components/GraphTooltip";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { getLinkCurvature } from "./utils/graphUtils";
import { GraphNavigator } from "./components/GraphNavigator/GraphNavigator";
import { useGraphInteraction } from "./hooks/useGraphInteraction";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const GraphView = ({ centerSkillId, nodes = [], links = [] }) => {
  const { isMobile, state, methods } = useGraphInteraction({
    centerSkillId,
    nodes,
    links,
  });

  const { nodePositions, mutualSkills, incoming, config } = useGraphLayout({
    centerSkillId,
    nodes,
    links,
    isMobile,
  });

  const { visible } = useTooltipPosition(state.hoveredNodeId);

  if (!nodePositions) return null;

  return (
    <div
      data-testid="graph-container"
      className="relative w-full h-full"
      onMouseMove={methods.handleMouseMove}
      onClick={() => isMobile && methods.setHoveredNode(null)}
    >
      <div data-testid="graph-legend" className="absolute left-6 flex gap-4">
        {["amber", "indigo", "cyan"].map((color) => (
          <div key={color} data-testid={`legend-${color}`} />
        ))}
      </div>

      <GraphNavigator nodeCount={nodes.length}>
        <svg viewBox={config.viewBox}>
          {state.nodesWithStatus.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const isCenter = node.id === centerSkillId;

            const role = isCenter
              ? "center"
              : mutualSkills.has(node.id)
                ? "mutual"
                : incoming.has(node.id)
                  ? "prerequisite"
                  : "unlock";

            const isCompleted = node.status === "completed";

            return (
              <motion.g
                key={node.id}
                data-testid={`graph-node-${node.id}`}
                onClick={(e) => {
                  e.stopPropagation();

                  if (isMobile) {
                    methods.handleNodeInteraction(
                      node.id,
                      node.id === centerSkillId,
                    );
                  } else {
                    methods.handleNodeClick(node.id, node.status);
                  }
                }}
              >
                <circle
                  data-testid={`node-circle-${node.id}`}
                  data-role={role}
                  cx={pos.x}
                  cy={pos.y}
                  r={20}
                />

                {isCompleted && (
                  <path
                    data-testid={`check-${node.id}`}
                    d="M-5 0 L-1 4 L6 -4"
                  />
                )}

                <text>{node.label}</text>
              </motion.g>
            );
          })}
        </svg>
      </GraphNavigator>

      <AnimatePresence>
        {visible && state.hoveredNode && (
          <GraphTooltip
            data-testid="graph-tooltip"
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

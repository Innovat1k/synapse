import { ReactFlow, Background, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SkillNode } from "../SkillNode";
import { useGraphData } from "./hooks/useGraphData";
import { useGraphState } from "./hooks/useGraphState";
import { CustomControls } from "./CustomControls";

const nodeTypes = { skillNode: SkillNode };

export const GraphContent = ({ skills, links, isCompact, selectors }) => {
  const { nodes: initialNodes, edges: initialEdges } = useGraphData(
    skills,
    links,
  );
  const { nodes, edges, handleNodesChange, onEdgesChange } = useGraphState(
    initialNodes,
    initialEdges,
  );

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.1}
        maxZoom={2}
      >
        <Background
          color="#06b6d4"
          gap={28}
          size={1}
          variant="dots"
          opacity={0.08}
        />

        {!isCompact && (
          <Panel position="bottom-left">
            <CustomControls />
          </Panel>
        )}

        {!isCompact && selectors && (
          <Panel position="top-center">{selectors}</Panel>
        )}
      </ReactFlow>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
    </div>
  );
};

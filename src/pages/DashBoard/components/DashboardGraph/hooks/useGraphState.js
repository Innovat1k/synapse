import {
  useNodesState,
  useEdgesState,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

// Manages xyflow graph state with position persistence: preserves node positions when data updates.
// Exposes controlled handlers for node/edge changes with internal update coordination.
export const useGraphState = (initialNodes, initialEdges) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const updateNodeInternals = useUpdateNodeInternals();

  // Sync nodes positions
  useEffect(() => {
    setNodes((current) =>
      initialNodes.map((newNode) => {
        const existing = current.find((n) => n.id === newNode.id);
        return existing ? { ...newNode, position: existing.position } : newNode;
      }),
    );
  }, [initialNodes, setNodes]);

  // Sync edges
  useEffect(() => setEdges(initialEdges), [initialEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === "position" && change.dragging) {
          updateNodeInternals(change.id);
        }
      });
    },
    [onNodesChange, updateNodeInternals],
  );

  return { nodes, edges, onEdgesChange, handleNodesChange };
};

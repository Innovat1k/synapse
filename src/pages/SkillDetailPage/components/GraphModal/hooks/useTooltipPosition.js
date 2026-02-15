// hooks/useTooltipPosition.js
import { useState, useEffect } from "react";

/**
 * Simple hook to manage tooltip visibility based on hovered node ID.
 * Returns { visible: boolean }
 */
export const useTooltipPosition = (hoveredNodeId) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!hoveredNodeId);
  }, [hoveredNodeId]);

  return { visible };
};

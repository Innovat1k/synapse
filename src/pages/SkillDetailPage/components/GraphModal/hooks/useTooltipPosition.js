import { useState, useEffect } from "react";

// Derives tooltip visibility from a hovered node ID (visible when ID is truthy)
export const useTooltipPosition = (hoveredNodeId) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!hoveredNodeId);
  }, [hoveredNodeId]);

  return { visible };
};

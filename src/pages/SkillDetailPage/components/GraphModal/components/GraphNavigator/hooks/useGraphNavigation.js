import { useRef, useState } from "react";

export const useGraphNavigation = (nodeCount = 10) => {
  const transformRef = useRef(null);
  const [, setTick] = useState(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Set min/max zoom based on node count
  const minScale = nodeCount <= 5 ? 0.8 : 0.5;
  const maxScale = 2;

  // Force re-render to update control button states
  const forceRender = () => setTick((t) => t + 1);

  const handleZoomIn = () => {
    transformRef.current?.zoomIn();
    forceRender();
  };

  // Zoom / reset actions
  const handleZoomOut = () => {
    transformRef.current?.zoomOut();
    forceRender();
  };

  const handleReset = () => {
    transformRef.current?.resetTransform();
    forceRender();
  };

  // Get current transform state from instance
  const transformState = transformRef.current?.instance?.transformState || {
    scale: 1,
    positionX: 0,
    positionY: 0,
  };

  const { scale, positionX, positionY } = transformState;

  // Determine which controls should be disabled
  const isZoomInDisabled = scale >= maxScale - 0.0001;
  const isZoomOutDisabled = scale <= minScale + 0.0001;
  const isResetDisabled =
    Math.abs(scale - 1) < 0.001 &&
    Math.abs(positionX) < 1 &&
    Math.abs(positionY) < 1;

  return {
    transformRef,
    config: { isMobile, minScale, maxScale },
    disabled: { isZoomInDisabled, isZoomOutDisabled, isResetDisabled },
    methods: {
      onTransformed: forceRender,
      handleZoomIn,
      handleZoomOut,
      handleReset,
    },
  };
};

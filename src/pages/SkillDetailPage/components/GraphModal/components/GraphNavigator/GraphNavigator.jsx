import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { GraphControls } from "./GraphControls";
import { useGraphNavigation } from "./hooks/useGraphNavigation";

export const GraphNavigator = ({ children, nodeCount = 10 }) => {
  const { transformRef, config, methods, disabled } =
    useGraphNavigation(nodeCount);

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={config.minScale}
      maxScale={config.maxScale}
      panning={{ velocityDisabled: true }}
      wheel={{ step: 0.1 }}
      doubleClick={{ disabled: true }}
      alignmentAnimation={{ disabled: true }}
      centerOnInit
      className="w-full h-full"
      onTransformed={methods.onTransformed}
    >
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
        contentStyle={{ width: "100%", height: "100%", display: "block" }}
      >
        {children}
      </TransformComponent>

      <GraphControls
        onZoomIn={methods.handleZoomIn}
        onZoomOut={methods.handleZoomOut}
        onReset={methods.handleReset}
        isMobile={config.isMobile}
        isZoomInDisabled={disabled.isZoomInDisabled}
        isZoomOutDisabled={disabled.isZoomOutDisabled}
        isResetDisabled={disabled.isResetDisabled}
      />
    </TransformWrapper>
  );
};

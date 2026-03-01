import { renderHook } from "@testing-library/react";
import { useGraphNavigation } from "./useGraphNavigation";
import { setWindowWidth } from "@shared/utils/utils";

describe("useGraphNavigation", () => {
  beforeEach(() => {
    setWindowWidth(1200);
  });

  describe("config", () => {
    it("uses minScale=0.8 for small graphs (<=5 nodes)", () => {
      const { result } = renderHook(() => useGraphNavigation(3));
      expect(result.current.config.minScale).toBe(0.8);
    });

    it("uses minScale=0.5 for large graphs (>5 nodes)", () => {
      const { result } = renderHook(() => useGraphNavigation(10));
      expect(result.current.config.minScale).toBe(0.5);
    });

    it("detects mobile viewport correctly", () => {
      Object.defineProperty(window, "innerWidth", { value: 375 });
      const { result } = renderHook(() => useGraphNavigation(5));
      expect(result.current.config.isMobile).toBe(true);
    });
  });

  describe("methods", () => {
    it("handleZoomIn calls zoomIn on transformRef", () => {
      const { result } = renderHook(() => useGraphNavigation(5));
      const mockZoomIn = vi.fn();

      result.current.transformRef.current = {
        zoomIn: mockZoomIn,
        instance: { transformState: { scale: 1, positionX: 0, positionY: 0 } },
      };

      result.current.methods.handleZoomIn();
      expect(mockZoomIn).toHaveBeenCalledTimes(1);
    });

    it("handleZoomOut calls zoomOut on transformRef", () => {
      const { result } = renderHook(() => useGraphNavigation(5));
      const mockZoomOut = vi.fn();

      result.current.transformRef.current = {
        zoomOut: mockZoomOut,
        instance: { transformState: { scale: 1, positionX: 0, positionY: 0 } },
      };

      result.current.methods.handleZoomOut();
      expect(mockZoomOut).toHaveBeenCalledTimes(1);
    });

    it("handleReset calls resetTransform on transformRef", () => {
      const { result } = renderHook(() => useGraphNavigation(5));
      const mockResetTransform = vi.fn();

      result.current.transformRef.current = {
        resetTransform: mockResetTransform,
        instance: { transformState: { scale: 1, positionX: 0, positionY: 0 } },
      };

      result.current.methods.handleReset();
      expect(mockResetTransform).toHaveBeenCalledTimes(1);
    });
  });
});

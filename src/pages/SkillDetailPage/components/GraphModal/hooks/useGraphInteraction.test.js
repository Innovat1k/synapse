import { renderHook, act } from "@testing-library/react";
import { useGraphInteraction } from "./useGraphInteraction";

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("useGraphInteraction", () => {
  const defaultProps = {
    centerSkillId: "skill-1",
    nodes: [
      { id: "skill-1", label: "JavaScript" },
      { id: "skill-2", label: "React" },
      { id: "skill-3", label: "TypeScript" },
    ],
    links: [{ source: "skill-1", target: "skill-2" }],
  };

  beforeEach(() => {
    mockLocalStorage.clear();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  describe("initial state", () => {
    it("returns valid structure with default props", () => {
      const { result } = renderHook(() => useGraphInteraction(defaultProps));

      expect(result.current.isMobile).toBe(false);
      expect(result.current.state.hoveredNodeId).toBeNull();
      expect(result.current.state.hoveredNode).toBeUndefined();
      expect(result.current.state.nodesWithStatus).toHaveLength(3);
      expect(result.current.state.mousePos).toEqual({ x: 0, y: 0 });
    });

    it("handles undefined nodes gracefully", () => {
      const { result } = renderHook(() =>
        useGraphInteraction({ ...defaultProps, nodes: undefined }),
      );
      expect(result.current.state.nodesWithStatus).toEqual([]);
    });

    it("handles null links gracefully", () => {
      const { result } = renderHook(() =>
        useGraphInteraction({ ...defaultProps, links: null }),
      );
      expect(result.current.state.nodesWithStatus).toHaveLength(3);
    });

    it("detects mobile viewport at initialization", () => {
      Object.defineProperty(window, "innerWidth", { value: 375 });
      const { result } = renderHook(() => useGraphInteraction(defaultProps));
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe("derived state", () => {
    it("computes hoveredNode from hoveredNodeId", () => {
      const { result } = renderHook(() => useGraphInteraction(defaultProps));

      act(() => {
        result.current.methods.setHoveredNode("skill-2");
      });

      expect(result.current.state.hoveredNode?.id).toBe("skill-2");
      expect(result.current.state.hoveredNode?.label).toBe("React");
    });

    it("returns undefined for non-existent hoveredNodeId", () => {
      const { result } = renderHook(() => useGraphInteraction(defaultProps));

      act(() => {
        result.current.methods.setHoveredNode("non-existent");
      });

      expect(result.current.state.hoveredNode).toBeUndefined();
    });
  });

  describe("methods", () => {
    describe("setHoveredNode", () => {
      it("updates hoveredNodeId when called", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.setHoveredNode("skill-2");
        });

        expect(result.current.state.hoveredNodeId).toBe("skill-2");
      });

      it("clears hoveredNodeId when null is passed", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.setHoveredNode("skill-2");
          result.current.methods.setHoveredNode(null);
        });

        expect(result.current.state.hoveredNodeId).toBeNull();
      });
    });

    describe("handleNodeInteraction", () => {
      it("sets hovered node persistently on desktop", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.handleNodeInteraction("skill-2", false);
        });

        expect(result.current.state.hoveredNodeId).toBe("skill-2");
      });

      it("toggles hovered node on mobile tap", () => {
        Object.defineProperty(window, "innerWidth", { value: 375 });
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        // Premier tap : affiche
        act(() => {
          result.current.methods.handleNodeInteraction("skill-2", false);
        });
        expect(result.current.state.hoveredNodeId).toBe("skill-2");

        // Deuxième tap : cache
        act(() => {
          result.current.methods.handleNodeInteraction("skill-2", false);
        });
        expect(result.current.state.hoveredNodeId).toBeNull();
      });

      it("ignores interaction on center node", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.handleNodeInteraction("skill-1", true);
        });

        expect(result.current.state.hoveredNodeId).toBeNull();
      });
    });

    describe("handleNodeClick", () => {
      it("completes available skill on desktop click", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.handleNodeClick("skill-1", "available");
        });

        const skill1 = result.current.state.nodesWithStatus.find(
          (n) => n.id === "skill-1",
        );
        expect(skill1).toBeDefined();
        expect(skill1.status).toBe("completed");
      });

      it("ignores click on non-available skills", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.handleNodeClick("skill-2", "locked");
        });

        const skill2 = result.current.state.nodesWithStatus.find(
          (n) => n.id === "skill-2",
        );
        expect(skill2).toBeDefined();
        expect(skill2.status).toBe("locked");
      });

      it("ignores click on non-available skills", () => {
        const { result } = renderHook(() => useGraphInteraction(defaultProps));

        act(() => {
          result.current.methods.handleNodeClick("skill-2", "locked");
        });

        expect(
          result.current.state.nodesWithStatus.find((n) => n.id === "skill-2")
            ?.status,
        ).toBe("locked");
      });
    });
  });

  describe("side effects", () => {
    it("persists completed skills to localStorage", () => {
      const { result } = renderHook(() => useGraphInteraction(defaultProps));

      act(() => {
        result.current.methods.handleNodeClick("skill-1", "available");
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "skill-progress-skill-1",
        expect.stringContaining('"skill-1":"completed"'),
      );
    });

    it("listens to window resize for mobile detection", () => {
      const originalAddEventListener = window.addEventListener;
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");

      renderHook(() => useGraphInteraction(defaultProps));

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );

      // Restore
      addEventListenerSpy.mockRestore();
      window.addEventListener = originalAddEventListener;
    });
  });

  describe("edge cases", () => {
    it("handles rapid prop changes without errors", () => {
      const { rerender } = renderHook((props) => useGraphInteraction(props), {
        initialProps: defaultProps,
      });

      expect(() => {
        rerender({ ...defaultProps, centerSkillId: "skill-4" });
        rerender({ ...defaultProps, nodes: [] });
        rerender(defaultProps);
      }).not.toThrow();
    });

    it("manages empty nodes array gracefully", () => {
      const { result } = renderHook(() =>
        useGraphInteraction({ ...defaultProps, nodes: [] }),
      );

      expect(result.current.state.nodesWithStatus).toEqual([]);
    });

    it("recovers from localStorage corruption", () => {
      mockLocalStorage.getItem.mockReturnValueOnce("invalid json");

      expect(() => {
        renderHook(() => useGraphInteraction(defaultProps));
      }).not.toThrow();
    });
  });
});

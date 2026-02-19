import { renderHook, act } from "@testing-library/react";
import { useSkillProgress } from "./useSkillProgress";

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

describe("useSkillProgress", () => {
  const nodes = [
    { id: "skill-1", label: "JavaScript" },
    { id: "skill-2", label: "React" },
    { id: "skill-3", label: "TypeScript" },
  ];
  const links = [{ source: "skill-1", target: "skill-2" }];
  const storageKey = "test-progress";

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it("computes correct initial status for nodes", () => {
    const { result } = renderHook(() => 
      useSkillProgress(nodes, links, storageKey)
    );

    expect(result.current.nodesWithStatus).toHaveLength(3);
    
    const js = result.current.nodesWithStatus.find(n => n.id === "skill-1");
    const react = result.current.nodesWithStatus.find(n => n.id === "skill-2");
    
    expect(js.status).toBe("available"); // No prerequisites
    expect(react.status).toBe("locked"); // Depends on JS (not completed yet)
  });

  it("marks skill as completed when completeSkill is called", () => {
    const { result } = renderHook(() => 
      useSkillProgress(nodes, links, storageKey)
    );

    act(() => {
      result.current.completeSkill("skill-1");
    });

    const js = result.current.nodesWithStatus.find(n => n.id === "skill-1");
    expect(js.status).toBe("completed");
  });

  it("unlocks dependent skills when prerequisites are completed", () => {
    const { result } = renderHook(() => 
      useSkillProgress(nodes, links, storageKey)
    );

    // Complete JavaScript first
    act(() => {
      result.current.completeSkill("skill-1");
    });

    // Now React should be available
    const react = result.current.nodesWithStatus.find(n => n.id === "skill-2");
    expect(react.status).toBe("available");

    // Complete React
    act(() => {
      result.current.completeSkill("skill-2");
    });

    const reactCompleted = result.current.nodesWithStatus.find(n => n.id === "skill-2");
    expect(reactCompleted.status).toBe("completed");
  });

  // 🔥 NOUVEAUX TESTS POUR LA ROBUSTESSE 🔥

  it("handles undefined nodes gracefully", () => {
    const { result } = renderHook(() => 
      useSkillProgress(undefined, links, storageKey)
    );
    expect(result.current.nodesWithStatus).toEqual([]);
  });

  it("handles null nodes gracefully", () => {
    const { result } = renderHook(() => 
      useSkillProgress(null, links, storageKey)
    );
    expect(result.current.nodesWithStatus).toEqual([]);
  });

  it("handles null links gracefully", () => {
    const { result } = renderHook(() => 
      useSkillProgress(nodes, null, storageKey)
    );
    
    // All nodes should be available (no prerequisites)
    result.current.nodesWithStatus.forEach(node => {
      expect(node.status).toBe("available");
    });
  });

  it("works without storage key (no persistence)", () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { result } = renderHook(() => 
      useSkillProgress(nodes, links, null)
    );

    // Should not crash
    expect(result.current.nodesWithStatus).toHaveLength(3);
    
    // Complete a skill
    act(() => {
      result.current.completeSkill("skill-1");
    });
    
    const js = result.current.nodesWithStatus.find(n => n.id === "skill-1");
    expect(js.status).toBe("completed");
    
    // No localStorage calls should happen
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  it("recovers from corrupted localStorage data", () => {
    mockLocalStorage.getItem.mockReturnValueOnce("invalid json");
    
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useSkillProgress(nodes, links, storageKey));
    }).not.toThrow();
    
    consoleWarnSpy.mockRestore();
  });

  it("persists completed skills to localStorage", () => {
    const { result } = renderHook(() => 
      useSkillProgress(nodes, links, storageKey)
    );

    act(() => {
      result.current.completeSkill("skill-1");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      storageKey,
      expect.stringContaining('"skill-1":"completed"')
    );
  });
});
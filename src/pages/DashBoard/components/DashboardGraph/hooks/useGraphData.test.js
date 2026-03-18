import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGraphData } from "./useGraphData";

const mockTransform = vi.hoisted(() => vi.fn());

vi.mock("../../../utils/graphHelpers", () => ({
  transformSkillsToGraphData: mockTransform,
}));

describe("useGraphData", () => {
  beforeEach(() => {
    mockTransform.mockReset();
  });

  it("returns empty nodes and edges when skills and links are empty", () => {
    mockTransform.mockReturnValue({ nodes: [], edges: [] });
    const { result } = renderHook(() => useGraphData([], []));
    expect(result.current).toEqual({ nodes: [], edges: [] });
  });

  it("transforms skills and links into graph data", () => {
    const skills = [
      {
        skill_id: "1",
        name: "React",
        level: 4,
        category: "ui",
        track_id: "t1",
      },
    ];
    const links = [
      { source_skill_id: "1", target_skill_id: "2", type: "prerequisite" },
    ];

    const expectedOutput = {
      nodes: [
        {
          id: "1",
          type: "skillNode",
          data: { label: "React", level: 4, category: "ui" },
        },
      ],
      edges: [{ id: "e-1-2", source: "1", target: "2" }],
    };

    mockTransform.mockReturnValue(expectedOutput);
    const { result } = renderHook(() => useGraphData(skills, links));

    expect(result.current).toEqual(expectedOutput);
    expect(mockTransform).toHaveBeenCalledWith(skills, links);
  });

  it("updates output when skills or links change", () => {
    const skills1 = [{ skill_id: "1" }];
    const skills2 = [{ skill_id: "2" }];
    const links = [];

    const output1 = { nodes: [{ id: "1" }], edges: [] };
    const output2 = { nodes: [{ id: "2" }], edges: [] };

    mockTransform.mockReturnValueOnce(output1).mockReturnValueOnce(output2);

    const { result, rerender } = renderHook(({ s, l }) => useGraphData(s, l), {
      initialProps: { s: skills1, l: links },
    });

    expect(result.current).toBe(output1);

    rerender({ s: skills2, l: links });
    expect(result.current).toBe(output2);
  });
});

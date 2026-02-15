import { renderHook } from "@testing-library/react";
import { useGraphLayout } from "./useGraphLayout";

const mockCenterSkillId = "skill-react";
const mockNodes = [
  { id: "skill-react", label: "React", status: "completed" },
  { id: "skill-js", label: "JavaScript", status: "completed" },
  { id: "skill-html", label: "HTML", status: "available" },
  { id: "skill-pm", label: "Project Management", status: "locked" },
];
const mockLinks = [
  { source: "skill-js", target: "skill-react" }, // JS → React (prerequisite)
  { source: "skill-react", target: "skill-js" }, // React → JS (mutual)
  { source: "skill-html", target: "skill-react" }, // HTML → React (prerequisite)
  { source: "skill-react", target: "skill-pm" }, // React → PM (unlock)
];

describe("useGraphLayout", () => {
  it("calculates relationship sets correctly", () => {
    const { result } = renderHook(() =>
      useGraphLayout({
        centerSkillId: mockCenterSkillId,
        nodes: mockNodes,
        links: mockLinks,
        isMobile: false,
      })
    );

    expect(result.current.incoming).toContain("skill-js");
    expect(result.current.incoming).toContain("skill-html");
    expect(result.current.outgoing).toContain("skill-js");
    expect(result.current.outgoing).toContain("skill-pm");
    expect(result.current.mutualSkills).toContain("skill-js");
    expect(result.current.mutualSkills).not.toContain("skill-html");
  });

  it("returns null nodePositions when center skill is not found", () => {
    const { result } = renderHook(() =>
      useGraphLayout({
        centerSkillId: "non-existent",
        nodes: mockNodes,
        links: mockLinks,
        isMobile: false,
      })
    );

    expect(result.current.nodePositions).toBeNull();
  });

  it("generates mobile configuration when isMobile is true", () => {
    const { result } = renderHook(() =>
      useGraphLayout({
        centerSkillId: mockCenterSkillId,
        nodes: mockNodes,
        links: mockLinks,
        isMobile: true,
      })
    );

    expect(result.current.config.viewBox).toBe("0 0 500 750");
    expect(result.current.config.centerSize).toBe(64);
  });

  it("generates desktop configuration when isMobile is false", () => {
    const { result } = renderHook(() =>
      useGraphLayout({
        centerSkillId: mockCenterSkillId,
        nodes: mockNodes,
        links: mockLinks,
        isMobile: false,
      })
    );

    expect(result.current.config.viewBox).toBe("-50 -50 900 600");
    expect(result.current.config.centerSize).toBe(54);
  });

  it("calculates node positions for all connected skills", () => {
    const { result } = renderHook(() =>
      useGraphLayout({
        centerSkillId: mockCenterSkillId,
        nodes: mockNodes,
        links: mockLinks,
        isMobile: false,
      })
    );

    const positions = result.current.nodePositions;
    expect(positions).not.toBeNull();
    expect(positions.has("skill-react")).toBe(true);
    expect(positions.has("skill-js")).toBe(true);
    expect(positions.has("skill-html")).toBe(true);
    expect(positions.has("skill-pm")).toBe(true);
  });
});
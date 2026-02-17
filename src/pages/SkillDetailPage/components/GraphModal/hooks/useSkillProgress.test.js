import { renderHook, act } from "@testing-library/react";
import { useSkillProgress } from "./useSkillProgress";

const mockNodes = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JavaScript" }
];

const mockLinks = [
  { source: "html", target: "css" },
  { source: "css", target: "js" }
];

const STORAGE_KEY = "test-skill-progress";

describe("useSkillProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with correct statuses", () => {
    const { result } = renderHook(() =>
      useSkillProgress(mockNodes, mockLinks, STORAGE_KEY)
    );

    expect(result.current.nodesWithStatus).toEqual([
      { id: "html", label: "HTML", status: "available" },
      { id: "css", label: "CSS", status: "locked" },
      { id: "js", label: "JavaScript", status: "locked" }
    ]);
  });

  it("completes a skill and updates dependencies", () => {
    const { result, rerender } = renderHook(() =>
      useSkillProgress(mockNodes, mockLinks, STORAGE_KEY)
    );

    act(() => {
      result.current.completeSkill("html");
    });
    rerender();

    expect(result.current.nodesWithStatus).toEqual([
      { id: "html", label: "HTML", status: "completed" },
      { id: "css", label: "CSS", status: "available" },
      { id: "js", label: "JavaScript", status: "locked" }
    ]);

    act(() => {
      result.current.completeSkill("css");
    });
    rerender();

    expect(result.current.nodesWithStatus).toEqual([
      { id: "html", label: "HTML", status: "completed" },
      { id: "css", label: "CSS", status: "completed" },
      { id: "js", label: "JavaScript", status: "available" }
    ]);
  });

  it("persists state in localStorage", async () => {
    const { result } = renderHook(() =>
      useSkillProgress(mockNodes, mockLinks, STORAGE_KEY)
    );

    act(() => {
      result.current.completeSkill("html");
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(saved)).toEqual({ html: "completed" });
  });

  it("loads state from localStorage on init", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ html: "completed" }));

    const { result } = renderHook(() =>
      useSkillProgress(mockNodes, mockLinks, STORAGE_KEY)
    );

    expect(result.current.nodesWithStatus).toEqual([
      { id: "html", label: "HTML", status: "completed" },
      { id: "css", label: "CSS", status: "available" },
      { id: "js", label: "JavaScript", status: "locked" }
    ]);
  });

  it("cannot complete locked skills", () => {
    const { result, rerender } = renderHook(() =>
      useSkillProgress(mockNodes, mockLinks, STORAGE_KEY)
    );

    act(() => {
      result.current.completeSkill("js");
    });
    rerender();

    expect(result.current.nodesWithStatus.find(n => n.id === "js").status).toBe("locked");
  });
});
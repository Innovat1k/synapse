import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDashboardData } from "./useDashboardData";

// Mocks
vi.mock("../../../shared/hooks/useSkillsQuery/useSkillsQuery", () => ({
  useSkillsQuery: vi.fn(),
}));

vi.mock("../../../shared/hooks/useTracksQuery", () => ({
  useTracksQuery: vi.fn(),
}));

vi.mock("../../../shared/hooks/useSkillLinksQuery", () => ({
  useSkillLinksQuery: vi.fn(),
}));

import { useSkillsQuery } from "../../../shared/hooks/useSkillsQuery/useSkillsQuery";
import { useTracksQuery } from "../../../shared/hooks/useTracksQuery";
import { useSkillLinksQuery } from "../../../shared/hooks/useSkillLinksQuery";

describe("useDashboardData", () => {
  const skills = [
    { id: "1", track_id: "t1", category: "frontend" },
    { id: "2", track_id: "t1", category: "backend" },
    { id: "3", track_id: "t2", category: "frontend" },
  ];

  const tracks = [
    { track_id: "t1", name: "Track 1" },
    { track_id: "t2", name: "Track 2" },
  ];

  const setup = (overrides = {}) => {
    useSkillsQuery.mockReturnValue({
      skills,
      isLoading: false,
      ...overrides.skills,
    });

    useTracksQuery.mockReturnValue({
      tracks,
      isLoading: false,
      ...overrides.tracks,
    });

    useSkillLinksQuery.mockReturnValue({
      links: [],
      isLoading: false,
      ...overrides.links,
    });

    return renderHook(() => useDashboardData());
  };

  it("exposes initial global state", () => {
    const { result } = setup();

    expect(result.current.view.mode).toBe("global");
    expect(result.current.filtered.skills).toHaveLength(3);
  });

  it("filters by track", () => {
    const { result } = setup();

    act(() => {
      result.current.actions.selectTrack("t1");
    });

    expect(result.current.view.mode).toBe("track");
    expect(result.current.filtered.skills).toEqual([
      { id: "1", track_id: "t1", category: "frontend" },
      { id: "2", track_id: "t1", category: "backend" },
    ]);
  });

  it("filters by category", () => {
    const { result } = setup();

    act(() => {
      result.current.actions.selectCategory("frontend");
    });

    expect(result.current.view.mode).toBe("category");
    expect(result.current.filtered.skills).toEqual([
      { id: "1", track_id: "t1", category: "frontend" },
      { id: "3", track_id: "t2", category: "frontend" },
    ]);
  });

  it("gives priority to category over track", () => {
    const { result } = setup();

    act(() => {
      result.current.actions.selectTrack("t1");
      result.current.actions.selectCategory("frontend");
    });

    expect(result.current.view.mode).toBe("category");
    expect(result.current.filtered.skills).toEqual([
      { id: "1", track_id: "t1", category: "frontend" },
    ]);
  });

  it("resolves current track", () => {
    const { result } = setup();

    act(() => {
      result.current.actions.selectTrack("t2");
    });

    expect(result.current.view.currentTrack).toEqual({
      track_id: "t2",
      name: "Track 2",
    });
  });

  it("computes unique categories", () => {
    const { result } = setup();

    expect(result.current.data.categories).toEqual([
      { value: "frontend", label: "frontend" },
      { value: "backend", label: "backend" },
    ]);
  });

  it("aggregates loading state", () => {
    const { result } = setup({
      skills: { isLoading: true },
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("handles empty data", () => {
    const { result } = setup({
      skills: { skills: [] },
    });

    expect(result.current.filtered.skills).toEqual([]);
    expect(result.current.data.categories).toEqual([]);
  });
});

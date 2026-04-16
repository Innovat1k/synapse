import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDashboardData } from "./useDashboardData";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-01c" },
  }),
}));

vi.mock("@services/skillService", () => ({
  fetchSkills: vi.fn(),
}));

vi.mock("@services/tracksService", () => ({
  fetchTracks: vi.fn(),
}));

import { fetchSkills } from "@services/skillService";
import { fetchTracks } from "@services/tracksService";

let client;
let Wrapper;

describe("useDashboardData", () => {
  const skills = [
    { id: "1", track_id: "t1", category: "frontend", user_id: "user-01c" },
    { id: "2", track_id: "t1", category: "backend", user_id: "user-01c" },
    { id: "3", track_id: "t2", category: "frontend", user_id: "user-01c" },
  ];

  const tracks = [
    { track_id: "t1", name: "Track 1" },
    { track_id: "t2", name: "Track 2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    Wrapper = ({ children }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
    fetchSkills.mockResolvedValue(skills);
    fetchTracks.mockResolvedValue(tracks);
  });

  const setup = () => {
    return renderHook(() => useDashboardData(), {
      wrapper: Wrapper,
    });
  };

  it("exposes initial global state", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.view.mode).toBe("global");
    expect(result.current.filtered.skills).toHaveLength(3);
  });

  it("filters by track", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.actions.selectTrack("t1");
    });

    expect(result.current.view.mode).toBe("track");
    expect(result.current.filtered.skills).toEqual([skills[0], skills[1]]);
  });

  it("filters by category", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.actions.selectCategory("frontend");
    });

    expect(result.current.view.mode).toBe("category");
    expect(result.current.filtered.skills).toEqual([skills[0], skills[2]]);
  });

  it("gives priority to category over track", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.actions.selectTrack("t1");
      result.current.actions.selectCategory("frontend");
    });

    expect(result.current.view.mode).toBe("category");
    expect(result.current.filtered.skills).toEqual([skills[0]]);
  });

  it("resolves current track", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.actions.selectTrack("t2");
    });

    expect(result.current.view.currentTrack).toEqual(tracks[1]);
  });

  it("computes unique categories", async () => {
    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data.categories).toEqual([
      { value: "frontend", label: "frontend" },
      { value: "backend", label: "backend" },
    ]);
  });

  it("aggregates loading state", async () => {
    fetchSkills.mockImplementation(() => new Promise(() => {}));

    const { result } = setup();

    expect(result.current.isLoading).toBe(true);
  });

  it("handles empty data", async () => {
    fetchSkills.mockResolvedValue([]);
    fetchTracks.mockResolvedValue([]);

    const { result } = setup();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filtered.skills).toEqual([]);
    expect(result.current.data.categories).toEqual([]);
  });
});

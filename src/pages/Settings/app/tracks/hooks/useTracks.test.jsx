import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTracks } from "./useTracks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clearTracks, seedTracks } from "@mocks/stores";

describe("useTracks", () => {
  let client;
  let QueryWrapper;

  beforeEach(() => {
    client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    QueryWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  });

  it("defines form value at false by default", () => {
    const { result } = renderHook(() => useTracks(), {
      wrapper: QueryWrapper,
    });
    expect(result.current.createForm.isOpen).toBe(false);
  });

  it("changes form value to true if switched", () => {
    const { result } = renderHook(() => useTracks(), {
      wrapper: QueryWrapper,
    });

    act(() => {
      result.current.createForm.open();
    });

    expect(result.current.createForm.isOpen).toBe(true);
  });

  it("fetches tracks on mount", async () => {
    seedTracks([{ track_id: "1", title: "React", category: "frontend" }]);

    const { result } = renderHook(() => useTracks(), {
      wrapper: QueryWrapper,
    });

    expect(result.current.status.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.status.isLoading).toBe(false);
    });

    expect(result.current.data.tracks).toHaveLength(1);
    expect(result.current.data.tracks[0].title).toBe("React");
  });

  it("creates track successfully", async () => {
    clearTracks();

    const { result } = renderHook(() => useTracks(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.status.isLoading).toBe(false));

    await act(async () => {
      await result.current.actions.create({
        track_id: "new",
        title: "New Track",
        category: "other",
      });
    });

    expect(result.current.createForm.isOpen).toBe(false);
  });
});

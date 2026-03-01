import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTracksPage } from "./useTracks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "../../../../../mocks/server";
import { http, HttpResponse } from "msw";
import { SUPABASE_URL } from "../../../../../services/supabase-client";

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

    server.resetHandlers();
  });

  it("defines form value at false by default", () => {
    const { result } = renderHook(() => useTracksPage(), {
      wrapper: QueryWrapper,
    });
    expect(result.current.form.isFormOpen).toBe(false);
  });

  it("changes form value to true if switched", () => {
    const { result } = renderHook(() => useTracksPage(), {
      wrapper: QueryWrapper,
    });

    act(() => {
      result.current.form.openForm();
    });

    expect(result.current.form.isFormOpen).toBe(true);
  });

  it("fetches tracks on mount", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json([
          { track_id: "1", title: "React", category: "frontend" },
        ]);
      }),
    );

    const { result } = renderHook(() => useTracksPage(), {
      wrapper: QueryWrapper,
    });

    expect(result.current.loader.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.loader.isLoading).toBe(false);
    });

    expect(result.current.config.tracks).toHaveLength(1);
    expect(result.current.config.tracks[0].title).toBe("React");
  });

  it("creates track successfully", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json([]);
      }),

      http.post(
        `${SUPABASE_URL}/rest/v1/synapse_tracks`,
        async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json(
            { ...body, created_at: new Date().toISOString() },
            { status: 201 },
          );
        },
      ),
    );

    const { result } = renderHook(() => useTracksPage(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.loader.isLoading).toBe(false));

    await act(async () => {
      await result.current.handleCreate({
        track_id: "new",
        title: "New Track",
        category: "other",
      });
    });

    expect(result.current.form.isFormOpen).toBe(false);
  });

  it("handles duplicate track ID error", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json([]);
      }),

      http.post(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json(
          {
            code: "23505",
            message: "duplicate key value violates unique constraint",
          },
          { status: 409 },
        );
      }),
    );

    const { result } = renderHook(() => useTracksPage(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => expect(result.current.loader.isLoading).toBe(false));

    act(() => {
      result.current.form.openForm();
    });

    expect(result.current.form.isFormOpen).toBe(true);

    await expect(
      result.current.handleCreate({
        track_id: "dup",
        title: "Duplicate",
        category: "other",
      }),
    ).rejects.toThrow();

    expect(result.current.form.isFormOpen).toBe(true);
  });
});

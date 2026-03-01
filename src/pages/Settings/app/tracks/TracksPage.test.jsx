import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TracksSettingsPage } from "./TracksPage";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@mocks/server";
import { http, HttpResponse } from "msw";

const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByLabelText(/Loading/i)).not.toBeInTheDocument();
  });

describe("TracksSettingsPage avec MSW", () => {
  let user;
  let client;

  beforeEach(() => {
    user = userEvent.setup();
    client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    server.resetHandlers();
  });

  const renderPage = () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <TracksSettingsPage />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  describe("Rendering", () => {
    it("renders loading state initially", () => {
      renderPage();
      expect(screen.getByLabelText(/Loading/i)).toBeInTheDocument();
    });

    it("renders error state when fetch fails", async () => {
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
          return HttpResponse.json(
            { message: "Network error" },
            { status: 500 },
          );
        }),
      );

      renderPage();

      await waitFor(() => {
        expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
      });
    });

    it("renders empty state when no tracks exist", async () => {
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
          return HttpResponse.json([]);
        }),
      );

      renderPage();

      await waitForLoadingToFinish();
      expect(screen.getByText(/No tracks established/i)).toBeInTheDocument();
    });

    it("renders track list when tracks exist", async () => {
      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
          return HttpResponse.json([
            {
              track_id: "react",
              title: "React Architecture",
              category: "frontend",
              description: null,
              is_visible: true,
              sort_order: 0,
              created_at: "2026-02-27T12:00:00.000Z",
              updated_at: "2026-02-27T12:00:00.000Z",
            },
          ]);
        }),
      );

      renderPage();

      await waitForLoadingToFinish();
      expect(screen.getByText(/React Architecture/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it('opens the form when "New Track" button is clicked', async () => {
      renderPage();

      await waitForLoadingToFinish();
      await user.click(screen.getByRole("button", { name: /New Track/i }));

      expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();
    });

    it("closes the form when cancel button is clicked", async () => {
      renderPage();
      await waitForLoadingToFinish();

      await user.click(screen.getByRole("button", { name: /New Track/i }));
      expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /close track form/i }),
      );

      await waitFor(() => {
        expect(screen.queryByLabelText(/Track Title/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Actions", () => {
    it("submits a new track and shows success", async () => {
      let tracks = [];

      server.use(
        http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
          return HttpResponse.json(tracks);
        }),

        http.post(
          `${SUPABASE_URL}/rest/v1/synapse_tracks`,
          async ({ request }) => {
            const body = await request.json();
            const newTrack = {
              ...body,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            tracks.push(newTrack); // Simule persistence
            return HttpResponse.json(newTrack, { status: 201 });
          },
        ),
      );

      renderPage();

      await waitForLoadingToFinish();
      await user.click(screen.getByRole("button", { name: /New Track/i }));

      await user.type(
        screen.getByLabelText(/Track Title/i),
        "React fundamental",
      );
      await user.click(screen.getByRole("button", { name: /Create Track/i }));

      await waitFor(() => {
        expect(screen.getByText(/react-fundamental/i)).toBeInTheDocument();
      });
    });

    it("shows error on duplicate track ID", async () => {
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

      renderPage();

      await waitForLoadingToFinish();
      await user.click(screen.getByRole("button", { name: /New Track/i }));

      await user.type(screen.getByLabelText(/Track Title/i), "React");
      await user.click(screen.getByRole("button", { name: /Create Track/i }));

      expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();
    });
  });
});

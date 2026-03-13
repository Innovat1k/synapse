import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { server } from "@mocks/server";
import { http, HttpResponse } from "msw";
import SkillListPage from "../SkillsListPage";
import { renderComponent, mockSkills } from "./test-utils";

const SUPABASE_URL = "https://yuvgvsjlwwiobwpyaeff.supabase.co";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

describe("SkillListPage – Modal stacking (Skill + Track)", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    server.resetHandlers();
  });

  it("stacks SkillFormModal and TrackFormModal", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () =>
        HttpResponse.json([]),
      ),
    );

    renderComponent(<SkillListPage />, { skills: mockSkills });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();

    const skillModal = screen.getByTestId("skill-modal-content");
    await user.click(
      within(skillModal).getByRole("button", { name: /create/i }),
    );

    expect(screen.getByTestId("track-modal-content")).toBeInTheDocument();
    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();
  });

  it("traps focus in TrackFormModal when stacked over SkillFormModal", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () =>
        HttpResponse.json([]),
      ),
    );

    renderComponent(<SkillListPage />, { skills: mockSkills });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    const skillModal = screen.getByTestId("skill-modal-content");
    await user.click(
      within(skillModal).getByRole("button", { name: /create/i }),
    );

    const trackModal = screen.getByTestId("track-modal-content");

    for (let i = 0; i < 10; i++) {
      await user.tab();
    }

    expect(trackModal).toContainElement(document.activeElement);
  });

  it("closes TrackFormModal and keeps SkillFormModal open", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () =>
        HttpResponse.json([]),
      ),
    );

    renderComponent(<SkillListPage />, { skills: mockSkills });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    const skillModal = screen.getByTestId("skill-modal-content");
    await user.click(
      within(skillModal).getByRole("button", { name: /create/i }),
    );

    const trackModal = screen.getByTestId("track-modal-content");
    await user.click(
      within(trackModal).getByRole("button", { name: /cancel/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("track-modal-content"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();
    expect(within(skillModal).getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("creates a track from SkillFormModal", async () => {
    const createHandler = vi.fn();

    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () =>
        HttpResponse.json([]),
      ),
      http.post(
        `${SUPABASE_URL}/rest/v1/synapse_tracks`,
        async ({ request }) => {
          const body = await request.json();
          createHandler(body);
          return HttpResponse.json(
            { ...body, track_id: "new-id" },
            { status: 201 },
          );
        },
      ),
    );

    renderComponent(<SkillListPage />, { skills: mockSkills });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    await user.click(screen.getByRole("button", { name: /create/i }));

    await user.type(screen.getByLabelText(/track title/i), "Frontend");
    await user.click(screen.getByRole("button", { name: /create track/i }));

    expect(createHandler).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Frontend" }),
    );
  });

  it("loads existing tracks in SkillFormModal when available", async () => {
    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json([
          {
            track_id: "react",
            title: "React Architecture",
            category: "frontend",
            is_visible: true,
            sort_order: 0,
            created_at: "2026-03-08T12:00:00Z",
            updated_at: "2026-03-08T12:00:00Z",
          },
        ]);
      }),
    );

    renderComponent(<SkillListPage />, { skills: [] });

    await waitFor(() => {
      expect(screen.getByText(/No skills found/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));

    await user.click(screen.getByRole("button", { name: /learning track/i }));

    expect(
      screen.getByRole("option", { name: /React Architecture/i }),
    ).toBeInTheDocument();
  });

  it("creates a track and shows it in SkillFormModal", async () => {
    let tracksData = [];

    server.use(
      http.get(`${SUPABASE_URL}/rest/v1/synapse_tracks`, () => {
        return HttpResponse.json(tracksData);
      }),
      http.post(
        `${SUPABASE_URL}/rest/v1/synapse_tracks`,
        async ({ request }) => {
          const body = await request.json();
          const newTrack = {
            ...body,
            track_id: "new-track-id",
            title: "Frontend Track",
            created_at: new Date().toISOString(),
          };
          tracksData = [newTrack];
          return HttpResponse.json(newTrack, { status: 201 });
        },
      ),
    );

    renderComponent(<SkillListPage />, { skills: mockSkills });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    const skillModal = screen.getByTestId("skill-modal-content");
    expect(
      within(skillModal).getByText(/no tracks available/i),
    ).toBeInTheDocument();

    await user.click(
      within(skillModal).getByRole("button", { name: /create/i }),
    );
    const trackModal = await screen.findByTestId("track-modal-content");

    await user.type(
      within(trackModal).getByLabelText(/track title/i),
      "Frontend Track",
    );
    await user.click(
      within(trackModal).getByRole("button", { name: /create track/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("track-modal-content"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();

    await waitFor(() => {
      const selectButton = within(skillModal).getByRole("button", {
        name: /learning track/i,
      });
      expect(selectButton).toHaveTextContent("Frontend Track");
    });

    const selectButton = within(skillModal).getByRole("button", {
      name: /learning track/i,
    });
    await user.click(selectButton);

    const listbox = await screen.findByRole("listbox", {
      name: /learning track/i,
    });
    expect(
      within(listbox).getByRole("option", { name: "Frontend Track" }),
    ).toBeInTheDocument();

    await user.click(
      within(listbox).getByRole("option", { name: "Frontend Track" }),
    );
    expect(listbox).not.toBeInTheDocument();
    expect(selectButton).toHaveTextContent("Frontend Track");
  });
});

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import SkillListPage from "../SkillsListPage";
import { renderComponent } from "./test-utils";
import { clearTracks, skillsStore, TEST_USER_ID } from "@mocks/stores";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
  }),
}));

describe("SkillListPage – Modal stacking (Skill + Track)", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("stacks SkillFormModal and TrackFormModal", async () => {
    clearTracks();
    renderComponent(<SkillListPage />, { skills: skillsStore });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();

    const skillModal = screen.getByTestId("skill-modal-content");
    await user.click(
      await within(skillModal).findByRole("button", { name: /create/i }),
    );

    expect(screen.getByTestId("track-modal-content")).toBeInTheDocument();
    expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();
  });

  it("traps focus in TrackFormModal when stacked over SkillFormModal", async () => {
    clearTracks();
    renderComponent(<SkillListPage />, { skills: skillsStore });

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
    clearTracks();
    renderComponent(<SkillListPage />, { skills: skillsStore });

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
    clearTracks();
    renderComponent(<SkillListPage />, { skills: skillsStore });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));
    await user.click(screen.getByRole("button", { name: /create/i }));

    await user.type(screen.getByLabelText(/track title/i), "Frontend");
    await user.click(screen.getByRole("button", { name: /create track/i }));
  }, 10000);

  it("loads existing tracks in SkillFormModal when available", async () => {
    renderComponent(<SkillListPage />, { skills: [] });

    await waitFor(() => {
      expect(screen.getByText(/No skills registered/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));

    await user.click(screen.getByRole("button", { name: /learning track/i }));

    expect(
      screen.getByRole("option", { name: /React fundamentals/i }),
    ).toBeInTheDocument();
  });

  it("creates a track and shows it in SkillFormModal", async () => {
    clearTracks();
    renderComponent(<SkillListPage />, { skills: skillsStore });

    await user.click(screen.getByRole("button", { name: /add new skill/i }));

    const skillModal = within(screen.getByTestId("skill-modal-content"));
    expect(skillModal.getByText(/no tracks available/i)).toBeInTheDocument();

    await user.click(skillModal.getByRole("button", { name: /create/i }));

    const trackModal = within(await screen.findByTestId("track-modal-content"));

    await user.type(
      trackModal.getByLabelText(/track title/i),
      "Frontend Track",
    );
    await user.click(trackModal.getByRole("button", { name: /create track/i }));

    await waitFor(() => {
      expect(
        screen.queryByTestId("track-modal-content"),
      ).not.toBeInTheDocument();
    });

    expect(
      await skillModal.findByRole("button", {
        name: /learning track/i,
      }),
    ).toHaveTextContent("Frontend Track");
  });
});

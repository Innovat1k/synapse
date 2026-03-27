import { vi } from "vitest";
import * as routerDom from "react-router-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderSkillDetailPage } from "./test-utils";
import { clearActivities, seedActivities } from "@mocks/stores";

const SKILL_IDS = {
  REACT: "skill-react",
  JAVA: "skill-java",
  PROJECT_MGMT: "skill-project-mgmt",
};

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
    useParams: vi.fn(),
  };
});

describe("SkillDetailPage: Skill Activities", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("creates an activity for the skill", async () => {
    clearActivities();
    routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
    renderSkillDetailPage();

    expect(
      screen.getByRole("heading", { name: /react js/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you haven't logged any activity/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log activity/i }));

    await user.type(screen.getByLabelText(/hours/i), "1");
    await user.type(screen.getByLabelText(/minutes/i), "13");
    await user.click(screen.getByRole("button", { name: /activity type/i }));

    expect(
      await screen.findByRole("listbox", { name: /activity type/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: /research/i }));
    await user.type(
      screen.getByLabelText(/notes/i),
      "make some search about the new react performance profiler upcoming feature.",
    );

    await user.click(screen.getByRole("button", { name: /add activity/i }));

    await waitFor(() => {
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");

      const desktopLayout = within(screen.getByTestId("list-layout-desktop"));

      expect(desktopLayout.getByText(/1 h 13 mn/i)).toBeInTheDocument();
      expect(desktopLayout.getByText(/research/i)).toBeInTheDocument();
      expect(
        desktopLayout.getByText(
          /make some search about the new react performance profiler upcoming feature/i,
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(/You haven't logged any activity for this skill/i),
      ).not.toBeInTheDocument();
    });
  });

  it("updates an existing activity", async () => {
    seedActivities([
      {
        id: "act-r1",
        skill_id: SKILL_IDS.REACT,
        activity_type: "learning",
        duration_minutes: 30,
        logged_at: "2025-01-01T00:00:00Z",
        notes: "",
      },
    ]);

    routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
    renderSkillDetailPage();

    const activityRow = within(
      await screen.findByTestId("list-layout-desktop"),
    ).getByTestId("activity-row-act-r1");

    expect(within(activityRow).getByText(/30 mn/i)).toBeInTheDocument();
    expect(within(activityRow).getByText(/learning/i)).toBeInTheDocument();

    await user.click(
      within(activityRow).getByRole("button", {
        name: /Edit activity act-r1/i,
      }),
    );

    const editActivityModal = within(
      screen.getByTestId("activity-modal-content"),
    );

    expect(
      editActivityModal.getByRole("heading", {
        name: /edit activity/i,
      }),
    ).toBeInTheDocument();

    await user.clear(editActivityModal.getByLabelText(/minutes/i));
    await user.type(editActivityModal.getByLabelText(/minutes/i), "57");
    await user.type(
      editActivityModal.getByLabelText(/notes/i),
      "learn performance optimization",
    );

    await user.click(
      editActivityModal.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() => {
      expect(within(activityRow).getByText(/57 mn/i)).toBeInTheDocument();
      expect(
        within(activityRow).getByText(/learn performance optimization/i),
      ).toBeInTheDocument();
    });
  });

  it("deletes the selected activity", async () => {
    routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
    renderSkillDetailPage();

    expect(await screen.findByTestId("activity-count-badge")).toHaveTextContent(
      "2",
    );

    const desktopLayout = within(screen.getByTestId("list-layout-desktop"));
    const activityRow1 = within(
      desktopLayout.getByTestId("activity-row-act-001"),
    );
    const activityRow2 = within(
      desktopLayout.getByTestId("activity-row-act-002"),
    );

    expect(activityRow1.getByText(/2 h 30 mn/i)).toBeInTheDocument();
    expect(
      activityRow1.getByText(
        /Completed a React JS module on hooks \(useState, useEffect\)/i,
      ),
    ).toBeInTheDocument();

    expect(activityRow2.getByText(/3 h 30 mn/i)).toBeInTheDocument();
    expect(
      activityRow2.getByText(
        /Developed a small React project: dashboard with components/i,
      ),
    ).toBeInTheDocument();

    await user.click(
      desktopLayout.getByRole("button", { name: /delete activity act-001/i }),
    );

    const deleteActivityModal = within(
      screen.getByTestId("activity-modal-content"),
    );

    expect(
      screen.getByRole("heading", { name: /confirm deletion/i }),
    ).toBeInTheDocument();
    expect(
      deleteActivityModal.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();

    await user.click(
      deleteActivityModal.getByRole("button", {
        name: /delete permanently/i,
      }),
    );

    await waitFor(() => {
      expect(
        desktopLayout.queryByTestId("activity-row-act-001"),
      ).not.toBeInTheDocument();
      expect(
        desktopLayout.getByTestId("activity-row-act-002"),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
  });

  it("removes all activities after valid purge confirmation", async () => {
    routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
    renderSkillDetailPage();

    expect(await screen.findByTestId("activity-count-badge")).toHaveTextContent(
      "2",
    );

    await user.click(
      screen.getByRole("button", { name: /open skill actions/i }),
    );
    await user.click(screen.getByRole("button", { name: /purge activities/i }));
    await user.click(
      screen.getByRole("button", { name: /continue to purge/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/confirm skill name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox"), "React JS");
    await user.click(
      screen.getByRole("button", { name: /purge permanently/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /confirm skill name/i }),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId("activity-count-badge"),
      ).not.toBeInTheDocument();
    });
    expect(
      await screen.findByText(
        /You haven't logged any activity for this skill/i,
      ),
    ).toBeInTheDocument();
  });
});

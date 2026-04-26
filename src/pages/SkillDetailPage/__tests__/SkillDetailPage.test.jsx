import { vi } from "vitest";
import * as routerDom from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderSkillDetailPage } from "./test-utils";
import {
  resetAllStores,
  seedActivities,
  defaultActivities,
  skillsStore,
  TEST_USER_ID,
} from "@mocks/stores";

const SKILL_IDS = {
  REACT: "skill-react",
  JAVA: "skill-java",
  PROJECT_MGMT: "skill-project-mgmt",
};

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
    useParams: vi.fn(),
  };
});

describe("SkillDetailPage", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    routerDom.useOutletContext.mockReturnValue({
      skills: skillsStore,
      isLoading: false,
    });
  });

  it("displays skill details with correct track", async () => {
    routerDom.useParams.mockReturnValue({
      skillId: SKILL_IDS.PROJECT_MGMT,
    });

    renderSkillDetailPage();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /skill: project management/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/level 3/i)).toBeInTheDocument();
    expect(screen.getByText(/other/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/track: computer science/i),
    ).toBeInTheDocument();
  });

  it("displays activity count from default data", async () => {
    routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
    renderSkillDetailPage();

    await waitFor(() => {
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("2");
    });
  });

  describe("Edit skill", () => {
    beforeEach(() => {
      resetAllStores();
    });

    it("opens edition modal filled with current skill data", async () => {
      routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.JAVA });
      renderSkillDetailPage();

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /open skill actions/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );
      await user.click(screen.getByRole("button", { name: /edit skill/i }));

      await waitFor(() => {
        expect(screen.getByTestId("skill-modal-content")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("heading", { name: /edit skill/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i).value).toMatch(/java/i);
      expect(screen.getByLabelText(/category/i).value).toMatch(/backend/i);
      expect(screen.getByLabelText(/level/i).value).toBe("1");
    });
  });

  describe("Custom data scenarios", () => {
    it("handles skill with no activities", async () => {
      seedActivities([
        {
          id: "act-001",
          skill_id: "skill-java",
          activity_type: "learning",
          duration_minutes: 60,
          logged_at: "2025-01-01T00:00:00Z",
        },
      ]);

      routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
      renderSkillDetailPage();

      await waitFor(() => {
        expect(
          screen.queryByTestId("activity-count-badge"),
        ).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(/You haven't logged any activity/i),
      ).toBeInTheDocument();
    });

    it("handles skill with many activities", async () => {
      seedActivities([
        ...defaultActivities.filter((a) => a.skill_id !== SKILL_IDS.REACT),
        {
          id: "act-r1",
          skill_id: SKILL_IDS.REACT,
          activity_type: "learning",
          duration_minutes: 30,
          logged_at: "2025-01-01T00:00:00Z",
        },
        {
          id: "act-r2",
          skill_id: SKILL_IDS.REACT,
          activity_type: "project work",
          duration_minutes: 45,
          logged_at: "2025-01-02T00:00:00Z",
        },
        {
          id: "act-r3",
          skill_id: SKILL_IDS.REACT,
          activity_type: "reading",
          duration_minutes: 60,
          logged_at: "2025-01-03T00:00:00Z",
        },
        {
          id: "act-r4",
          skill_id: SKILL_IDS.REACT,
          activity_type: "coding",
          duration_minutes: 90,
          logged_at: "2025-01-04T00:00:00Z",
        },
        {
          id: "act-r5",
          skill_id: SKILL_IDS.REACT,
          activity_type: "learning",
          duration_minutes: 120,
          logged_at: "2025-01-05T00:00:00Z",
        },
      ]);

      routerDom.useParams.mockReturnValue({ skillId: SKILL_IDS.REACT });
      renderSkillDetailPage();

      await waitFor(() => {
        expect(screen.getByTestId("activity-count-badge")).toHaveTextContent(
          "5",
        );
      });
    });
  });
});

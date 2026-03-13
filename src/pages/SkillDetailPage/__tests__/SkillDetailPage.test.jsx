import { vi } from "vitest";
import * as routerDom from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
    useParams: vi.fn(),
  };
});

import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { server } from "@mocks/server";
import userEvent from "@testing-library/user-event";
import { renderSkillDetailPage } from "./test-utils";
import { MOCK_SKILL_IDS } from "./mockData";
import { resetStore } from "@mocks/handlers";

describe("SkillDetailPage", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    server.resetHandlers();
    resetStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("displays SkillDetailPage with correct skill details including track", async () => {
    routerDom.useParams.mockReturnValue({
      skillId: MOCK_SKILL_IDS.PROJECT_MGMT,
    });

    renderSkillDetailPage(MOCK_SKILL_IDS.PROJECT_MGMT);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /skill: project management/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/level 3/i)).toBeInTheDocument();
    expect(screen.getByText(/category: others/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/track: arc icte/i)).toBeInTheDocument();
    });
  });

  it("opens edition modal filled with current skill data", async () => {
    routerDom.useParams.mockReturnValue({ skillId: MOCK_SKILL_IDS.JAVA });
    renderSkillDetailPage(MOCK_SKILL_IDS.JAVA);

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
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /edit skill/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i).value).toMatch(/java/i);
    expect(screen.getByLabelText(/category/i).value).toMatch(/backend/i);
    expect(screen.getByLabelText(/level/i).value).toBe("1");
  });

  it("opens deletion modal when delete button is clicked", async () => {
    routerDom.useParams.mockReturnValue({ skillId: MOCK_SKILL_IDS.JAVA });
    renderSkillDetailPage(MOCK_SKILL_IDS.JAVA);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /open skill actions/i }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /open skill actions/i }),
    );
    await user.click(screen.getByRole("button", { name: /delete skill/i }));

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /confirm deletion/i }),
    ).toBeInTheDocument();
  });

  it("removes all activities after valid purge confirmation", async () => {
    routerDom.useParams.mockReturnValue({ skillId: MOCK_SKILL_IDS.REACT });
    renderSkillDetailPage(MOCK_SKILL_IDS.REACT);

    await waitFor(() => {
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("2");
    });

    await user.click(
      screen.getByRole("button", { name: /open skill actions/i }),
    );

    await user.click(screen.getByRole("button", { name: /purge activities/i }));

    await user.click(
      screen.getByRole("button", { name: /continue to purge/i }),
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/enter skill name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/enter skill name/i), "React JS");

    await user.click(
      screen.getByRole("button", { name: /purge permanently/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("activity-count-badge"),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/You haven't logged any activity for this skill/i),
    ).toBeInTheDocument();
  });

  describe("SkillActionsMenu", () => {
    beforeEach(async () => {
      routerDom.useParams.mockReturnValue({ skillId: MOCK_SKILL_IDS.REACT });
      renderSkillDetailPage(MOCK_SKILL_IDS.REACT);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /open skill actions/i }),
        ).toBeInTheDocument();
      });
    });

    it("shows skill actions menu when actions button is clicked", async () => {
      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );
      expect(
        screen.getByRole("button", { name: /edit skill/i }),
      ).toBeInTheDocument();
    });

    it("hides skill actions menu when close button is clicked", async () => {
      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /edit skill/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /close actions menu/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /edit skill/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("PurgeActivitiesModal actions", () => {
    beforeEach(async () => {
      routerDom.useParams.mockReturnValue({ skillId: MOCK_SKILL_IDS.REACT });
      renderSkillDetailPage(MOCK_SKILL_IDS.REACT);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /open skill actions/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );
      await user.click(
        screen.getByRole("button", { name: /purge activities/i }),
      );
      await user.click(
        screen.getByRole("button", { name: /continue to purge/i }),
      );

      await waitFor(() => {
        expect(screen.getByTestId("purge-modal-overlay")).toBeInTheDocument();
      });
    });

    it("shows validation error when skill name does not match", async () => {
      await user.type(screen.getByLabelText(/enter skill name/i), "Java");
      await user.click(
        screen.getByRole("button", { name: /purge permanently/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/The skill name does not match. Please try again/i),
        ).toBeInTheDocument();
      });

      const purgeButton = screen.getByRole("button", {
        name: /purge permanently/i,
      });
      expect(purgeButton).toHaveClass("cursor-not-allowed");
      expect(purgeButton).toHaveClass("bg-red-600/50");
    });

    it("shows validation error when skill name is empty", async () => {
      await user.clear(screen.getByLabelText(/enter skill name/i));
      await user.click(
        screen.getByRole("button", { name: /purge permanently/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter the skill name/i),
        ).toBeInTheDocument();
      });

      const purgeButton = screen.getByRole("button", {
        name: /purge permanently/i,
      });
      expect(purgeButton).toHaveClass("cursor-not-allowed");
      expect(purgeButton).toHaveClass("bg-red-600/50");
    });

    it("closes purge modal when clicking outside", async () => {
      expect(screen.getByTestId("purge-modal-overlay")).toBeInTheDocument();
      await user.click(screen.getByTestId("purge-modal-overlay"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("purge-modal-overlay"),
        ).not.toBeInTheDocument();
      });
    });
  });
});

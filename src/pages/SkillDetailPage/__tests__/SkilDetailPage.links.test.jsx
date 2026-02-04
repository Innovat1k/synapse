import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import {
  MOCK_SKILL_IDS,
  mockSkills,
  renderSkillDetailPage,
} from "./test-utils";

import * as skillService from "../../../services/skillService";
import * as skillLinksService from "../../../services/skillLinksService";
import * as activityService from "../../../services/activityService";

// Mocks
vi.mock("../../../services/skillService");
vi.mock("../../../services/skillLinksService");
vi.mock("../../../services/activityService");

// Mock router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ skillId: MOCK_SKILL_IDS.REACT }),
    useOutletContext: () => ({ skills: mockSkills }),
  };
});

const CURRENT_SKILL_ID = MOCK_SKILL_IDS.REACT;

describe("SkillDetailPage : SkillLinksSection", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();

    // Services
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    activityService.fetchActivitiesBySkill.mockResolvedValue([]);
    skillLinksService.checkExistingLinks.mockResolvedValue({
      hasDirectLink: false,
      hasReverseLink: false,
    });
    skillLinksService.fetchIncomingSkillLinks.mockResolvedValue([]);
    skillLinksService.fetchOutgoingSkillLinks.mockResolvedValue([]);
  });

  describe("Link creation", () => {
    it("allows the user to submit a new skill link", async () => {
      skillLinksService.fetchIncomingSkillLinks
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
          {
            id: "link-project-mgmt-support",
            source_skill_id: MOCK_SKILL_IDS.PROJECT_MGMT,
            target_skill_id: CURRENT_SKILL_ID,
            type: "support",
            skill_name: "Project Management",
          },
        ]);

      skillLinksService.createSkillLink.mockResolvedValue({
        id: "link-project-mgmt-support",
        source_skill_id: MOCK_SKILL_IDS.PROJECT_MGMT,
        target_skill_id: CURRENT_SKILL_ID,
        type: "support",
      });

      renderSkillDetailPage(CURRENT_SKILL_ID);

      const addPrereqBtn = await screen.findByRole("button", {
        name: /add a prerequisite/i,
      });

      await user.click(addPrereqBtn);
      await user.click(
        screen.getByRole("button", { name: /project management/i }),
      );
      await user.click(screen.getByRole("button", { name: /support/i }));
      await user.click(
        screen.getByRole("button", { name: /link as support/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /Project Management/i }),
        ).toBeInTheDocument();
        expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
      });

      expect(skillLinksService.createSkillLink).toHaveBeenCalledWith({
        source_skill_id: MOCK_SKILL_IDS.PROJECT_MGMT,
        target_skill_id: CURRENT_SKILL_ID,
        type: "support",
      });
    });

    it("displays an error if the mutation fails", async () => {
      skillLinksService.createSkillLink.mockRejectedValue(
        new Error("Network error"),
      );

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /add a prerequisite/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite/i }),
      );
      await user.click(
        screen.getByRole("button", { name: /project management/i }),
      );
      await user.click(screen.getByRole("button", { name: /support/i }));
      await user.click(
        screen.getByRole("button", { name: /link as support/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to create link. Please try again/i),
        ).toBeInTheDocument();
      });
    });

    it("blocks submission if link already exists", async () => {
      skillLinksService.checkExistingLinks.mockResolvedValue({
        hasDirectLink: true,
      });

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /add a prerequisite/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite/i }),
      );
      await user.click(
        screen.getByRole("button", { name: /project management/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /This connection already exists between these two skills/i,
          ),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: /link as prerequisite/i }),
      ).toBeDisabled();
    });

    it("shows synergy warning if reverse link exists", async () => {
      skillLinksService.checkExistingLinks.mockResolvedValue({
        hasReverseLink: true,
      });

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /add a prerequisite/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite/i }),
      );
      await user.click(screen.getByText("Java").closest("button"));

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /synergy detected/i }),
        ).toBeInTheDocument();
        expect(screen.getByTestId("skills-synergy")).toHaveTextContent(
          /java and react js form a reinforcing loop/i,
        );
      });
    });
  });

  describe("Link deletion", () => {
    it("allows user to confirm and remove a link", async () => {
      const existingLink = {
        id: "link-javascript-prereq",
        source_skill_id: MOCK_SKILL_IDS.JAVA,
        target_skill_id: CURRENT_SKILL_ID,
        type: "prerequisite",
        skill_name: "Java",
      };

      skillLinksService.fetchIncomingSkillLinks
        .mockResolvedValueOnce([existingLink])
        .mockResolvedValueOnce([]);

      skillLinksService.deleteSkillLink.mockResolvedValue(undefined);

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /Java/i })).toBeInTheDocument();
      });

      await user.hover(screen.getByRole("link", { name: /Java/i }));
      await user.click(
        screen.getByRole("button", { name: /remove link to java/i }),
      );

      await user.click(screen.getByRole("button", { name: /sever!/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("link", { name: /Java/i }),
        ).not.toBeInTheDocument();
      });

      expect(skillLinksService.deleteSkillLink).toHaveBeenCalledWith(
        "link-javascript-prereq",
      );
    });

    it("keeps the link if deletion fails", async () => {
      const existingLink = {
        id: "link-java-prereq",
        source_skill_id: MOCK_SKILL_IDS.JAVA,
        target_skill_id: CURRENT_SKILL_ID,
        type: "prerequisite",
        skill_name: "Java",
      };

      skillLinksService.fetchIncomingSkillLinks.mockResolvedValue([
        existingLink,
      ]);
      skillLinksService.deleteSkillLink.mockRejectedValue(
        new Error("Network error"),
      );

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /Java/i })).toBeInTheDocument();
      });

      await user.hover(screen.getByRole("link", { name: /Java/i }));
      await user.click(
        screen.getByRole("button", { name: /remove link to java/i }),
      );
      await user.click(screen.getByRole("button", { name: /sever!/i }));

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /Java/i })).toBeInTheDocument();
      });
    });

    it("keeps the link if user cancels deletion", async () => {
      const existingLink = {
        id: "link-java-prereq",
        source_skill_id: MOCK_SKILL_IDS.JAVA,
        target_skill_id: CURRENT_SKILL_ID,
        type: "prerequisite",
        skill_name: "Java",
      };

      skillLinksService.fetchIncomingSkillLinks.mockResolvedValue([
        existingLink,
      ]);

      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /Java/i })).toBeInTheDocument();
      });

      await user.hover(screen.getByRole("link", { name: /Java/i }));
      await user.click(
        screen.getByRole("button", { name: /remove link to java/i }),
      );

      await user.click(screen.getByRole("button", { name: /keep link/i }));

      expect(screen.getByRole("link", { name: /Java/i })).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", { name: /sever/i }),
      ).not.toBeInTheDocument();
    });
  });
});

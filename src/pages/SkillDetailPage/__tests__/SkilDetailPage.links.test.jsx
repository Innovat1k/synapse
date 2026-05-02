import { screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MOCK_SKILL_IDS, renderSkillDetailPage } from "./test-utils";
import {
  clearActivities,
  clearSkillLinks,
  skillsStore,
  TEST_USER_ID,
} from "@mocks/stores";
import { http, HttpResponse } from "msw";
import { server } from "@mocks/server";
import { SUPABASE_URL } from "@services/supabase-client";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ skillId: MOCK_SKILL_IDS.REACT }),
    useOutletContext: () => ({ skills: skillsStore }),
  };
});

const CURRENT_SKILL_ID = MOCK_SKILL_IDS.REACT;

describe("SkillDetailPage : SkillLinksSection", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    clearActivities();
  });

  describe("Link creation", () => {
    it("allows the user to submit a new skill link", async () => {
      clearSkillLinks();
      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByText(/No prerequisites defined yet/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/This skill doesn't unlock anything yet/i),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", {
          name: /add a prerequisite/i,
        }),
      );

      await user.click(await screen.findByRole("button", { name: /java/i }));
      await user.click(screen.getByRole("button", { name: /support/i }));
      await user.click(
        screen.getByRole("button", { name: /link as support/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole("link", { name: /java/i })).toBeInTheDocument();
        expect(
          screen.queryByTestId("skill-linker-modal-content"),
        ).not.toBeInTheDocument();
      });
    }, 10000);

    it("displays an error if the mutation fails", async () => {
      clearSkillLinks();
      server.use(
        http.post(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, () => {
          return HttpResponse.json(
            { error: "Network error", message: "Failed to create link" },
            { status: 500 },
          );
        }),
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
      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByRole("link", { name: /project/i }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite/i }),
      );
      await user.click(
        within(screen.getByTestId("skill-linker-modal-content")).getByRole(
          "button",
          { name: /project management/i },
        ),
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /This connection already exists between these two skills/i,
          ),
        ).toBeInTheDocument();
      });
    });

    it("shows synergy warning if reverse link exists and allows user to create that link", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByRole("link", { name: /project/i }),
      ).toBeInTheDocument();

      await user.click(
        await screen.findByRole("button", {
          name: /add a skill this unlocks/i,
        }),
      );
      await user.click(
        within(screen.getByTestId("skill-linker-modal-content")).getByRole(
          "button",
          { name: /project management/i },
        ),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /synergy detected/i }),
        ).toBeInTheDocument();
        expect(screen.getByTestId("skills-synergy")).toHaveTextContent(
          /project management and react js form a reinforcing loop/i,
        );
      });
    });
  });

  describe("Link deletion", () => {
    it("allows user to confirm and remove a link", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByRole("link", { name: /project management/i }),
      ).toBeInTheDocument();

      await user.hover(
        screen.getByRole("link", { name: /project management/i }),
      );
      await user.click(
        screen.getByRole("button", {
          name: /remove link to project management/i,
        }),
      );

      expect(screen.getByTestId("action-description")).toHaveTextContent(
        /ready to remove the link between project management and react js/i,
      );

      await user.click(screen.getByRole("button", { name: /sever!/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("link", { name: /project management/i }),
        ).not.toBeInTheDocument();
        expect(
          screen.getByText(/No prerequisites defined yet/i),
        ).toBeInTheDocument();
      });
    });

    it("keeps the link if deletion fails", async () => {
      server.use(
        http.delete(`${SUPABASE_URL}/rest/v1/synapse_skill_links`, () => {
          return HttpResponse.json(
            { error: "Network error", message: "Failed to delete link" },
            { status: 500 },
          );
        }),
      );

      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByRole("link", { name: /project management/i }),
      ).toBeInTheDocument();

      await user.hover(
        screen.getByRole("link", { name: /project management/i }),
      );
      await user.click(
        screen.getByRole("button", {
          name: /remove link to project management/i,
        }),
      );
      await user.click(screen.getByRole("button", { name: /sever!/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /project management/i }),
        ).toBeInTheDocument();
      });
    });

    it("keeps the link if user cancels deletion", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /project management/i }),
        ).toBeInTheDocument();
      });

      await user.hover(
        screen.getByRole("link", { name: /project management/i }),
      );
      await user.click(
        screen.getByRole("button", {
          name: /remove link to project management/i,
        }),
      );

      await user.click(screen.getByRole("button", { name: /keep link/i }));

      expect(
        screen.getByRole("link", { name: /project management/i }),
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /sever/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Link deletion on Mobile", () => {
    it("removes link between skills by Edit menu", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      expect(
        await screen.findByRole("link", { name: /project management/i }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /edit/i }));

      const removeLinkBtn = screen.getByRole("button", {
        name: /remove link to project management/i,
      });
      expect(removeLinkBtn).toBeInTheDocument();

      await user.click(removeLinkBtn);
      expect(screen.getByTestId("action-description")).toHaveTextContent(
        /ready to remove the link between project management and react js/i,
      );

      await user.click(screen.getByRole("button", { name: /sever!/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("link", { name: /project management/i }),
        ).not.toBeInTheDocument();
        expect(
          screen.getByText(/No prerequisites defined yet/i),
        ).toBeInTheDocument();
      });
    });
  });
});

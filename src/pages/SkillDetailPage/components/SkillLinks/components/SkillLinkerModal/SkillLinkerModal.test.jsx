import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import { SkillLinkerModal } from "./SkillLinkerModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as skillService from "../../../../../../services/skillService";
import userEvent from "@testing-library/user-event";
import * as skillLinkService from "../../../../../../services/skillLinksService";
import { createDeferredPromise } from "../../../../../../shared/utils/utils";

vi.mock("../../../../../../services/skillService");
vi.mock("../../../../../../services/skillLinksService");

const mockSkills = [
  { name: "javascript", skill_id: "skill-a" },
  { name: "react js", skill_id: "skill-b" },
  { name: "node js", skill_id: "skill-c" },
];

describe("SkillLinkerModal", () => {
  let client;
  let QueryWrapper;

  beforeEach(() => {
    client = new QueryClient();
    QueryWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  });

  const renderComponent = ({
    mode,
    currentSkillId = "skill-b",
    currentSkillName = "react js",
    onClose = vi.fn(),
  }) => {
    render(
      <SkillLinkerModal
        isOpened={true}
        mode={mode}
        currentSkillId={currentSkillId}
        currentSkillName={currentSkillName}
        onClose={onClose}
      />,
      {
        wrapper: QueryWrapper,
      },
    );
  };

  describe("Rendering", () => {
    it("displays correct title and controls for incoming mode", () => {
      renderComponent({ mode: "incoming" });

      expect(
        screen.getByRole("heading", {
          name: /Add a prerequisite for react js/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/search skills/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /cancel/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /link as prerequisite/i,
        }),
      ).toBeInTheDocument();
    });

    it("displays correct title and controls for outgoing mode", () => {
      renderComponent({ mode: "outgoing" });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/search skills/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /cancel/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /link as prerequisite/i,
        }),
      ).toBeInTheDocument();
    });

    it("displays all available skill except the current one in the linkable list", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);
      renderComponent({ mode: "outgoing", currentSkillId: "skill-b" });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });
      expect(
        screen.getByRole("button", { name: /node js/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /react js/i }),
      ).not.toBeInTheDocument();
    });

    it("shows 'No skills found' when no skills are available", () => {
      renderComponent({ mode: "outgoing" });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/No skills found/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it("filters skills list while typing in the search input", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);
      renderComponent({ mode: "outgoing" });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/search skills/i), "node");

      expect(
        screen.getByRole("button", { name: /node js/i }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("button", { name: /react js/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /javascript/i }),
      ).not.toBeInTheDocument();
    });

    it("updates connection type and description when switching between prerequisite and support", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);
      skillLinkService.checkExistingLinks.mockResolvedValue({
        hasDirectLink: false,
        hasReverseLink: false,
      });

      renderComponent({ mode: "outgoing", currentSkillId: "skill-b" });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /node js/i }));

      expect(
        screen.getByRole("button", { name: /link as prerequisite/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Essential foundation required before this skill/i),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /support/i }));

      expect(
        screen.getByText(/Helpful but optional to master this skill/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /link as support/i }),
      ).toBeInTheDocument();
    });

    it("calls onClose if X button is clicked", async () => {
      const mockOnClose = vi.fn();
      skillService.fetchSkills.mockResolvedValue([]);

      renderComponent({
        mode: "outgoing",
        currentSkillId: "skill-b",
        onClose: mockOnClose,
      });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close modal/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("shows loading indicator while checking for existing links", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);

      const deffered = createDeferredPromise();
      skillLinkService.checkExistingLinks.mockResolvedValue(deffered.promise);

      renderComponent({ mode: "outgoing", currentSkillId: "skill-b" });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /node js/i }));

      const loader = screen.getByLabelText(/loading/i);
      expect(loader).toBeInTheDocument();
      expect(loader).toHaveTextContent("Checking for conflicts…");
    });

    it("displays error message if selected skill is already linked in the same direction", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);
      skillLinkService.checkExistingLinks.mockResolvedValue({
        hasDirectLink: true,
      });

      renderComponent({ mode: "outgoing", currentSkillId: "skill-b" });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /node js/i }));

      expect(
        screen.getByText(
          /This connection already exists between these two skills. Select another skill/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /link as prerequisite/i }),
      ).toBeDisabled();
    });

    it("shows synergy warning when a reverse link exists", async () => {
      skillService.fetchSkills.mockResolvedValue(mockSkills);
      skillLinkService.checkExistingLinks.mockResolvedValue({
        hasReverseLink: true,
      });

      renderComponent({ mode: "outgoing", currentSkillId: "skill-b" });

      expect(
        screen.getByRole("heading", {
          name: /Add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /javascript/i }),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: /node js/i }));

      expect(
        screen.getByRole("heading", { name: /synergy detected/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /confirm synergy/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("skills-synergy")).toHaveTextContent(
        "node js and react js form a reinforcing loop. They are best learned together.",
      );
    });

    it("disables connect button when no skill is selected", async () => {
      render(<SkillLinkerModal isOpened={true} mode="outgoing" />, {
        wrapper: QueryWrapper,
      });
      expect(
        screen.getByRole("button", { name: /link as prerequisite/i }),
      ).toBeDisabled();
    });
  });
});

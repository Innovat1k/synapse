import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkillLinksSection } from "./SkillLinksSection";
import * as useSkillLinksModule from "./hooks/useSkillLinks";
import userEvent from "@testing-library/user-event";

vi.mock("./hooks/useSkillLinks");

const mockSkill = { name: "React JS" };

describe("SkillLinksSection", () => {
  let client;
  let QueryWrapper;
  let user;

  beforeEach(() => {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    QueryWrapper = ({ children }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );

    user = userEvent.setup();

    useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  const renderComponent = () => {
    render(<SkillLinksSection skillId="skill-123" skill={mockSkill} />, {
      wrapper: QueryWrapper,
    });
  };

  useSkillLinksModule.useCreateSkillLink.mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  useSkillLinksModule.useDeleteSkillLink.mockReturnValue({ isPending: false });

  describe("Incoming Skill Links", () => {
    it("renders skeleton while loading", () => {
      useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderComponent();

      expect(screen.getByTestId("skill-links-skeleton")).toBeInTheDocument();
      0;
    });

    it("renders nothing when there is an error", () => {
      useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({
        data: undefined,
        isError: true,
      });
      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({ data: [] });

      renderComponent();

      expect(screen.queryByText("Skill Connections")).not.toBeInTheDocument();
    });

    it("renders nothing and shows fallback message when incoming links are empty", () => {
      useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({ data: [] });
      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({ data: [] });

      renderComponent();

      expect(screen.getByText(/no prerequisites defined/i)).toBeInTheDocument();
    });

    it("renders incoming links correctly for prerequisite and complementary types", () => {
      const mockLinks = [
        {
          id: "link-1",
          source_skill_id: "skill-a",
          skill_name: "JavaScript Fundamentals",
          type: "prerequisite",
        },
        {
          id: "link-2",
          source_skill_id: "skill-b",
          skill_name: "CSS Layout",
          type: "complementary",
        },
      ];

      useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({
        data: mockLinks,
        isLoading: false,
      });

      renderComponent();

      expect(
        screen.getByRole("heading", { name: /Skill Connections/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Required to Master/i }),
      ).toBeInTheDocument();

      const prerequisiteLink = screen.getByRole("link", {
        name: /JavaScript Fundamentals, prerequisite/i,
      });

      const complementaryLink = screen.getByRole("link", {
        name: /CSS Layout, complementary/i,
      });

      expect(prerequisiteLink).toBeInTheDocument();
      expect(complementaryLink).toBeInTheDocument();
      expect(prerequisiteLink).toHaveAttribute("href", "/skills/skill-a");
      expect(complementaryLink).toHaveAttribute("href", "/skills/skill-b");
    });

    it("opens the creation modal for incoming links", async () => {
      renderComponent();

      expect(
        screen.getByRole("heading", { name: /Required to Master/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/No prerequisites defined yet/i),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite skill/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: /add a prerequisite for react js/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/search skills/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /link as .../i }),
      ).toBeInTheDocument();
    });

    it("closes modal when 'Close' button is clicked", async () => {
      renderComponent();

      expect(
        screen.getByRole("heading", { name: /Required to Master/i }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /add a prerequisite skill/i }),
      );
      expect(
        screen.getByRole("heading", {
          name: /add a prerequisite for react js/i,
        }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /close modal/i }));

      await waitFor(() => {
        expect(
          screen.queryByTestId("skill-linker-modal-content"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("heading", {
            name: /add a prerequisite for react js/i,
          }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Outgoing Skill Links", () => {
    it("renders nothing when there is an error", () => {
      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({
        data: undefined,
        isError: true,
      });

      useSkillLinksModule.useIncomingSkillLinks.mockReturnValue({
        data: undefined,
        isError: true,
      });

      renderComponent();

      expect(screen.queryByText("Enables mastery of")).not.toBeInTheDocument();
    });

    it("renders nothing and shows fallback message when outgoing links are empty", () => {
      renderComponent();

      expect(
        screen.getByText(/this skill doesn't unlock anything/i),
      ).toBeInTheDocument();
    });

    it("renders outgoing links correctly for prerequisite and complementary types", async () => {
      const mockLinks = [
        {
          id: "link-1",
          target_skill_id: "skill-a",
          skill_name: "JavaScript Fundamentals",
          type: "prerequisite",
        },
        {
          id: "link-2",
          target_skill_id: "skill-b",
          skill_name: "CSS Layout",
          type: "complementary",
        },
      ];

      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({
        data: mockLinks,
      });

      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /Skill Connections/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("heading", { name: /enables mastery of/i }),
        ).toBeInTheDocument();
      });

      const prerequisiteLink = screen.getByRole("link", {
        name: /JavaScript Fundamentals, prerequisite/i,
      });

      const complementaryLink = screen.getByRole("link", {
        name: /CSS Layout, complementary/i,
      });

      expect(prerequisiteLink).toBeInTheDocument();
      expect(complementaryLink).toBeInTheDocument();
      expect(prerequisiteLink).toHaveAttribute("href", "/skills/skill-a");
      expect(complementaryLink).toHaveAttribute("href", "/skills/skill-b");
    });

    it("opens the creation modal for outgoing links", async () => {
      renderComponent();

      expect(
        screen.getByRole("heading", { name: /enables mastery of/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this skill doesn't unlock anything yet./i),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /add a skill this unlocks/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: /add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/search skills/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /link as .../i }),
      ).toBeInTheDocument();
    });

    it("closes the modal if 'Cancel' button is clicked", async () => {
      renderComponent();

      expect(
        screen.getByRole("heading", { name: /enables mastery of/i }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /add a skill this unlocks/i }),
      );
      expect(
        screen.getByRole("heading", {
          name: /add a skill unlocked by react js/i,
        }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", {
            name: /add a skill unlocked by react js/i,
          }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", {
            name: /link as .../i,
          }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Editing skills links", () => {
    it("switches to editing mode if 'Edit' button is clicked", async () => {
      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({
        data: [
          { id: "skill-a-1", type: "support", skill_name: "Digital painting" },
        ],
        isLoading: false,
      });
      renderComponent();

      expect(
        screen.getByRole("link", { name: /digital painting/i }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(
        screen.getByRole("button", {
          name: /Remove link to Digital painting/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /remove link to digital painting/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: /Exit edit mode to add prerequisite links/i,
        }),
      ).toBeDisabled();
      expect(
        screen.getByRole("button", {
          name: /Exit edit mode to add outgoing skill links/i,
        }),
      ).toBeDisabled();
    });

    it("exits edit mode when 'Done' is clicked", async () => {
      useSkillLinksModule.useOutgoingSkillLinks.mockReturnValue({
        data: [
          { id: "skill-a-1", type: "support", skill_name: "Digital painting" },
        ],
        isLoading: false,
      });
      renderComponent();

      expect(
        screen.getByRole("link", { name: /digital painting/i }),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /edit/i }));

      expect(
        screen.getByRole("button", {
          name: /remove link to digital painting/i,
        }),
      ).toBeInTheDocument();

      const doneEditingBtn = screen.getByRole("button", { name: /done/i });
      expect(doneEditingBtn).toBeInTheDocument();

      await user.click(doneEditingBtn);

      expect(
        screen.getByRole("link", { name: /digital painting/i }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("button", {
          name: /done/i,
        }),
      ).not.toBeInTheDocument();
    });

    it("disables 'Edit' button when no links are present", async () => {
      renderComponent();

      expect(
        screen.getByText(/No prerequisites defined yet/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This skill doesn't unlock anything yet/i),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /edit/i })).toBeDisabled();
    });
  });
});

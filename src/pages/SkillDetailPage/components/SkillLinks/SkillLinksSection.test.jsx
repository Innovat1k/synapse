import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkillLinksSection } from "./SkillLinksSection";
import * as useSkillLinksModule from "./hooks/useSkillLinks";

vi.mock("./hooks/useSkillLinks");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

const useHookFactory = (hook, { data, isLoading = false, isError = false }) => {
  hook.mockReturnValue({ data, isLoading, isError });
};

describe("SkillLinksSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Incoming Skill Links", () => {
    it("renders skeleton while loading", () => {
      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, {
        data: undefined,
        isLoading: true,
      });

      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, {
        data: [],
      });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      expect(screen.getByTestId("skill-links-skeleton")).toBeInTheDocument();
    });

    it("renders nothing when there is an error", () => {
      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, {
        data: undefined,
        isError: true,
      });
      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, { data: [] });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      expect(screen.queryByText("Skill Connections")).not.toBeInTheDocument();
    });

    it("renders nothing and shows fallback message when incoming links are empty", () => {
      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, { data: [] });
      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, { data: [] });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

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

      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, {
        data: mockLinks,
      });

      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, {
        data: undefined,
        isLoading: true,
      });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      expect(
        screen.getByRole("heading", { name: /Skill Connections/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /Required to Master/i })
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
  });

  describe("Outgoing Skill Links", () => {
    it("renders nothing when there is an error", () => {
      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, {
        data: undefined,
        isError: true,
      });

      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, {
        data: undefined,
        isError: true,
      });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      expect(screen.queryByText("Enables mastery of")).not.toBeInTheDocument();
    });

    it("renders nothing and shows fallback message when outgoing links are empty", () => {
      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, { data: [] });
      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, { data: [] });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      expect(
        screen.getByText(/this skill doesn't unlock anything/i)
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

      useHookFactory(useSkillLinksModule.useIncomingSkillLinks, {
        data: [],
      });

      useHookFactory(useSkillLinksModule.useOutgoingSkillLinks, {
        data: mockLinks,
      });

      renderWithProviders(<SkillLinksSection skillId="skill-123" />);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /Skill Connections/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("heading", { name: /enables mastery of/i })
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
  });
});

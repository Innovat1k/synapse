import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkillLinksSection } from "./SkillLinksSection";
import * as useSynapseLinksModule from "./hooks/useSkillLinks";

vi.mock("./hooks/useSynapseLinks");

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

describe("SkillLinksSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skeleton while loading", () => {
    useSynapseLinksModule.useIncomingSkillLinks.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<SkillLinksSection skillId="skill-123" />);

    expect(screen.getByTestId("skill-links-skeleton")).toBeInTheDocument();
  });

  it("renders nothing when there is an error", () => {
    useSynapseLinksModule.useIncomingSkillLinks.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<SkillLinksSection skillId="skill-123" />);

    expect(screen.queryByText("Skill Connections")).not.toBeInTheDocument();
  });

  it("renders nothing when incoming links are empty", () => {
    useSynapseLinksModule.useIncomingSkillLinks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<SkillLinksSection skillId="skill-123" />);

    expect(screen.queryByText("Skill Connections")).not.toBeInTheDocument();
  });

  it("renders incoming links correctly for prerequisite and support types", () => {
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
        type: "support",
      },
    ];

    useSynapseLinksModule.useIncomingSkillLinks.mockReturnValue({
      data: mockLinks,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<SkillLinksSection skillId="skill-123" />);

    expect(screen.getByText("Skill Connections")).toBeInTheDocument();
    expect(screen.getByText("Required to Master")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "JavaScript Fundamentals, prerequisite",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "CSS Layout, support" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "JavaScript Fundamentals, prerequisite",
      })
    ).toHaveAttribute("href", "/skills/skill-a");
    expect(
      screen.getByRole("link", { name: "CSS Layout, support" })
    ).toHaveAttribute("href", "/skills/skill-b");
  });
});

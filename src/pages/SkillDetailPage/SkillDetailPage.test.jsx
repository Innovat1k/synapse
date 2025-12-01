import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import SkillDetailPage from "./SkillDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useOutletContext, useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("../../services/skillService");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useOutletContext: vi.fn(), useParams: vi.fn() };
});

const mockSkills = [
  {
    name: "React JS",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: "550e8400-e29b-41d4-a716-446655440002",
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Project Management",
    skill_id: "123e4567-e89b-12d3-a456-426614174000",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

describe("SkillDetailPage", () => {
  let queryClient;
  let Wrapper;
  let user;

  beforeEach(() => {
    queryClient = new QueryClient();
    Wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
    user = userEvent.setup();
  });

  it("displays SkillDetailPage with correct skill details", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "123e4567-e89b-12d3-a456-426614174000",
    });
    render(<SkillDetailPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /skill: project management/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/level 3/i)).toBeInTheDocument();
    expect(screen.getByText(/category: others/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Managing small agile projects and coordinating tasks/i)
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("skill-tags-container")).getByText(
        /organization/i
      )
    ).toBeInTheDocument();
  });

  it("opens edition modal filled with current skill data when update button is clicked", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440002",
    });
    render(<SkillDetailPage />, { wrapper: Wrapper });

    await user.click(
      screen.getByRole("button", { name: /open actions menu/i })
    );

    await user.click(screen.getByRole("button", { name: /edit java skill/i }));

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /edit skill/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i).value).toMatch(/java/i);
    expect(screen.getByLabelText(/category/i).value).toMatch(/backend/i);
    expect(screen.getByLabelText(/level/i).value).toBe("1");
    expect(screen.getByLabelText(/description/i).value).toMatch(
      /exploring the fundamentals of Java development/i
    );
    expect(
      within(screen.getByTestId("skill-tags")).getByText(/programming/i)
    ).toBeInTheDocument();
  });

  it("opens deletion modal when for the current skill if delete button is clicked", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440002",
    });
    render(<SkillDetailPage />, { wrapper: Wrapper });

    await user.click(
      screen.getByRole("button", { name: /open actions menu/i })
    );

    await user.click(
      screen.getByRole("button", { name: /delete java skill/i })
    );

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /confirm deletion/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/are you sure/i)).toHaveTextContent(
      /delete\s+"java"\s*\?/i
    );

    expect(
      screen.getByRole("button", { name: /delete permanently/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /keep it/i })
    ).toBeInTheDocument();
  });

  it("allows to add new tag when editing a skill", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440001",
    });
    render(<SkillDetailPage />, { wrapper: Wrapper });

    await user.click(
      screen.getByRole("button", { name: /open actions menu/i })
    );

    await user.click(
      screen.getByRole("button", { name: /edit react js skill/i })
    );

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    const tag_input = screen.getByLabelText(/tags/i);
    await user.type(tag_input, "oop");
    expect(tag_input).toHaveValue("oop");

    await user.click(screen.getByRole("button", { name: /add tag/i }));
    expect(
      within(screen.getByTestId("skill-tags")).getByText(/oop/i)
    ).toBeInTheDocument();
  });

  it("allows to remove existing tag when editing a skill", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440001",
    });
    render(<SkillDetailPage />, { wrapper: Wrapper });

    await user.click(
      screen.getByRole("button", { name: /open actions menu/i })
    );

    await user.click(
      screen.getByRole("button", { name: /edit react js skill/i })
    );

    await waitFor(() => {
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
    });

    expect(
      within(screen.getByTestId("skill-tags")).getByText(/programming/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /remove programming tag/i })
    );

    expect(
      within(screen.getByTestId("skill-tags")).queryByText(/programming/i)
    ).not.toBeInTheDocument();
  });
});

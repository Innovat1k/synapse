import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import SkillDetailPage from "./SkillDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useOutletContext, useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import * as activityService from "../../services/activityService";

vi.mock("../../services/skillService");
vi.mock("../../services/activityService");
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

const mockActivities = [
  {
    id: "8a1f2d3e-4c5b-4a9e-9c1a-111111111111",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    activity_type: "learning",
    logged_at: "2025-01-08T18:00",
    duration_minutes: 150,
    notes: "Completed a React JS module on hooks (useState, useEffect).",
  },
  {
    id: "9b2e3f4a-5d6c-4b8f-a2e3-222222222222",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    activity_type: "project work",
    logged_at: "2025-01-11T14:00",
    duration_minutes: 210,
    notes:
      "Developed a small React project: dashboard with components, props, and state management.",
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
      screen.getByRole("button", { name: /open skill actions/i })
    );

    await user.click(screen.getByRole("button", { name: /edit skill/i }));

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
      screen.getByRole("button", { name: /open skill actions/i })
    );

    await user.click(screen.getByRole("button", { name: /delete skill/i }));

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

  it("removes all activities for the skill after valid purge confirmation", async () => {
    vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
    vi.mocked(useParams).mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440001",
    });

    vi.mocked(activityService.fetchActivitiesBySkill)
      .mockResolvedValueOnce(mockActivities)
      .mockResolvedValueOnce([]);

    vi.mocked(activityService.purgeActivitiesBySkill).mockResolvedValue([]);

    render(<SkillDetailPage />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { level: 1, name: /skill: react js/i })
    ).toBeInTheDocument();

    const skillActivities = within(
      await screen.findByTestId("list-layout-desktop")
    );

    const activity = skillActivities.getByTestId(
      "activity-row-8a1f2d3e-4c5b-4a9e-9c1a-111111111111"
    );

    expect(within(activity).getByText(/January 8, 2025/i)).toBeInTheDocument();
    expect(within(activity).getByText(/2 h 30 mn/i)).toBeInTheDocument();
    expect(within(activity).getByText(/learning/i)).toBeInTheDocument();
    expect(
      within(activity).getByText(
        /Completed a React JS module on hooks \(useState, useEffect\)/i
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("2");

    await user.click(
      screen.getByRole("button", { name: /open skill actions/i })
    );
    await user.click(screen.getByRole("button", { name: /purge activities/i }));

    expect(
      screen.getByRole("heading", { name: /irreversible purge confirmation/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /continue to purge/i })
    );

    expect(
      screen.getByRole("heading", { name: /confirm skill name/i })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/enter skill name/i), "React JS");
    await user.click(
      screen.getByRole("button", { name: /purge permanently/i })
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("purge-modal-overlay")
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByTestId("activity-count-badge")
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/You haven't logged any activity for this skill/i)
    ).toBeInTheDocument();
  });

  describe("SkillActionsMenu", () => {
    const setup = () => {
      vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
      vi.mocked(useParams).mockReturnValue({
        skillId: "550e8400-e29b-41d4-a716-446655440001",
      });

      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue(
        mockActivities
      );
      

      render(<SkillDetailPage />, { wrapper: Wrapper });
    };

    it("shows skill actions menu when the actions button is clicked", async () => {
      setup();

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i })
      );

      expect(
        screen.getByRole("button", { name: /edit skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /delete skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /purge activities/i })
      ).toBeInTheDocument();
    });

    it("hides skill actions menu when the close (X) button is clicked", async () => {
      setup();

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i })
      );

      expect(
        screen.getByRole("button", { name: /edit skill/i })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /close actions menu/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /edit skill/i })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /delete skill/i })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /purge activities/i })
        ).not.toBeInTheDocument();
      });
      expect(
        screen.getByRole("button", { name: /open skill actions/i })
      ).toBeInTheDocument();
    });
  });

  describe("PurgeActivitiesModal actions", () => {
    it("shows validation error when skill name does not match during purge confirmation", async () => {
      vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
      vi.mocked(useParams).mockReturnValue({
        skillId: "550e8400-e29b-41d4-a716-446655440001",
      });

      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue(
        mockActivities
      );

      render(<SkillDetailPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          within(screen.getByTestId("list-layout-desktop")).getByTestId(
            "activity-row-8a1f2d3e-4c5b-4a9e-9c1a-111111111111"
          )
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i })
      );
      await user.click(
        screen.getByRole("button", { name: /purge activities/i })
      );

      expect(
        screen.getByRole("heading", {
          name: /irreversible purge confirmation/i,
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /continue to purge/i })
      );

      expect(
        screen.getByRole("heading", { name: /confirm skill name/i })
      ).toBeInTheDocument();

      await user.type(screen.getByLabelText(/enter skill name/i), "Java");
      await user.click(
        screen.getByRole("button", { name: /purge permanently/i })
      );

      expect(
        screen.getByText(/The skill name does not match. Please try again/i)
      ).toBeInTheDocument();
    });

    it("shows validation error when skill name is empty during purge confirmation", async () => {
      vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
      vi.mocked(useParams).mockReturnValue({
        skillId: "550e8400-e29b-41d4-a716-446655440001",
      });

      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue(
        mockActivities
      );

      render(<SkillDetailPage />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(
          within(screen.getByTestId("list-layout-desktop")).getByTestId(
            "activity-row-8a1f2d3e-4c5b-4a9e-9c1a-111111111111"
          )
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i })
      );
      await user.click(
        screen.getByRole("button", { name: /purge activities/i })
      );

      expect(
        screen.getByRole("heading", {
          name: /irreversible purge confirmation/i,
        })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /continue to purge/i })
      );

      expect(
        screen.getByRole("heading", { name: /confirm skill name/i })
      ).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/enter skill name/i));
      await user.click(
        screen.getByRole("button", { name: /purge permanently/i })
      );

      expect(
        screen.getByText(/Please enter the skill name/i)
      ).toBeInTheDocument();
    });

    it("closes purge confirmation modal when clicking outside the modal content (on overlay)", async () => {
      vi.mocked(useOutletContext).mockReturnValue({ skills: mockSkills });
      vi.mocked(useParams).mockReturnValue({
        skillId: "550e8400-e29b-41d4-a716-446655440001",
      });
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue(
        mockActivities
      );

      render(<SkillDetailPage />, { wrapper: Wrapper });

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i })
      );
      await user.click(
        screen.getByRole("button", { name: /purge activities/i })
      );

      expect(screen.getByTestId("purge-modal-overlay")).toBeInTheDocument();

      await user.click(screen.getByTestId("purge-modal-overlay"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("purge-modal-overlay")
        ).not.toBeInTheDocument();
      });
    });
  });
});

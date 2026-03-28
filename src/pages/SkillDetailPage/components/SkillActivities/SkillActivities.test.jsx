import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import SkillActivities from "./SkillActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import * as activityService from "@services/activityService";

vi.mock("@services/activityService");

const mockSkills = [
  {
    name: "JavaScript",
    skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
    category: "Programming",
    level: 4,
    tags: ["frontend", "web", "scripting"],
    description: "Strong understanding of JavaScript for web development.",
  },
  {
    name: "Project Management",
    skill_id: "c9b1c212-4fd0-41a8-b5d9-6c39a9bb21b3",
    category: "Management",
    level: 3,
    tags: ["organization", "leadership", "planning"],
    description:
      "Experience managing teams and coordinating project timelines.",
  },
];

const mockActivity = {
  id: "n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33",
  skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
  activity_type: "project work",
  logged_at: "2025-04-12T14:10:00Z",
  notes: "Built reusable UI components and improved frontend responsiveness.",
  duration_minutes: 77,
};

describe("SkillActivities", () => {
  let client;
  let user;
  let Wrapper;

  beforeEach(() => {
    client = new QueryClient();
    user = userEvent.setup();
    Wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    activityService.fetchActivitiesBySkill.mockResolvedValue([]);
  });

  describe("Rendering", () => {
    it("displays activities component and list correctly", async () => {
      activityService.fetchActivitiesBySkill.mockResolvedValue([mockActivity]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop"),
      );

      expect(desktop_layout.getByText(/April 12, 2025/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/1 h 17 mn/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/project work/i)).toBeInTheDocument();
      expect(
        desktop_layout.getByText(
          /Built reusable UI components and improved frontend responsiveness./i,
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    });

    it("renders activity count badge when activities exist", async () => {
      activityService.fetchActivitiesBySkill.mockResolvedValue([mockActivity]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(await screen.findByText("1")).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    });

    it("does not render activity count badge when no activities", () => {
      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(screen.queryByText(/0|activities/i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/You haven't logged any activity/i),
      ).toBeInTheDocument();
    });

    it("disables the skill selector when creating activity", async () => {
      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(
        await screen.findByText(
          /You haven't logged any activity for this skill/i,
        ),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /log activity/i }));

      expect(
        await screen.findByRole("heading", { name: /log activity/i }),
      ).toBeInTheDocument();

      const skill_selector = screen.getByLabelText(/skill/i);
      expect(skill_selector).toHaveAttribute("aria-readonly");
    });
  });
});

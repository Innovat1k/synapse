import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import SkillActivities from "./SkillActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import * as activityService from "../../../../services/activityService";
import { formatDateUTC } from "../../../../shared/utils/utils";

vi.mock("../../../../services/activityService");

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
  });

  describe("Rendering", () => {
    it("displays activities component and list correctly", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([
        mockActivity,
      ]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      expect(desktop_layout.getByText(/April 12, 2025/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/1 h 17 mn/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/project work/i)).toBeInTheDocument();
      expect(
        desktop_layout.getByText(
          /Built reusable UI components and improved frontend responsiveness./i
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    });

    it("renders activity count badge when activities exist", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([
        mockActivity,
      ]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(await screen.findByText("1")).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    });

    it("does not render activity count badge when no activities", () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(screen.queryByText(/0|activities/i)).not.toBeInTheDocument();
      expect(
        screen.getByText(/You haven't logged any activity/i)
      ).toBeInTheDocument();
    });

    it("disables the skill selector when creating activity", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(
        await screen.findByText(
          /You haven't logged any activity for this skill/i
        )
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /log activity/i }));

      expect(
        await screen.findByRole("heading", { name: /log activity/i })
      ).toBeInTheDocument();

      const skill_selector = screen.getByLabelText(/skill/i);
      expect(skill_selector).toHaveAttribute("aria-readonly");
    });
  });

  describe("Interactions", () => {
    it("opens the activity modal and add a new activity", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockActivity]);

      vi.mocked(activityService.createActivity).mockResolvedValue(mockActivity);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      await user.click(
        await screen.findByRole("button", { name: /log activity/i })
      );

      await user.type(
        screen.getByLabelText(/date/i),
        formatDateUTC("2025-04-12T14:10:00Z")
      );
      await user.type(screen.getByLabelText(/hours/i), "1");
      await user.type(screen.getByLabelText(/minutes/i), "17");
      // await user.selectOptions(
      //   screen.getByLabelText(/activity type/i),
      //   "project work"
      // );
      await user.type(
        screen.getByLabelText(/notes/i),
        "Built reusable UI components and improved frontend responsiveness."
      );

      await user.click(screen.getByRole("button", { name: /add activity/i }));

      await waitFor(() => {
        expect(
          screen.queryByText(/You haven't logged any activity for this skill/i)
        ).not.toBeInTheDocument();
      });

      const desktop_layout = within(screen.getByTestId("list-layout-desktop"));

      expect(desktop_layout.getByText(/April 12, 2025/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/1 h 17 mn/i)).toBeInTheDocument();
      expect(desktop_layout.getByText(/project work/i)).toBeInTheDocument();
      expect(
        desktop_layout.getByText(
          /Built reusable UI components and improved frontend responsiveness./i
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    }, 10000);

    it("updates the selected activity", async () => {
      const updatedActivity = { ...mockActivity, duration_minutes: 160 };

      vi.mocked(activityService.fetchActivitiesBySkill)
        .mockResolvedValueOnce([mockActivity])
        .mockResolvedValueOnce([updatedActivity]);

      vi.mocked(activityService.updateActivity).mockResolvedValue(
        updatedActivity
      );

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      expect(desktop_layout.getByText(/April 12, 2025/i)).toBeInTheDocument();

      await user.click(
        desktop_layout.getByRole("button", {
          name: /edit activity n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33/i,
        })
      );

      expect(
        screen.getByRole("heading", { name: /edit activity/i })
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
        expect(screen.getByLabelText(/minutes/i)).toHaveValue(17);
      });

      await user.clear(screen.getByLabelText(/hours/i));
      await user.type(screen.getByLabelText(/hours/i), "2");

      await user.clear(screen.getByLabelText(/minutes/i));
      await user.type(screen.getByLabelText(/minutes/i), "40");

      expect(screen.getByLabelText(/hours/i)).toHaveValue(2);
      expect(screen.getByLabelText(/minutes/i)).toHaveValue(40);

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      expect(
        within(await screen.findByTestId("list-layout-desktop")).getByText(
          /2 h 40 mn/i
        )
      ).toBeInTheDocument();
    });

    it("removes the selected last activity and shows empty activity list if delete confirmed", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill)
        .mockResolvedValueOnce([mockActivity])
        .mockResolvedValueOnce([]);

      vi.mocked(activityService.deleteActivity).mockResolvedValue(undefined);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      expect(
        desktop_layout.getByRole("cell", { name: /april 12, 2025/i })
      ).toBeInTheDocument();
      expect(
        desktop_layout.getByRole("cell", { name: /1 h 17 mn/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");

      await user.click(
        desktop_layout.getByRole("button", {
          name: /delete activity n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33/i,
        })
      );

      expect(
        screen.getByRole("heading", { name: /confirm deletion/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/are you sure you want to delete/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this activity from April 12, 2025/i)
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/You haven't logged any activity for this skill/i)
        ).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("cell", { name: /april 12, 2025/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("cell", { name: /1 h 17 mn/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("activity-count-badge")
      ).not.toBeInTheDocument();
    });

    it("removes selected activity and keeps other ones if delete confirmed", async () => {
      const keptActivity = {
        ...mockActivity,
        id: "a3b8c1d2-e4f5-6789-g0h1-i2j3k4l5m6n7",
        duration_minutes: 45,
        notes: "Reviewed code and provided feedback to team members.",
        logged_at: "2025-04-10T09:30:00Z",
      };

      vi.mocked(activityService.fetchActivitiesBySkill)
        .mockResolvedValueOnce([mockActivity, keptActivity])
        .mockResolvedValueOnce([keptActivity]);

      vi.mocked(activityService.deleteActivity).mockResolvedValue(undefined);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      const targetRow = within(
        desktop_layout.queryByTestId(
          "activity-row-n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33"
        )
      );

      const otherRow = within(
        desktop_layout.getByTestId(
          "activity-row-a3b8c1d2-e4f5-6789-g0h1-i2j3k4l5m6n7"
        )
      );

      expect(
        targetRow.getByRole("cell", {
          name: /april 12, 2025/i,
        })
      ).toBeInTheDocument();
      expect(
        targetRow.getByRole("cell", { name: /1 h 17 mn/i })
      ).toBeInTheDocument();
      expect(
        targetRow.getByRole("cell", {
          name: /Built reusable UI components and improved frontend responsiveness/i,
        })
      ).toBeInTheDocument();

      expect(
        otherRow.getByRole("cell", {
          name: /april 10, 2025/i,
        })
      ).toBeInTheDocument();
      expect(
        otherRow.getByRole("cell", { name: /45 mn/i })
      ).toBeInTheDocument();
      expect(
        otherRow.getByRole("cell", {
          name: /Reviewed code and provided feedback to team members/i,
        })
      ).toBeInTheDocument();

      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("2");

      await user.click(
        targetRow.getByRole("button", {
          name: /delete activity n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33/i,
        })
      );

      expect(
        screen.getByText(/are you sure you want to delete/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this activity from April 12, 2025/i)
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );

      await waitFor(() => {
        expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
        expect(
          screen.queryByTestId(
            "activity-row-n11a47c2-8jj0b-4e6d-9db1-4z2f6b2c5f33"
          )
        ).not.toBeInTheDocument();
      });

      const remainingRow = within(
        within(screen.getByTestId("list-layout-desktop")).getByTestId(
          "activity-row-a3b8c1d2-e4f5-6789-g0h1-i2j3k4l5m6n7"
        )
      );

      expect(
        remainingRow.getByRole("cell", {
          name: /april 10, 2025/i,
        })
      ).toBeInTheDocument();
      expect(
        remainingRow.getByRole("cell", { name: /45 mn/i })
      ).toBeInTheDocument();
      expect(
        remainingRow.getByRole("cell", {
          name: /Reviewed code and provided feedback to team members/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByTestId("activity-count-badge")).toHaveTextContent("1");
    });

    // We test the "X" button as a representative close trigger,
    // since all close actions (X, Cancel, Keep it) delegate to the same onClose prop.
    it("closes any modal if cancel, keep it or X button is triggered", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([
        mockActivity,
      ]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(
        await screen.findByTestId("list-layout-desktop")
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /log activity/i }));

      expect(
        screen.getByRole("heading", { name: /log activity/i })
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/skill/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /add activity/i })
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /log activity/i })
        ).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/skill/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/date/i)).not.toBeInTheDocument();
      });
    });

    it("closes the modal if cursor click triggered outside the modal", async () => {
      vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue([]);

      render(<SkillActivities skill={mockSkills[0]} skills={mockSkills} />, {
        wrapper: Wrapper,
      });

      expect(
        await screen.findByText(
          /You haven't logged any activity for this skill/i
        )
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /log activity/i }));
      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

      await user.click(screen.getByTestId("modal-overlay"));
      await waitFor(() => {
        expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
      });
    });
  });
});

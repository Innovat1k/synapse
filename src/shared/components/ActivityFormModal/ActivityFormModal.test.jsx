import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import ActivityFormModal from "./ActivityFormModal";
import userEvent from "@testing-library/user-event";

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
  activity_type: "practice",
  logged_at: "2025-02-15T14:32:00Z",
  created_at: "2025-02-15T14:35:00Z",
  updated_at: "2025-02-15T14:35:00Z",
  notes:
    "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
  duration_minutes: 90,
};

describe("ActivityFormModal", () => {
  it("displays all form fields", () => {
    render(
      <ActivityFormModal mode="create" isOpened={true} allSkills={mockSkills} />
    );

    expect(
      screen.getByRole("heading", { name: /log activity/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/skill/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minutes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add activity/i })
    ).toBeInTheDocument();
  });

  it("prefills fields correctly in edit mode", () => {
    render(
      <ActivityFormModal
        mode="edit"
        isOpened={true}
        allSkills={mockSkills}
        skill={mockSkills[0]}
        selectedActivity={mockActivity}
      />
    );

    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-02-15");
    expect(screen.getByLabelText(/time/i)).toHaveValue("17:32");
    expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(30);
    expect(screen.getByLabelText(/notes/i)).toHaveValue(
      "Practiced advanced JavaScript concepts including async patterns and performance optimization."
    );
    expect(screen.getByLabelText(/skill/i)).toHaveTextContent(/javascript/i);
    expect(screen.getByLabelText(/activity type/i)).toHaveTextContent(
      "practice"
    );
  });

  describe("actions", () => {
    it("calls closeModal when a dismiss action is triggered", async () => {
      const mockCloseModal = vi.fn();
      render(
        <ActivityFormModal
          mode="edit"
          isOpened={true}
          allSkills={mockSkills}
          skill={mockSkills[0]}
          selectedActivity={mockActivity}
          closeModal={mockCloseModal}
        />
      );

      await userEvent.click(
        screen.getByRole("button", { name: /close modal/i })
      );

      expect(mockCloseModal).toHaveBeenCalled();
    });

    it("calls onSubmit if submit button is clicked", async () => {
      const mockOnSubmit = vi.fn();
      render(
        <ActivityFormModal
          mode="edit"
          isOpened={true}
          allSkills={mockSkills}
          skill={mockSkills[0]}
          selectedActivity={mockActivity}
          onSubmit={mockOnSubmit}
        />
      );

      await userEvent.click(
        screen.getByRole("button", { name: /save changes/i })
      );

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe("ActivityFormModal accessibility", () => {
    let user;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("calls closeModal when Escape key is pressed", async () => {
      const mockCloseModal = vi.fn();
      render(
        <ActivityFormModal
          isOpened={true}
          mode="create"
          skill={mockSkills[1]}
          allSkills={mockSkills}
          closeModal={mockCloseModal}
        />
      );

      expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
      });
    });

    it("maintains correct focus order and traps focus in ActivityFormModal", async () => {
      render(
        <ActivityFormModal
          isOpened={true}
          mode="create"
          skill={mockSkills[1]}
          allSkills={mockSkills}
        />
      );

      const modalOverlay = screen.getByTestId("modal-overlay");
      const dateField = screen.getByLabelText(/date/i);
      const timeField = screen.getByLabelText(/time/i);
      const hoursField = screen.getByLabelText(/hours/i);
      const minutesField = screen.getByLabelText(/minutes/i);
      const activityTypeField = screen.getByLabelText(/activity type/i);
      const notesField = screen.getByLabelText(/notes/i);
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const closeButton = screen.getByLabelText(/close modal/i);

      await waitFor(() => {
        expect(modalOverlay.contains(document.activeElement)).toBe(true);
        expect(dateField).toHaveFocus();
      });

      // 🔁 Tabulation on logical order
      await user.tab();
      expect(timeField).toHaveFocus();

      await user.tab();
      expect(hoursField).toHaveFocus();

      await user.tab();
      expect(minutesField).toHaveFocus();

      await user.tab();
      expect(activityTypeField).toHaveFocus();

      await user.tab();
      expect(notesField).toHaveFocus();

      await user.tab();
      expect(cancelButton).toHaveFocus();

      await user.tab();
      expect(closeButton).toHaveFocus();

      // 🔄 Complete cycle
      await user.tab();
      expect(dateField).toHaveFocus();
    });
  });
});

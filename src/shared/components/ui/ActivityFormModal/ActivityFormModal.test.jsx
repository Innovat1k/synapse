import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
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
      <ActivityFormModal
        mode="create"
        isOpened={true}
        allSkills={mockSkills}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /log activity/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/skill/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/minutes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add activity/i }),
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
      />,
    );

    expect(screen.getByLabelText(/date/i)).toHaveValue("2025-02-15");
    expect(screen.getByLabelText(/time/i)).toHaveValue("17:32");
    expect(screen.getByLabelText(/hours/i)).toHaveValue(1);
    expect(screen.getByLabelText(/minutes/i)).toHaveValue(30);
    expect(screen.getByLabelText(/notes/i)).toHaveValue(
      "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
    );
    expect(screen.getByLabelText(/skill/i)).toHaveTextContent(/javascript/i);
    expect(screen.getByLabelText(/activity type/i)).toHaveTextContent(
      "practice",
    );
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
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});

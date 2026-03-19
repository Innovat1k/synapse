import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import DeleteModal from "./DeleteModal";
import userEvent from "@testing-library/user-event";
import { formatDateShort } from "@utils/utils";

const mockInitialActivity = {
  skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
  activity_type: "practice",
  logged_at: "2025-02-15T14:32:00Z",
  created_at: "2025-02-15T14:35:00Z",
  updated_at: "2025-02-15T14:35:00Z",
  notes: "Practiced advanced JavaScript concepts...",
  duration_minutes: 90,
};

const mockInitialSkill = {
  name: "Project Management",
  skill_id: "c9b1c212-4fd0-41a8-b5d9-6c39a9bb21b3",
  category: "Management",
  level: 3,
  tags: ["organization", "leadership", "planning"],
  description: "Experience managing teams...",
};

describe("DeleteModal", () => {
  it("displays correct message for activity deletion", () => {
    render(<DeleteModal entity="activity" initialData={mockInitialActivity} />);

    const formattedDate = formatDateShort(mockInitialActivity.logged_at);
    expect(
      screen.getByText(new RegExp(`this activity from ${formattedDate}`, "i")),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /keep it/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete permanently/i }),
    ).toBeInTheDocument();
  });

  it("displays correct message for skill deletion", () => {
    render(<DeleteModal entity="skill" initialData={mockInitialSkill} />);

    expect(screen.getByText(/"project management"/i)).toBeInTheDocument();
  });

  it("calls confirmDelete when delete button is clicked", async () => {
    const mockDelete = vi.fn();
    render(
      <DeleteModal
        entity="skill"
        initialData={mockInitialSkill}
        confirmDelete={mockDelete}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /delete permanently/i }),
    );
    expect(mockDelete).toHaveBeenCalledWith(mockInitialSkill);
  });
});

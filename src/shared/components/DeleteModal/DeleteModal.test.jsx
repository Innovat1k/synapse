import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import DeleteModal from "../DeleteModal/DeleteModal";
import userEvent from "@testing-library/user-event";

const mockInitialActivity = {
  skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
  activity_type: "practice",
  logged_at: "2025-02-15T14:32:00Z",
  created_at: "2025-02-15T14:35:00Z",
  updated_at: "2025-02-15T14:35:00Z",
  notes:
    "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
  duration_minutes: 90,
};

const mockInitialSkill = {
  name: "Project Management",
  skill_id: "c9b1c212-4fd0-41a8-b5d9-6c39a9bb21b3",
  category: "Management",
  level: 3,
  tags: ["organization", "leadership", "planning"],
  description: "Experience managing teams and coordinating project timelines.",
};

describe("DeleteModal", () => {
  it("passes props and display activity delete modal", async () => {
    render(<DeleteModal entity="activity" initialData={mockInitialActivity} />);

    expect(
      screen.getByRole("heading", { name: /confirm deletion/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/February 15, 2025/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /keep it/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /delete permanently/i })
    ).toBeInTheDocument();
  });

  it("passes props and display skill delete modal", () => {
    render(<DeleteModal entity="skill" initialData={mockInitialSkill} />);

    expect(
      screen.getByRole("heading", { name: /confirm deletion/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/"project management"/i)).toBeInTheDocument();
  });

  it("calls confirmDelete when confirming deletion", async () => {
    const mockDelete = vi.fn();

    render(
      <DeleteModal
        entity="skill"
        initialData={mockInitialSkill}
        confirmDelete={mockDelete}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /delete permanently/i })
    );

    expect(mockDelete).toHaveBeenCalled();
  });

  it("calls closeModal when confirming deletion", async () => {
    const mockClose = vi.fn();

    render(
      <DeleteModal
        entity="activity"
        initialData={mockInitialActivity}
        closeModal={mockClose}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /keep it/i }));

    expect(mockClose).toHaveBeenCalled();
  });
});

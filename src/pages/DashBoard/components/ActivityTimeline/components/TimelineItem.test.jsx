import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TimelineItem from "./TimelineItem";

vi.mock("../hooks/useRelativeTime", () => ({
  useRelativeTime: vi.fn(() => "just now"),
}));

describe("TimelineItem", () => {
  const mockActivity = {
    id: "test-123",
    skill_name: "React",
    skill_level: 3,
    track_title: "Frontend",
    duration_minutes: 120,
    activity_type: "practice",
    logged_at: "2026-04-09T14:30:00Z",
    notes: "Working on components",
  };

  it("makes the activity complete with all the information", () => {
    render(<TimelineItem activity={mockActivity} />);
    expect(screen.getByText("React")).toBeInTheDocument();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText(/2h/i)).toBeInTheDocument();
    expect(screen.getByText(/practice/i)).toBeInTheDocument();
    expect(screen.getByText(/just now/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Working on components/i)).toBeInTheDocument();
  });

  it("does not show notes if empty", () => {
    const activityWithoutNotes = { ...mockActivity, notes: "" };
    render(<TimelineItem activity={activityWithoutNotes} />);
    expect(
      screen.queryByText(/Working on components/i),
    ).not.toBeInTheDocument();
  });

  it("is clickable if onActivityClick is provided", () => {
    const mockOnClick = vi.fn();
    render(
      <TimelineItem activity={mockActivity} onActivityClick={mockOnClick} />,
    );

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveClass("cursor-pointer");
  });

  it("calls onActivityClick on click", async () => {
    const mockOnClick = vi.fn();
    const user = await import("@testing-library/user-event");

    render(
      <TimelineItem activity={mockActivity} onActivityClick={mockOnClick} />,
    );

    const listItem = screen.getByRole("listitem");
    await user.default.click(listItem);

    expect(mockOnClick).toHaveBeenCalledWith(mockActivity);
  });
});

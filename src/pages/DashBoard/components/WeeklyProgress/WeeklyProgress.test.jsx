import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WeeklyProgress from "./WeeklyProgress";

describe("WeeklyProgress", () => {
  const mockData = [
    {
      week_start: "2026-03-23",
      week_label: "This Week",
      total_minutes: 781,
      activities_count: 4,
    },
    {
      week_start: "2026-03-16",
      week_label: "Last Week",
      total_minutes: 420,
      activities_count: 3,
    },
    {
      week_start: "2026-03-09",
      week_label: "Mar 09",
      total_minutes: 180,
      activities_count: 2,
    },
  ];

  it("shows skeleton while loading", () => {
    render(<WeeklyProgress isLoading={true} data={null} error={null} />);
    expect(screen.getByTestId("weekly-progress-skeleton")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(
      <WeeklyProgress
        isLoading={false}
        data={null}
        error={new Error("Failed to load")}
      />,
    );
    expect(screen.getByText(/Unable to load progress/i)).toBeInTheDocument();
  });

  it("shows empty status when no data", () => {
    render(<WeeklyProgress isLoading={false} data={[]} error={null} />);
    expect(screen.getByText(/No activities logged/i)).toBeInTheDocument();
  });

  it("displays the chart", () => {
    render(<WeeklyProgress isLoading={false} data={mockData} error={null} />);
    expect(screen.getByTestId("weekly-progress-chart")).toBeInTheDocument();
  });
});

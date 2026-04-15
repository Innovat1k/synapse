import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DailyActivity from "./DailyActivity";

describe("DailyActivity", () => {
  const mockData = [
    {
      day_date: "2026-04-03",
      day_label: "Apr 03",
      total_minutes: 120,
      activities_count: 2,
    },
    {
      day_date: "2026-04-04",
      day_label: "Apr 04",
      total_minutes: 0,
      activities_count: 0,
    },
    {
      day_date: "2026-04-05",
      day_label: "Apr 05",
      total_minutes: 90,
      activities_count: 1,
    },
    {
      day_date: "2026-04-06",
      day_label: "Apr 06",
      total_minutes: 180,
      activities_count: 3,
    },
    {
      day_date: "2026-04-07",
      day_label: "Apr 07",
      total_minutes: 60,
      activities_count: 1,
    },
    {
      day_date: "2026-04-08",
      day_label: "Apr 08",
      total_minutes: 240,
      activities_count: 2,
    },
    {
      day_date: "2026-04-09",
      day_label: "Apr 09",
      total_minutes: 781,
      activities_count: 4,
    },
  ];

  it("shows skeleton while loading", () => {
    render(<DailyActivity isLoading={true} data={null} error={null} />);
    expect(screen.getByTestId("daily-activity-skeleton")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(
      <DailyActivity
        isLoading={false}
        data={null}
        error={new Error("Failed to load")}
      />,
    );
    expect(
      screen.getByText(/Unable to load daily activity/i),
    ).toBeInTheDocument();
  });

  it("shows empty status when no data", () => {
    render(<DailyActivity isLoading={false} data={[]} error={null} />);
    expect(screen.getByText(/No activities this week/i)).toBeInTheDocument();
  });

  it("displays the chart", () => {
    render(<DailyActivity isLoading={false} data={mockData} error={null} />);
    expect(screen.getByTestId("daily-activity-chart")).toBeInTheDocument();
  });
});

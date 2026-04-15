import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KeyMetrics from "./KeyMetrics";

describe("KeyMetrics", () => {
  const mockData = {
    hours_this_week: 13.0,
    skills_practiced: 3,
    total_sessions: 4,
    total_minutes_this_week: 781,
    most_practiced_skill: "architecture",
  };

  it("shows an error message", () => {
    render(
      <KeyMetrics
        isLoading={false}
        data={null}
        error={new Error("Failed to load")}
      />,
    );
    expect(screen.getByText(/Failed to load metrics/i)).toBeInTheDocument();
  });

  it("shows empty status when no data", () => {
    render(<KeyMetrics isLoading={false} data={null} error={null} />);
    expect(screen.getByText(/No activity this week/i)).toBeInTheDocument();
  });

  it("displays all 3 metrics cards", () => {
    render(<KeyMetrics isLoading={false} data={mockData} error={null} />);

    const weekMetric = within(screen.getByTestId("this-week-metric"));
    const practicedMetric = within(screen.getByTestId("practiced-metric"));
    const completedMetric = within(screen.getByTestId("completed-metric"));

    expect(weekMetric.getByText(/13/i)).toBeInTheDocument();
    expect(weekMetric.getByText("Hours")).toBeInTheDocument();

    expect(practicedMetric.getByText("3")).toBeInTheDocument();
    expect(practicedMetric.getByText("Skills")).toBeInTheDocument();

    expect(completedMetric.getByText("4")).toBeInTheDocument();
    expect(completedMetric.getByText("Sessions")).toBeInTheDocument();
  });
});

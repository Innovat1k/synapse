import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ActivityTimeline from "./ActivityTimeline";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-04-10T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

const mockData = [
  {
    id: "1",
    skill_name: "React",
    activity_type: "learning",
    logged_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "2",
    skill_name: "Node.js",
    activity_type: "practice",
    logged_at: "2026-04-09T10:00:00Z",
  },
  {
    id: "3",
    skill_name: "Old JS",
    activity_type: "practice",
    logged_at: "2026-04-01T10:00:00Z",
  },
];

describe("ActivityTimeline", () => {
  it("shows skeleton while loading", () => {
    render(<ActivityTimeline isLoading data={[]} />);
    expect(screen.getByTestId("timeline-skeleton")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(
      <ActivityTimeline
        isLoading={false}
        data={[]}
        error={new Error("fail")}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<ActivityTimeline isLoading={false} data={[]} />);
    expect(screen.getByText(/No activity recorded/i)).toBeInTheDocument();
  });

  it("renders activities", () => {
    render(<ActivityTimeline isLoading={false} data={mockData} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("limits to 7 activities", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      skill_name: `Skill ${i}`,
      activity_type: "practice",
      logged_at: "2026-04-10T10:00:00Z",
    }));

    render(<ActivityTimeline isLoading={false} data={many} />);

    expect(screen.getAllByRole("listitem").length).toBeLessThanOrEqual(7);
  });

  it("shows grouped activities", () => {
    render(<ActivityTimeline isLoading={false} data={mockData} />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Earlier")).toBeInTheDocument();
  });
});

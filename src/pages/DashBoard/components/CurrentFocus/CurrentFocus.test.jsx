import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CurrentFocus from "./CurrentFocus";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("CurrentFocus", () => {
  const mockData = {
    skill_id: "abc-123",
    skill_name: "React",
    skill_level: 3,
    total_minutes: 180,
    activities_count: 5,
    track_title: "Frontend",
  };

  it("shows skeleton while loading", () => {
    render(<CurrentFocus isLoading={true} data={null} error={null} />);
    expect(screen.getByTestId("current-focus-skeleton")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(
      <CurrentFocus
        isLoading={false}
        data={null}
        error={new Error("Failed to load")}
      />,
    );
    expect(
      screen.getByText(/Unable to load current focus/i),
    ).toBeInTheDocument();
  });

  it("shows empty status when no data", () => {
    render(<CurrentFocus isLoading={false} data={null} error={null} />);
    expect(screen.getByText(/No focus yet/i)).toBeInTheDocument();
  });

  it("displays focus data correctly", () => {
    render(<CurrentFocus isLoading={false} data={mockData} error={null} />);

    expect(screen.getByRole("heading", { name: /react/i })).toBeInTheDocument();
    expect(screen.getByText(/3\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/3h/i)).toBeInTheDocument();

    screen.debug();
  });

  it("calls onLogActivity when button is clicked", async () => {
    const mockOnLogActivity = vi.fn();
    const user = userEvent.setup();

    render(
      <CurrentFocus
        isLoading={false}
        data={mockData}
        error={null}
        onLogActivity={mockOnLogActivity}
      />,
    );

    const button = screen.getByText(/Log Activity/i);
    await user.click(button);

    expect(mockOnLogActivity).toHaveBeenCalledWith("abc-123");
  });
});

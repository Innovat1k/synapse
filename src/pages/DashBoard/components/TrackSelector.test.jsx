import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event"; // ⭐ Ajout

import { TrackSelector } from "./TrackSelector";

const mockTracks = [
  { track_id: "track-1", title: "Frontend Mastery" },
  { track_id: "track-2", title: "Backend Foundations" },
];

describe("TrackSelector", () => {
  it("renders loading state", () => {
    render(<TrackSelector isLoading={true} />);
    expect(screen.getByTestId("track-selector-skeleton")).toBeInTheDocument();
  });

  it("renders all options including 'All Tracks'", () => {
    render(<TrackSelector tracks={mockTracks} selectedTrackId="all" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("all");

    expect(screen.getByText("All Tracks")).toBeInTheDocument();
    expect(screen.getByText("Frontend Mastery")).toBeInTheDocument();
    expect(screen.getByText("Backend Foundations")).toBeInTheDocument();
  });

  it("reflects the selected track", () => {
    render(
      <TrackSelector
        tracks={mockTracks}
        selectedTrackId="track-1"
        onSelect={() => {}}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("track-1");
  });

  it("calls onSelect when selection changes", async () => {
    const user = userEvent.setup();
    const onSelectMock = vi.fn();

    render(
      <TrackSelector
        tracks={mockTracks}
        selectedTrackId="all"
        onSelect={onSelectMock}
      />,
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "track-2");

    expect(onSelectMock).toHaveBeenCalledWith("track-2");
  });
});

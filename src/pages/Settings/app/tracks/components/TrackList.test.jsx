import { render, screen, within } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { TrackList } from "./TrackList";

const mockTracks = [
  {
    track_id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn React from scratch",
    category: "frontend",
    is_visible: true,
    sort_order: 1,
    created_at: "2026-02-27T10:00:00.000000+00:00",
    updated_at: "2026-02-27T10:00:00.000000+00:00",
  },
  {
    track_id: "nodejs-api-design",
    title: "Node.js API Design",
    description: "Build scalable APIs with Node.js",
    category: "backend",
    is_visible: true,
    sort_order: 2,
    created_at: "2026-02-27T11:00:00.000000+00:00",
    updated_at: "2026-02-27T11:00:00.000000+00:00",
  },
];

describe("TrackList", () => {
  describe("Rendering", () => {
    it("renders track items with correct elements", () => {
      render(<TrackList tracks={mockTracks} onDelete={vi.fn()} />);

      const reactItem = screen.getByTestId("track-item-react-fundamentals");
      const nodeItem = screen.getByTestId("track-item-nodejs-api-design");

      expect(
        within(reactItem).getByRole("heading", { name: /react fundamentals/i }),
      ).toBeInTheDocument();
      expect(
        within(reactItem).getByText(/id: react-fundamentals/i),
      ).toBeInTheDocument();
      expect(
        within(reactItem).getByTestId("desktop-track-category"),
      ).toHaveTextContent(/frontend/i);

      expect(
        within(nodeItem).getByRole("heading", { name: /node.js api design/i }),
      ).toBeInTheDocument();
      expect(
        within(nodeItem).getByText(/id: nodejs-api-design/i),
      ).toBeInTheDocument();
      expect(
        within(nodeItem).getByTestId("desktop-track-category"),
      ).toHaveTextContent(/backend/i);
    });
  });
});

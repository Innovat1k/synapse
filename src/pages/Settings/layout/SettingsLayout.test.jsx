import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { SettingsLayout } from "./SettingsLayout";

const MockOutlet = () => (
  <div data-testid="mock-outlet">
    <h1>Application Structure</h1>
    <p>Mocked settings content</p>
  </div>
);

const renderSettingsLayout = (initialEntries = ["/settings"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/settings" element={<SettingsLayout />}>
          <Route path="app/tracks" element={<MockOutlet />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("SettingsLayout", () => {
  describe("Rendering", () => {
    it("renders main content on desktop", () => {
      renderSettingsLayout(["/settings/app/tracks"]);

      expect(screen.getByText(/Application Structure/i)).toBeInTheDocument();
    });

    it("renders mobile header with menu button", () => {
      renderSettingsLayout();

      expect(
        screen.getByRole("button", {
          name: /open settings navigation/i,
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Interactions (mobile drawer)", () => {
    let user;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("opens mobile sidebar when menu button is clicked", async () => {
      renderSettingsLayout();

      await user.click(
        screen.getByRole("button", {
          name: /open settings navigation/i,
        }),
      );

      expect(screen.getByText(/Menu/i)).toBeInTheDocument();

      const drawer = screen.getByText(/Menu/i).closest("aside");

      expect(
        within(drawer).getByRole("link", {
          name: /Tracks/i,
        }),
      ).toBeInTheDocument();
    });

    it("closes mobile sidebar when close button is clicked", async () => {
      renderSettingsLayout();

      await user.click(
        screen.getByRole("button", {
          name: /open settings navigation/i,
        }),
      );

      expect(screen.getByText(/Menu/i)).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", {
          name: /close settings navigation/i,
        }),
      );

      await waitFor(() => {
        expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument();
      });
    });

    it("closes mobile sidebar when overlay is clicked", async () => {
      renderSettingsLayout();

      await user.click(
        screen.getByRole("button", {
          name: /open settings navigation/i,
        }),
      );

      expect(screen.getByText(/Menu/i)).toBeInTheDocument();

      await user.click(screen.getByTestId("mobile-overlay"));

      await waitFor(() => {
        expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument();
      });
    });
  });
});

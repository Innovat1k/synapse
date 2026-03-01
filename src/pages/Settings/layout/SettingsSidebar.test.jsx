// src/pages/Settings/SettingsSidebar.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SettingsSidebar } from "./SettingsSidebar";
import { beforeEach, vi } from "vitest";

vi.mock("./settingsConfig", () => ({
  SETTINGS_SECTIONS: [
    {
      group: "Personal",
      items: [
        { id: "account", label: "Account", path: "/settings/account" },
        { id: "general", label: "General", path: "/settings/general" },
      ],
    },
    {
      group: "Application",
      items: [{ id: "tracks", label: "Tracks", path: "/settings/app/tracks" }],
    },
  ],
}));

const renderSidebar = (
  initialEntry = "/settings/account",
  onAction = vi.fn(),
) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SettingsSidebar onAction={onAction} />
    </MemoryRouter>,
  );
};

describe("SettingsSidebar", () => {
  describe("Rendering", () => {
    it("renders all navigation groups and items", () => {
      renderSidebar();

      expect(screen.getByText(/personal/i)).toBeInTheDocument();
      expect(screen.getByText(/application/i)).toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: /account/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /general/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /tracks/i })).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("marks the active link with aria-current based on current route", () => {
      renderSidebar("/settings/app/tracks");

      const activeLink = screen.getByRole("link", { name: /tracks/i });
      const inactiveLink = screen.getByRole("link", { name: /account/i });

      expect(activeLink).toHaveAttribute("aria-current", "page");
      expect(inactiveLink).not.toHaveAttribute("aria-current");
    });
  });

  describe("Actions", () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it("calls onAction when a link is clicked", async () => {
      const mockOnAction = vi.fn();
      renderSidebar("/settings/account", mockOnAction);

      await user.click(screen.getByRole("link", { name: /tracks/i }));

      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it("each link is keyboard-navigable and accessible", () => {
      renderSidebar();

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link).toHaveAccessibleName();
      });
    });
  });
});

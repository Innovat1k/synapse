import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppSettingsPage } from "./AppSettingsPage";
import { beforeEach, describe, it, expect } from "vitest";

const renderAppSettingsPage = () => {
  return render(
    <MemoryRouter>
      <AppSettingsPage />
    </MemoryRouter>,
  );
};

describe("AppSettingsPage", () => {
  describe("Rendering", () => {
    it("renders the page header and description", () => {
      renderAppSettingsPage();

      expect(screen.getByText(/Application Structure/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Configure the core model of Synapse/i),
      ).toBeInTheDocument();
    });

    it("renders all settings cards with correct content", () => {
      renderAppSettingsPage();

      expect(
        screen.getByRole("link", { name: /Learning Tracks/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Group skills into thematic tracks/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Skill Categories/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Define and customize global categories/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Soon/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it("allows navigation when clicking on an active card", async () => {
      renderAppSettingsPage();

      const link = screen.getByRole("link", { name: /Learning Tracks/i });
      await user.click(link);

      expect(link).toHaveAttribute("href", "/settings/app/tracks");
    });

    it("prevents interaction with coming-soon cards", async () => {
      renderAppSettingsPage();

      const disabledCard = screen.getByTestId("coming-soon-skill-categories");
      expect(disabledCard).toBeInTheDocument();
      expect(disabledCard).toHaveAttribute("aria-disabled", "true");
      expect(disabledCard).toHaveClass("cursor-not-allowed");
    });
  });

  describe("Accessibility", () => {
    it("active cards are keyboard-navigable links", () => {
      renderAppSettingsPage();

      const link = screen.getByRole("link", { name: /Learning Tracks/i });
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAccessibleName(/Learning Tracks/i);
    });

    it("coming-soon cards are not focusable and marked as disabled", () => {
      renderAppSettingsPage();

      const disabledCard = screen.getByTestId("coming-soon-skill-categories");
      expect(disabledCard).toHaveAttribute("aria-disabled", "true");
      expect(disabledCard).not.toHaveAttribute("tabIndex");
    });
  });
});

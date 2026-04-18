import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import { SETTINGS_SECTIONS } from "./settingsConfig";

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("SettingsHome", () => {
  it("renders Export Data quick action with correct link", () => {
    renderWithRouter(<SettingsPage />);

    const exportLink = screen.getByRole("link", { name: /Export Your Data/i });

    expect(exportLink).toBeInTheDocument();
    expect(exportLink).toHaveAttribute("href", "/settings/personal/data");
    expect(
      screen.getByText(
        /Download all your skills and activities as a JSON file/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders settings items from config with correct status badges", () => {
    renderWithRouter(<SettingsPage />);

    SETTINGS_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();

        if (item.status === "coming-soon") {
          const itemContainer = screen.getByText(item.label).closest("a");
          expect(itemContainer).toHaveClass("cursor-not-allowed");
        }
      });
    });
  });
});

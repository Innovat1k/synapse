import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import SkillsListPage from "../SkillsListPage";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useOutletContext: vi.fn() };
});

import { mockSkills, renderComponent } from "./test-utils";

describe("SkillsListPage", () => {
  describe("Desktop layout (default)", () => {
    it("displays 'no skill' message if skills list is empty", async () => {
      renderComponent(<SkillsListPage />, { skills: [] });

      await waitFor(() => {
        expect(screen.getByText(/no skills registered/i)).toBeInTheDocument();
      });
    });

    it("renders skill management UI and displays skills after successful fetch", async () => {
      const CATEGORIES = [
        "all skills",
        "frontend",
        "backend",
        "devOps",
        "others",
      ];

      renderComponent(<SkillsListPage />, { skills: mockSkills });

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        /skill management/i
      );
      expect(
        screen.getByRole("button", { name: /add new skill/i })
      ).toBeInTheDocument();

      CATEGORIES.forEach((category) => {
        expect(
          within(screen.getByRole("combobox")).getByRole("option", {
            name: category,
          })
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("columnheader", { name: /name/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /category/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /level/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /last updated/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /actions/i })
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole("button", { name: /sort by name/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sort by level/i })
      ).toBeInTheDocument();
    });

    it("displays skills tables with correct values", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      const firstSkill = mockSkills[0];
      expect(
        desktop_layout.getByRole("cell", { name: firstSkill.name })
      ).toBeInTheDocument();
      expect(
        desktop_layout.getByRole("cell", { name: firstSkill.category })
      ).toBeInTheDocument();
      expect(
        within(
          desktop_layout.getByTestId(`skill-row-${firstSkill.skill_id}`)
        ).getByRole("cell", { name: `${firstSkill.level}/5` })
      ).toBeInTheDocument();
      expect(
        desktop_layout.getByRole("button", {
          name: `Delete skill ${firstSkill.name}`,
        })
      ).toBeInTheDocument();
      expect(
        desktop_layout.getByRole("button", {
          name: `Edit skill ${firstSkill.name}`,
        })
      ).toBeInTheDocument();
    });
  });

  describe("Mobile layout", () => {
    it("displays skills cards with correct values", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      const mobile_layout = within(
        await screen.findByTestId("list-layout-mobile")
      );
      const skill_card = within(
        mobile_layout.getByTestId(
          "skill-card-f3e3c1b1-0b4a-41d5-97e4-9d1f7cfd3834"
        )
      );

      expect(
        skill_card.getByRole("heading", { level: 3, name: /digital painting/i })
      ).toBeInTheDocument();
      expect(skill_card.getByText(/art/i)).toBeInTheDocument();
      expect(skill_card.getByText("3/5")).toBeInTheDocument();
      expect(
        skill_card.getByRole("button", { name: /edit skill digital painting/i })
      ).toBeInTheDocument();
      expect(
        skill_card.getByRole("button", {
          name: /delete skill digital painting/i,
        })
      ).toBeInTheDocument();
    });
  });
});

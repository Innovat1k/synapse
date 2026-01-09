import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import SkillActionsMenu from "./SkillActionsMenu";
import userEvent from "@testing-library/user-event";

const mockActionsMenu = (isOpened = false, handleToggle = vi.fn()) => ({
  isOpened,
  handleToggle,
});

const createMockMethods = (overrides = {}) => ({
  openEditModal: vi.fn(),
  openDeleteModal: vi.fn(),
  ...overrides,
});

const mockSkill = { name: "React JS" };

describe("SkillActionsMenu", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("Skill action button", () => {
    it("renders actions button firstly", () => {
      render(<SkillActionsMenu actionsMenu={mockActionsMenu(false)} />);

      expect(
        screen.getByRole("button", { name: /open skill actions/i })
      ).toBeInTheDocument();
    });

    it("calls handleChange if actions button is clicked", async () => {
      const mockHandleToggle = vi.fn();
      render(
        <SkillActionsMenu
          actionsMenu={mockActionsMenu(false, mockHandleToggle)}
        />
      );

      const skillActionsBtn = screen.getByRole("button", {
        name: /open skill actions/i,
      });

      await user.click(skillActionsBtn);
      expect(mockHandleToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Skill actions menu", () => {
    it("renders skill actions menu correctly", () => {
      render(
        <SkillActionsMenu
          actionsMenu={mockActionsMenu(true)}
          openPurgeModal={vi.fn()}
          activityCount={3}
          skill={mockSkill}
        />
      );

      expect(
        screen.getByRole("button", { name: /edit skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /delete skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /purge activities/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /close actions menu/i })
      ).toBeInTheDocument();
    });

    it("calls openEditModal when edit button is clicked", async () => {
      const mockMethods = createMockMethods();
      render(
        <SkillActionsMenu
          actionsMenu={mockActionsMenu(true)}
          openPurgeModal={vi.fn()}
          activityCount={3}
          skill={mockSkill}
          methods={mockMethods}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit skill/i }));
      expect(mockMethods.openEditModal).toHaveBeenCalledTimes(1);
    });

    it("calls openDeleteModal when delete button is clicked", async () => {
      const mockMethods = createMockMethods();
      render(
        <SkillActionsMenu
          actionsMenu={mockActionsMenu(true)}
          openPurgeModal={vi.fn()}
          activityCount={3}
          skill={mockSkill}
          methods={mockMethods}
        />
      );

      await user.click(screen.getByRole("button", { name: /delete skill/i }));
      expect(mockMethods.openDeleteModal).toHaveBeenCalledTimes(1);
    });

    it("calls openPurgeModal and handleToggle when purge button is clicked", async () => {
      const mockMethods = createMockMethods();
      const mockOpenPurgeModal = vi.fn();
      const mockHandleToggle = vi.fn();

      render(
        <SkillActionsMenu
          actionsMenu={mockActionsMenu(true, mockHandleToggle)}
          openPurgeModal={mockOpenPurgeModal}
          activityCount={3}
          skill={mockSkill}
          methods={mockMethods}
        />
      );

      await user.click(
        screen.getByRole("button", { name: /purge activities/i })
      );

      expect(mockOpenPurgeModal).toHaveBeenCalledTimes(1);
      expect(mockHandleToggle).toHaveBeenCalledTimes(1);
    });
  });
});

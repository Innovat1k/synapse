import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect } from "vitest";
import SkillsListPage from "../SkillsListPage";
import { mockSkills, renderComponent } from "./test-utils";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useOutletContext: vi.fn() };
});

describe("modals", () => {
  const user = userEvent.setup({ delay: null });

  describe("SkillFormModal : create / add skill", () => {
    it("opens SkillFormModal:create if 'Add new skill' button is clicked", async () => {
      renderComponent(<SkillsListPage />, { skills: [] });

      const addSkillBtn = screen.getByRole("button", {
        name: /add new skill/i,
      });

      await user.click(addSkillBtn);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: /add new skill/i }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
    });

    it("closes any modal if X icon button is clicked", async () => {
      renderComponent(<SkillsListPage />, { skills: [] });

      const addSkillBtn = screen.getByRole("button", {
        name: /add new skill/i,
      });
      await user.click(addSkillBtn);

      const closeBtn = screen.getByRole("button", {
        name: "Close modal",
      });
      await user.click(closeBtn);

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /add new skill/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("SkillFormModal : edit / update skill", () => {
    it("opens SkillFormModal:edit with currently clicked skill values", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          {
            name: /Edit skill Digital Painting/i,
          },
        ),
      );

      const editModal = within(
        await screen.findByTestId(/skill-modal-content/i),
      );

      expect(
        screen.getByRole("heading", { name: /edit skill/i }),
      ).toBeInTheDocument();

      expect(editModal.getByLabelText(/name/i)).toHaveValue("Digital Painting");
      expect(editModal.getByLabelText(/category/i)).toHaveValue("art");
      expect(editModal.getByLabelText(/level/i)).toHaveValue("3");
      expect(editModal.getByLabelText(/description/i)).toHaveValue(
        "Practicing digital illustration using drawing tablets.",
      );

      const skill_tags = within(editModal.getByTestId("skill-tags"));
      expect(skill_tags.getByText("visual")).toBeInTheDocument();
      expect(skill_tags.getByText("creativity")).toBeInTheDocument();

      expect(
        editModal.getByRole("button", {
          name: /update skill/i,
        }),
      ).toBeInTheDocument();

      expect(
        editModal.getByRole("button", {
          name: /cancel/i,
        }),
      ).toBeInTheDocument();
    });

    it("cancels any changes and close the modal if cancel button is clicked", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          {
            name: /edit skill digital painting/i,
          },
        ),
      );

      await user.click(
        screen.getByRole("button", {
          name: /cancel/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /edit skill/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("SkillFormModal : delete skill", () => {
    it("opens SkillFormModal:delete if delete icon button is clicked", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop"),
      );

      await user.click(
        desktop_layout.getByRole("button", {
          name: /delete skill project management/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: /confirm deletion/i }),
        );

        const paragraph = screen.getByText(/are you sure/i);
        expect(paragraph).toHaveTextContent(
          /delete\s+"project management"\s*\?/i,
        );

        expect(
          screen.getByRole("button", {
            name: /keep it/i,
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", {
            name: /delete permanently/i,
          }),
        ).toBeInTheDocument();
      });
    });

    it("keeps a skill when cancel button is clicked and close the modal", async () => {
      renderComponent(<SkillsListPage />, { skills: mockSkills });

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          { name: /delete skill java/i },
        ),
      );

      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /keep it/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /confirm deletion/i }),
        ).not.toBeInTheDocument();
      });

      expect(screen.queryByRole("cell", { name: /java/i })).toBeInTheDocument();
    });
  });
});

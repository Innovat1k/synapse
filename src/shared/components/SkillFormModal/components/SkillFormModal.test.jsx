import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import SkillFormModal from "./SkillFormModal";
import userEvent from "@testing-library/user-event";

const mockSkill = {
  name: "React JS",
  skill_id: "550e8400-e29b-41d4-a716-446655440001",
  category: "frontend",
  level: 4,
  description: "Completed an online React JS course leading to certification.",
  tags: ["programming", "visual"],
};

const mockHandleDelete = vi.fn();

describe("SkillFormModal", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("triggers onClose when user closes the modal", async () => {
    // We test the "X" button as a representative close trigger,
    // since all close actions (X, Cancel, Keep it) delegate to the same onClose prop.
    const mockClose = vi.fn();
    render(
      <SkillFormModal
        isOpened={true}
        mode="edit"
        initialData={mockSkill}
        onClose={mockClose}
      />
    );

    await user.click(screen.getByLabelText(/close modal/i));
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when clicking the overlay (background)", async () => {
    const mockClose = vi.fn();
    render(
      <SkillFormModal
        isOpened={true}
        mode="edit"
        initialData={mockSkill}
        onClose={mockClose}
      />
    );

    const overlay = screen.getByTestId(/modal-overlay/i);
    await user.click(overlay);

    expect(mockClose).toHaveBeenCalledOnce();
  });

  it("allows to add new tag when editing a skill", async () => {
    render(
      <SkillFormModal
        isOpened={true}
        mode="create"
        initialData={mockSkill}
        onClose={vi.fn()}
      />
    );

    expect(await screen.findByRole("heading", { level: 2 })).toHaveTextContent(
      /new skill/i
    );

    const tag_input = screen.getByLabelText(/tags/i);
    await user.type(tag_input, "oop");
    expect(tag_input).toHaveValue("oop");

    await user.click(screen.getByRole("button", { name: /add tag/i }));
    expect(
      within(screen.getByTestId("skill-tags")).getByText(/oop/i)
    ).toBeInTheDocument();
  });

  it("allows to remove existing tag when editing a skill", async () => {
    render(
      <SkillFormModal isOpened={true} mode="edit" initialData={mockSkill} />
    );

    expect(
      within(screen.getByTestId("skill-tags")).getByText(/programming/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /remove programming tag/i })
    );

    expect(
      within(screen.getByTestId("skill-tags")).queryByText(/programming/i)
    ).not.toBeInTheDocument();
  });

  describe("create modal", () => {
    it("renders SkillFormModal for create new skill", () => {
      render(<SkillFormModal isOpened={true} mode="create" />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /new skill/i
      );
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
    });
  });

  describe("edit modal", () => {
    it("renders SkillFormModal for edit existing skill", () => {
      render(
        <SkillFormModal isOpened={true} mode="edit" initialData={mockSkill} />
      );

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /edit skill/i
      );
      expect(screen.getByLabelText(/name/i).value).toMatch(/react js/i);
      expect(screen.getByLabelText(/category/i).value).toMatch(/frontend/i);
      expect(screen.getByLabelText(/level/i).value).toMatch("4");
      expect(screen.getByLabelText(/description/i).value).toMatch(
        /completed an online React JS course leading to certification/i
      );
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill-tags")).getByText(/visual/i)
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill-tags")).getByText(/programming/i)
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /update skill/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
    });
  });

  describe("delete modal", () => {
    it("renders SkillFormModal for delete skill", () => {
      render(
        <SkillFormModal isOpened={true} mode="delete" initialData={mockSkill} />
      );

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /confirm deletion/i
      );

      const paragraph = screen.getByText(/are you sure/i);
      expect(paragraph).toHaveTextContent(/delete\s+"react js"\s*\?/i);

      expect(
        screen.getByRole("button", { name: /delete permanently/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /keep it/i })
      ).toBeInTheDocument();
    });

    it("calls onDelete : handleDelete if 'delete permanently' button is clicked", async () => {
      render(
        <SkillFormModal
          isOpened={true}
          mode="delete"
          initialData={mockSkill}
          onDelete={mockHandleDelete}
        />
      );

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );
      expect(mockHandleDelete).toHaveBeenCalledOnce();
    });
  });
});

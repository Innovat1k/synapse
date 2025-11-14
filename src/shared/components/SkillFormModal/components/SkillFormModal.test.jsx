import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import SkillFormModal from "./SkillFormModal";
import userEvent from "@testing-library/user-event";

const mockSkill = {
  name: "React js",
  id: 23,
  category: "frontend",
  level: 4,
  description: "online free react js course to get certification.",
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
      <SkillFormModal mode="edit" initialData={mockSkill} onClose={mockClose} />
    );

    await user.click(screen.getByLabelText(/close modal/i));
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when clicking the overlay (background)", async () => {
    const mockClose = vi.fn();
    render(
      <SkillFormModal mode="edit" initialData={mockSkill} onClose={mockClose} />
    );

    const overlay = screen.getByTestId(/modal-overlay/i);
    await user.click(overlay);

    expect(mockClose).toHaveBeenCalledOnce();
  });

  describe("create modal", () => {
    it("renders SkillFormModal for create new skill", () => {
      render(<SkillFormModal mode="create" />);

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
      render(<SkillFormModal mode="edit" initialData={mockSkill} />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        /edit skill/i
      );
      expect(screen.getByLabelText(/name/i)).toHaveValue("React js");
      expect(screen.getByLabelText(/category/i)).toHaveValue("frontend");
      expect(screen.getByLabelText(/level/i)).toHaveValue("4");
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "online free react js course to get certification."
      );
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill tags")).getByText("visual")
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill tags")).getByText("programming")
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
      render(<SkillFormModal mode="delete" initialData={mockSkill} />);

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

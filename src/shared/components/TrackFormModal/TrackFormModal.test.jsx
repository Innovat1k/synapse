import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TrackFormModal } from "./TrackFormModal";

describe("TrackFormModal", () => {
  let user;
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  describe("Rendering", () => {
    it("renders modal content when opened", () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      expect(
        screen.getByRole("heading", { name: /Configure New Track/i }),
      ).toBeInTheDocument();

      expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancel/i }),
      ).toBeInTheDocument();
    });

    it("does not render when isOpened is false", () => {
      const { container } = render(
        <TrackFormModal
          isOpened={false}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when Cancel button is clicked", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Cancel/i }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when clicking overlay", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      await user.click(screen.getByTestId("modal-overlay"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when pressing Escape", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Form Submission", () => {
    it("submits real user data", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      await user.type(screen.getByLabelText(/Track Title/i), "Test Track");

      await user.selectOptions(screen.getByLabelText(/Category/i), "other");

      await user.click(screen.getByRole("button", { name: /Create Track/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Test Track",
            track_id: "test-track",
            category: "other",
          }),
        );
      });
    });

    it("disables submit button when loading", () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />,
      );

      expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper dialog role and aria-modal", () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("role", "dialog");
    });

    it("sets initial focus on title input", async () => {
      render(
        <TrackFormModal
          isOpened={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />,
      );

      const titleInput = await screen.findByLabelText(/Track Title/i);

      await waitFor(() => {
        expect(document.activeElement).toBe(titleInput);
      });
    });
  });
});

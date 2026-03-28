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
  });
});

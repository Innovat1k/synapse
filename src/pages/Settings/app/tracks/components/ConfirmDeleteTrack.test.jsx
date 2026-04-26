import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmDeleteTrack } from "./ConfirmDeleteTrack";

describe("ConfirmDeleteTrack", () => {
  let user;
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    trackTitle: "React Architecture",
    isLoading: false,
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("Rendering", () => {
    it("renders with correct elements", () => {
      render(<ConfirmDeleteTrack {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: /Delete Learning Track\?/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This action cannot be undone/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: /Permanently Delete/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Cancel/i }),
      ).toBeInTheDocument();
      screen.debug();
    });

    it("does not render when isOpen is false", () => {
      const { container } = render(
        <ConfirmDeleteTrack {...defaultProps} isOpen={false} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when Cancel button is clicked", async () => {
      const onCloseMock = vi.fn();
      render(<ConfirmDeleteTrack {...defaultProps} onClose={onCloseMock} />);

      await user.click(screen.getByRole("button", { name: /Cancel/i }));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when Permanently Delete button is clicked", async () => {
      const onConfirmMock = vi.fn();
      render(
        <ConfirmDeleteTrack {...defaultProps} onConfirm={onConfirmMock} />,
      );

      await user.click(
        screen.getByRole("button", { name: /Permanently Delete/i }),
      );
      expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });

    it("disables buttons when isLoading is true", async () => {
      render(<ConfirmDeleteTrack {...defaultProps} isLoading={true} />);

      const cancelButton = screen.getByRole("button", { name: /Cancel/i });
      const deleteButton = screen.getByRole("button", {
        name: /deleting.../i,
      });

      expect(cancelButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });

    it("shows loading spinner when isLoading is true", () => {
      render(<ConfirmDeleteTrack {...defaultProps} isLoading={true} />);

      expect(
        screen.getByRole("button", { name: /deleting.../i }),
      ).toBeInTheDocument();
    });
  });
});

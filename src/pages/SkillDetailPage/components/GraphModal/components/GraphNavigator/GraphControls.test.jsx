import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphControls } from "./GraphControls";
import { beforeEach, describe } from "vitest";

describe("GraphControls", () => {
  const defaultProps = {
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onReset: vi.fn(),
    isMobile: false,
    isZoomInDisabled: false,
    isZoomOutDisabled: false,
    isResetDisabled: false,
  };

  describe("Rendering", () => {
    it("renders all three control buttons", () => {
      render(<GraphControls {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /Zoom in/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Zoom out/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Reset view/i }),
      ).toBeInTheDocument();
    });

    it("disables zoom in button when isZoomInDisabled is true", () => {
      render(<GraphControls {...defaultProps} isZoomInDisabled={true} />);

      const zoomInBtn = screen.getByRole("button", { name: /Zoom in/i });
      expect(zoomInBtn).toBeDisabled();
      expect(zoomInBtn).toHaveAttribute("aria-disabled", "true");
    });

    it("disables zoom out button when isZoomOutDisabled is true", () => {
      render(<GraphControls {...defaultProps} isZoomOutDisabled={true} />);

      const zoomOutBtn = screen.getByRole("button", { name: /Zoom out/i });
      expect(zoomOutBtn).toBeDisabled();
      expect(zoomOutBtn).toHaveAttribute("aria-disabled", "true");
    });

    it("disables reset button when isResetDisabled is true", () => {
      render(<GraphControls {...defaultProps} isResetDisabled={true} />);

      const resetBtn = screen.getByRole("button", { name: /Reset view/i });
      expect(resetBtn).toBeDisabled();
      expect(resetBtn).toHaveAttribute("aria-disabled", "true");
    });

    it("positions controls horizontally on mobile", () => {
      render(<GraphControls {...defaultProps} isMobile={true} />);
      const container = screen.getByRole("group");
      expect(container).toHaveClass("flex-row");
    });

    it("positions controls vertically on desktop", () => {
      render(<GraphControls {...defaultProps} isMobile={false} />);
      const container = screen.getByRole("group");
      expect(container).toHaveClass("flex-col");
    });
  });

  describe("Actions", () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it("calls onZoomIn when zoom in button is clicked", async () => {
      const onZoomIn = vi.fn();
      render(<GraphControls {...defaultProps} onZoomIn={onZoomIn} />);

      await user.click(screen.getByRole("button", { name: /Zoom in/i }));
      expect(onZoomIn).toHaveBeenCalledTimes(1);
    });

    it("calls onZoomOut when zoom out button is clicked", async () => {
      const onZoomOut = vi.fn();
      render(<GraphControls {...defaultProps} onZoomOut={onZoomOut} />);

      await user.click(screen.getByRole("button", { name: /Zoom out/i }));
      expect(onZoomOut).toHaveBeenCalledTimes(1);
    });

    it("calls onReset when reset button is clicked", async () => {
      const onReset = vi.fn();
      render(<GraphControls {...defaultProps} onReset={onReset} />);

      await user.click(screen.getByRole("button", { name: /Reset view/i }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, vi } from "vitest";
import { Modal } from "./Modal";
import { LuTriangleAlert } from "react-icons/lu";
import { createRef } from "react";

describe("Modal", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  describe("Rendering", () => {
    it("renders with title, description, and children", () => {
      const children = <span>Custom Content</span>;
      render(
        <Modal
          isOpened={true}
          title="Test Modal"
          description="This is a test description"
          children={children}
        />,
      );

      expect(
        screen.getByRole("heading", { name: /Test Modal/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This is a test description/i),
      ).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    });

    it("renders with custom icon", () => {
      render(<Modal isOpened={true} title="Warning" icon={LuTriangleAlert} />);
      expect(screen.getByTestId("modal-icon")).toBeInTheDocument();
    });

    it("applies correct size class", () => {
      const { rerender } = render(<Modal isOpened={true} size="lg" />);

      const modalDialog = screen.getByRole("dialog");
      expect(modalDialog).toHaveClass("max-w-2xl");

      rerender(<Modal isOpened={true} size="full" />);
      expect(screen.getByRole("dialog")).toHaveClass("max-w-[98vw]");
    });

    it("sets initial focus on close button when opened", async () => {
      render(<Modal isOpened={true} />);

      await waitFor(() => {
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(document.activeElement).toBe(closeButton);
      });
    });

    it("does not render when isOpened is false", () => {
      const { container } = render(<Modal isOpened={false} />);
      expect(container.firstChild).toBeNull();
    });

    it("respects custom initialFocusRef", async () => {
      const inputRef = createRef();
      render(
        <Modal isOpened={true} initialFocusRef={inputRef}>
          <input ref={inputRef} data-testid="custom-focus-input" />
        </Modal>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("custom-focus-input")).toHaveFocus();
      });
    });

    it("hides description in full mode", () => {
      render(
        <Modal
          isOpened={true}
          title="Full Modal"
          description="This should be hidden"
          size="full"
        />,
      );
      expect(
        screen.queryByText(/This should be hidden/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Actions", () => {
    it("calls onClose when close button is clicked", async () => {
      const onCloseMock = vi.fn();
      render(<Modal isOpened={true} onClose={onCloseMock} />);

      await user.click(screen.getByRole("button", { name: /close modal/i }));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when overlay is clicked", async () => {
      const onCloseMock = vi.fn();
      render(<Modal isOpened={true} onClose={onCloseMock} />);

      await user.click(screen.getByTestId("modal-overlay"));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Escape key is pressed", async () => {
      const onCloseMock = vi.fn();
      render(<Modal isOpened={true} onClose={onCloseMock} />);

      await user.keyboard("{Escape}");
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking inside modal content", async () => {
      const onCloseMock = vi.fn();
      render(<Modal isOpened={true} onClose={onCloseMock} />);

      await user.click(screen.getByTestId("modal-content"));
      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });
});

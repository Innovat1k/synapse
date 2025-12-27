import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useKeyboardDismiss } from "./useKeyboardDismiss";
import { describe, it, expect, vi, beforeEach } from "vitest";

const DismissableComponent = ({ isOpen, onDismiss }) => {
  useKeyboardDismiss({ isOpen, onDismiss });
  return <div data-testid="dismissable" />;
};

describe("useKeyboardDismiss", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  });

  it("should call onDismiss when Escape is pressed and isOpen is true", async () => {
    const onDismiss = vi.fn();

    render(<DismissableComponent isOpen={true} onDismiss={onDismiss} />);

    await user.keyboard("{Escape}");

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("should not call onDismiss when isOpen is false", async () => {
    const onDismiss = vi.fn();

    render(<DismissableComponent isOpen={false} onDismiss={onDismiss} />);

    await user.keyboard("{Escape}");

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("should not call onDismiss for other keys", async () => {
    const onDismiss = vi.fn();

    render(<DismissableComponent isOpen={true} onDismiss={onDismiss} />);

    await user.keyboard("{Enter}");
    await user.keyboard("a");

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("should clean up event listener on unmount", async () => {
    const onDismiss = vi.fn();
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(
      <DismissableComponent isOpen={true} onDismiss={onDismiss} />
    );

    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(0);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("should call onDismiss only once per Escape press", async () => {
    const onDismiss = vi.fn();

    render(<DismissableComponent isOpen={true} onDismiss={onDismiss} />);

    await user.keyboard("{Escape}");
    await user.keyboard("{Escape}");
    await user.keyboard("{Escape}");

    expect(onDismiss).toHaveBeenCalledTimes(3);
  });

  it("should work in a realistic modal-like component", async () => {
    const Modal = ({ isOpen, onClose }) => {
      useKeyboardDismiss({ isOpen, onDismiss: onClose });

      if (!isOpen) return null;
      return (
        <div role="dialog" data-testid="modal">
          <p>Modal content</p>
        </div>
      );
    };

    const onClose = vi.fn();
    const { rerender } = render(<Modal isOpen={true} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<Modal isOpen={false} onClose={onClose} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

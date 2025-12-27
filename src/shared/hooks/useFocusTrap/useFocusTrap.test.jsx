import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock offsetParent for JSDOM to correctly simulate visibility
const originalOffsetParentDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetParent"
);

Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  get() {
    if (this.style.display === "none" || this.hasAttribute("hidden")) {
      return null;
    }
    return this.parentElement || document.body;
  },
  configurable: true,
});

afterAll(() => {
  if (originalOffsetParentDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetParent",
      originalOffsetParentDescriptor
    );
  } else {
    delete HTMLElement.prototype.offsetParent;
  }
});

const TestFocusTrap = ({ isOpen }) => {
  const containerRef = useRef(null);
  useFocusTrap(isOpen, containerRef);

  return (
    <div ref={containerRef} data-testid="modal-container">
      <button data-testid="first-button">First</button>
      <input data-testid="input" placeholder="type here" />
      <button disabled>Disabled</button>
      <span aria-hidden="true">Hidden</span>
      <div style={{ display: "none" }}>
        <button>Hidden by CSS</button>
      </div>
      <button data-testid="last-button">Last</button>
    </div>
  );
};

const EmptyModal = ({ isOpen }) => {
  const containerRef = useRef(null);
  useFocusTrap(isOpen, containerRef);
  return <div ref={containerRef} data-testid="empty-container" />;
};

describe("useFocusTrap with userEvent", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  });

  it("should focus first focusable element on open", () => {
    render(<TestFocusTrap isOpen={true} />);
    expect(document.activeElement).toBe(screen.getByTestId("first-button"));
  });

  it("should focus container if no focusable elements", () => {
    render(<EmptyModal isOpen={true} />);
    const container = screen.getByTestId("empty-container");
    expect(document.activeElement).toBe(container);
    expect(container.tabIndex).toBe(-1);
  });

  it("should cycle focus forward with Tab", async () => {
    render(<TestFocusTrap isOpen={true} />);

    const first = screen.getByTestId("first-button");
    const input = screen.getByTestId("input");
    const last = screen.getByTestId("last-button");

    expect(document.activeElement).toBe(first);

    await user.tab();
    expect(document.activeElement).toBe(input);

    await user.tab();
    expect(document.activeElement).toBe(last);

    await user.tab();
    expect(document.activeElement).toBe(first);
  });

  it("should cycle focus backward with Shift+Tab", async () => {
    render(<TestFocusTrap isOpen={true} />);

    const first = screen.getByTestId("first-button");
    const last = screen.getByTestId("last-button");

    first.focus();
    expect(document.activeElement).toBe(first);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);

    await user.tab({ shift: true });
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(first);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it("should not apply initial focus or add event listener when closed", () => {
    const addSpy = vi.spyOn(document, "addEventListener");

    render(<TestFocusTrap isOpen={false} />);

    const first = screen.getByTestId("first-button");

    expect(document.activeElement).not.toBe(first);
    expect(document.activeElement).toBe(document.body);
    expect(addSpy).not.toHaveBeenCalled();

    addSpy.mockRestore();
  });

  it("should ignore non-focusable elements", () => {
    render(<TestFocusTrap isOpen={true} />);

    const disabledBtn = screen.getByText("Disabled");
    const hiddenBtn = screen.getByText("Hidden");
    const cssHiddenBtn = screen.getByText("Hidden by CSS");

    expect(disabledBtn).not.toBe(document.activeElement);
    expect(hiddenBtn).not.toBe(document.activeElement);
    expect(cssHiddenBtn).not.toBe(document.activeElement);
  });

  it("should clean up event listener on unmount", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<TestFocusTrap isOpen={true} />);
    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useInitialFocus } from "./useInitialFocus";

const TestInitialFocus = ({ isOpen, withRef = false }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useInitialFocus(isOpen, containerRef, withRef ? inputRef : undefined);

  return (
    <div ref={containerRef}>
      <button>First</button>
      <input ref={inputRef} data-testid="input" />
      <button>Last</button>
    </div>
  );
};

describe("useInitialFocus", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb();
      return 0;
    });
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  it("focuses the first focusable element when no ref is provided", async () => {
    render(<TestInitialFocus isOpen />);

    await waitFor(() => {
      expect(screen.getByText("First")).toHaveFocus();
    });
  });

  it("focuses the element provided by initialFocusRef", async () => {
    render(<TestInitialFocus isOpen withRef />);

    await waitFor(() => {
      expect(screen.getByTestId("input")).toHaveFocus();
    });
  });

  it("does nothing when isOpen is false", async () => {
    render(<TestInitialFocus isOpen={false} />);

    await waitFor(() => {
      expect(document.activeElement).toBe(document.body);
    });
  });

  it("does not throw if no focusable element exists", async () => {
    const NoFocusable = ({ isOpen }) => {
      const ref = useRef(null);
      useInitialFocus(isOpen, ref);
      return <div ref={ref}>No focus here</div>;
    };

    render(<NoFocusable isOpen />);

    expect(document.activeElement).toBe(document.body);
  });
});

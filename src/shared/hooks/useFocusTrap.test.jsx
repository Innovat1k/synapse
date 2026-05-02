import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, it, expect } from "vitest";
import { useFocusTrap } from "./useFocusTrap";

const TestFocusTrap = ({ isOpen }) => {
  const ref = useRef(null);
  useFocusTrap(isOpen, ref);

  return (
    <div ref={ref} tabIndex={-1} data-testid="container">
      <button data-testid="first">First</button>
      <input data-testid="input" />
      <button disabled>Disabled</button>
      <span aria-hidden="true">Hidden</span>
      <div style={{ display: "none" }}>
        <button>Hidden by CSS</button>
      </div>
      <button data-testid="last">Last</button>
    </div>
  );
};

describe("useFocusTrap", () => {
  it("traps focus when Tab is pressed and focus is already inside the container", async () => {
    const user = userEvent.setup();
    render(<TestFocusTrap isOpen />);

    const first = screen.getByTestId("first");
    const input = screen.getByTestId("input");
    const last = screen.getByTestId("last");

    first.focus();
    expect(first).toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();

    await user.tab();
    expect(last).toHaveFocus();

    await user.tab();
    expect(first).toHaveFocus();
  });

  it("cycles focus backward with Shift+Tab", async () => {
    const user = userEvent.setup();
    render(<TestFocusTrap isOpen />);

    const first = screen.getByTestId("first");
    const input = screen.getByTestId("input");
    const last = screen.getByTestId("last");

    first.focus();
    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(last).toHaveFocus();

    await user.tab({ shift: true });
    expect(input).toHaveFocus();

    await user.tab({ shift: true });
    expect(first).toHaveFocus();
  });

  it("does not trap focus when isOpen is false", async () => {
    const user = userEvent.setup();
    render(<TestFocusTrap isOpen={false} />);

    const first = screen.getByTestId("first");
    const input = screen.getByTestId("input");
    const last = screen.getByTestId("last");

    first.focus();
    expect(first).toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();

    await user.tab();
    expect(last).toHaveFocus();
  });

  it("handles a single focusable element", async () => {
    const user = userEvent.setup();

    const Single = ({ isOpen }) => {
      const ref = useRef(null);
      useFocusTrap(isOpen, ref);
      return (
        <div ref={ref} tabIndex={-1}>
          <button data-testid="only">Only</button>
        </div>
      );
    };

    render(<Single isOpen />);

    const only = screen.getByTestId("only");
    only.focus();
    expect(only).toHaveFocus();

    await user.tab();
    expect(only).toHaveFocus();

    await user.tab({ shift: true });
    expect(only).toHaveFocus();
  });
});

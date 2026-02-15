import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { GraphModal } from "./GraphModal";
import userEvent from "@testing-library/user-event";

describe("GraphModal", () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders GraphModal with correct elements and children", () => {
    const children = <span>GraphView</span>;
    render(
      <GraphModal isOpened={true} skillName={"Julia"} children={children} />,
    );

    expect(
      screen.getByRole("heading", { name: /Knowledge Graph/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Julia/i)).toBeInTheDocument();
    expect(screen.getByTestId("center-skill-description")).toHaveTextContent(
      /Connections around/i,
    );
    expect(screen.getByText("GraphView")).toBeInTheDocument();
  });

  it("calls 'onClose' if close button is clicked", async () => {
    const onCloseMock = vi.fn();
    render(<GraphModal isOpened={true} onClose={onCloseMock} />);

    const closeButton = screen.getByRole("button", {
      name: /close knowledge graph/i,
    });
    expect(closeButton).toHaveAttribute("aria-label", "Close knowledge graph");

    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", async () => {
    const onCloseMock = vi.fn();
    render(<GraphModal isOpened={true} onClose={onCloseMock} />);

    const backdrop = screen.getByTestId("modal-overlay");
    await user.click(backdrop);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onCloseMock = vi.fn();
    render(<GraphModal isOpened={true} onClose={onCloseMock} />);

    await user.keyboard("{Escape}");

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("sets initial focus on close button when opened", async () => {
    render(<GraphModal isOpened={true} />);

    await waitFor(() => {
      const closeButton = screen.getByRole("button", {
        name: /close knowledge graph/i,
      });
      expect(document.activeElement).toBe(closeButton);
    });
  });

  it("does not close when clicking inside modal content", async () => {
    const onCloseMock = vi.fn();
    render(<GraphModal isOpened={true} onClose={onCloseMock} />);

    const modalDialog = screen.getByRole("dialog");
    await user.click(modalDialog);

    expect(onCloseMock).not.toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { UnlinkConfirmModal } from "./UnlinkConfirmModal";
import userEvent from "@testing-library/user-event";

const mockLink = {
  id: "link-123",
  source_skill_id: "skill-b",
  target_skill_id: "skill-a",
  type: "prerequisite",
  skill_name: "Next JS",
};

const renderComponent = ({
  isLoading = false,
  link = mockLink,
  skill = { name: "React JS", skill_id: "skill-a" },
  onClose = vi.fn(),
  onConfirm = vi.fn(),
}) => {
  return render(
    <UnlinkConfirmModal
      isOpened={true}
      isLoading={isLoading}
      link={link}
      skill={skill}
      onClose={onClose}
      onConfirm={onConfirm}
    />,
  );
};

describe("UnlinkConfirmModal", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders correctly if link and skill are passed", () => {
    renderComponent({ isLoading: false });

    expect(screen.getByRole("heading", { name: /sever synapse?/i }));
    expect(screen.getByTestId("action-description")).toHaveTextContent(
      /remove the link between Next JS and React JS/i,
    );
    expect(
      screen.getByRole("button", { name: /keep link/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sever!/i })).toBeInTheDocument();
  });

  it("displays loader button state while loading", () => {
    renderComponent({ isLoading: true });

    expect(screen.getByRole("heading", { name: /sever synapse?/i }));
    expect(screen.getByRole("button", { name: /severing.../i })).toBeDisabled();
    expect(screen.getByText(/severing.../i)).toBeInTheDocument();
  });

  it("calls onClose if 'Keep link' is clicked", async () => {
    const mockOnClose = vi.fn();
    renderComponent({ onClose: mockOnClose });

    expect(screen.getByRole("heading", { name: /sever synapse?/i }));

    await user.click(screen.getByRole("button", { name: /keep link/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm if 'Sever!' is clicked", async () => {
    const mockOnConfirm = vi.fn();
    renderComponent({ onConfirm: mockOnConfirm });

    expect(screen.getByRole("heading", { name: /sever synapse?/i }));

    await user.click(screen.getByRole("button", { name: /sever!/i }));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});

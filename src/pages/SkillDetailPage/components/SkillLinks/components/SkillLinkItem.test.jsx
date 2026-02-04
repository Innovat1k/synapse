import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { SkillLinkItem } from "./SkillLinkItem";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const renderComponent = ({ isEditing = false, onUnlink = vi.fn() }) => {
  render(
    <MemoryRouter>
      <SkillLinkItem
        skillName={"Cybersecurity"}
        linkType="prerequisite"
        isEditing={isEditing}
        onUnlink={onUnlink}
        to={"/skills/cybersecurity-skill"}
      />
    </MemoryRouter>,
  );
};

describe("SkillLinkItem", () => {
  it("renders a navigable link by default", () => {
    renderComponent({ isEditing: false });

    expect(
      screen.getByRole("link", { name: /cybersecurity, prerequisite/i }),
    ).toHaveAttribute("href", "/skills/cybersecurity-skill");
  });

  it("renders a removal button while editing", () => {
    renderComponent({ isEditing: true });

    expect(
      screen.getByRole("button", { name: /remove link to cybersecurity/i }),
    ).toBeInTheDocument();
  });

  it("calls 'onUnlink' when the removal button is clicked in edit mode", async () => {
    const mockOnUnlink = vi.fn();
    renderComponent({ isEditing: true, onUnlink: mockOnUnlink });

    await userEvent.click(
      screen.getByRole("button", { name: /remove link to cybersecurity/i }),
    );

    expect(mockOnUnlink).toHaveBeenCalledTimes(1);
  });
});

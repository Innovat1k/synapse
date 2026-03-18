import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { CategorySelector } from "./CategorySelector";

const mockCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
];

describe("CategorySelector", () => {
  it("renders 'All Categories' and all category options", () => {
    render(<CategorySelector categories={mockCategories} />);

    const select = screen.getByRole("combobox");
    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(select).toHaveValue("");
  });

  it("reflects the selected category", () => {
    render(
      <CategorySelector
        categories={mockCategories}
        selectedCategory="frontend"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("frontend");
  });

  it("calls onSelect when selection changes", async () => {
    const user = userEvent.setup();
    const onSelectMock = vi.fn();

    render(
      <CategorySelector
        categories={mockCategories}
        selectedCategory=""
        onSelect={onSelectMock}
      />,
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "backend");

    expect(onSelectMock).toHaveBeenCalledWith("backend");
  });

  it("applies correct size classes when size='sm'", () => {
    render(<CategorySelector categories={mockCategories} size="sm" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("text-xs");
    expect(select).toHaveClass("py-1.5");
  });
});

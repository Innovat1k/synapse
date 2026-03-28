import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResourceForm } from "./ResourceForm";
import { beforeEach, vi, describe, it, expect } from "vitest";

const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
];

describe("ResourceForm", () => {
  let user;
  let mockOnSubmit;
  let mockOnTitleChange;
  let mockOnCategoryChange;

  beforeEach(() => {
    user = userEvent.setup();
    mockOnSubmit = vi.fn((e) => e.preventDefault());
    mockOnTitleChange = vi.fn();
    mockOnCategoryChange = vi.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <ResourceForm
        title=""
        category=""
        generatedId=""
        categories={CATEGORIES}
        onTitleChange={mockOnTitleChange}
        onCategoryChange={mockOnCategoryChange}
        onSubmit={mockOnSubmit}
        {...props}
      />,
    );
  };

  it("renders form fields and submit button", () => {
    renderComponent();

    expect(screen.getByLabelText(/Track Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Track/i }),
    ).toBeInTheDocument();
  });

  it("displays provided title and generatedId", () => {
    renderComponent({
      title: "React Architecture",
      generatedId: "react-architecture",
    });

    expect(screen.getByDisplayValue("React Architecture")).toBeInTheDocument();

    expect(screen.getByText("react-architecture")).toBeInTheDocument();
  });

  it("calls onTitleChange when typing", async () => {
    renderComponent();

    const input = screen.getByLabelText(/Track Title/i);
    await user.type(input, "React");

    expect(mockOnTitleChange).toHaveBeenCalled();
  });

  it("calls onCategoryChange when selecting a category", async () => {
    renderComponent();

    const select = screen.getByLabelText(/Category/i);
    await user.selectOptions(select, "backend");

    expect(mockOnCategoryChange).toHaveBeenCalledWith("backend");
  });

  it("disables submit button when title is empty", () => {
    renderComponent({ title: "" });

    expect(
      screen.getByRole("button", { name: /Create Track/i }),
    ).toBeDisabled();
  });

  it("enables submit button when title is provided", () => {
    renderComponent({ title: "React" });

    expect(
      screen.getByRole("button", { name: /Create Track/i }),
    ).not.toBeDisabled();
  });

  it("calls onSubmit when form is submitted", async () => {
    renderComponent({ title: "React" });

    const button = screen.getByRole("button", {
      name: /Create Track/i,
    });

    await user.click(button);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});

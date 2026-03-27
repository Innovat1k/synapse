import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import Dashboard from "../DashBoard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { clearSkills } from "@mocks/stores";

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

describe("Dashboard – Create Skill Flow", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    clearSkills();
  });

  it("allows user to create first skill if cta button is clicked", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );
    expect(screen.getByText(/cannot log activity/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /create my first skill/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /log activity/i }),
      ).not.toBeInTheDocument();
    });

    const createSkillModal = within(screen.getByTestId("skill-modal-content"));

    expect(
      createSkillModal.getByRole("heading", { name: /add new skill/i }),
    ).toBeInTheDocument();

    await user.type(createSkillModal.getByLabelText(/name/i), "Node JS");

    await user.click(
      createSkillModal.getByRole("button", { name: /learning track/i }),
    );
    expect(
      screen.getByRole("listbox", { name: /learning track/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("option", { name: /React Fundamentals/i }),
    );

    // NOTE:
    // React Aria <Select> renders a pseudo-label (<span for="...">) that JSDOM misinterprets,
    // breaking accessible names for subsequent fields (e.g., "Category").
    // We use a data-testid here to avoid this issue.

    await user.type(createSkillModal.getByTestId("category-input"), "backend");

    const levelSlider = createSkillModal.getByLabelText(/level/i);
    await user.click(levelSlider);
    fireEvent.change(levelSlider, { target: { value: "2" } });

    await user.type(
      createSkillModal.getByLabelText(/description/i),
      "Moving to a JS backend language.",
    );

    await user.type(createSkillModal.getByLabelText(/tags/i), "server");
    await user.click(
      createSkillModal.getByRole("button", { name: /add tag/i }),
    );

    await user.click(
      createSkillModal.getByRole("button", { name: /save skill/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId("skill-modal-overlay"),
      ).not.toBeInTheDocument();
    });

    expect(await screen.findByTestId("skill-count-badge")).toHaveTextContent(
      "01",
    );
  });
});

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import Dashboard from "../DashBoard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { clearSkills, resetAllStores } from "@mocks/stores";

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

describe("Dashboard – Log Activity Flow", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
    resetAllStores();
  });

  it("opens log activity modal with creating skill cta if skills list is empty", async () => {
    clearSkills();
    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );

    expect(screen.getByText(/cannot log activity/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /you must have at least one skill to record an activity/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create my first skill/i }),
    ).toBeInTheDocument();
  });

  it("opens log activity modal and allows to create an activity", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );

    expect(
      screen.getByRole("heading", { name: /log activity/i }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/minutes/i), "43");

    await user.click(screen.getByLabelText(/skill/i));

    await user.click(
      await screen.findByRole("option", {
        name: /project management/i,
      }),
    );

    await user.click(screen.getByLabelText(/activity type/i));

    await user.click(
      await screen.findByRole("option", {
        name: /project work/i,
      }),
    );

    await user.click(screen.getByRole("button", { name: /add activity/i }));

    expect(
      screen.queryByTestId("activity-modal-content"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /log activity/i }),
    ).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );
    expect(
      screen.queryByRole("heading", { name: /cannot log activity/i }),
    ).not.toBeInTheDocument();
  }, 10000);
});

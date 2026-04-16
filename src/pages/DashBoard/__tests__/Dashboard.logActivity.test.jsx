import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import Dashboard from "../DashBoard";
import userEvent from "@testing-library/user-event";
import { clearSkills } from "@mocks/stores";
import { clearActivities } from "@mocks/stores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { Provider } from "jotai";
import { user_atom, session_atom } from "@atoms/atoms";

const TEST_USER_ID = "025af00a-1837-44e0-b03d-6150e1da4611";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID, email: "test@example.com" },
    loader: { isInitialLoading: false },
  }),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

const createJotaiProvider = ({ children }) => (
  <Provider
    initialValues={[
      [user_atom, { id: TEST_USER_ID, email: "test@example.com" }],
      [session_atom, { user: { id: TEST_USER_ID }, access_token: "mock" }],
    ]}
  >
    {children}
  </Provider>
);

const buildWrapper = () => {
  const queryClient = createQueryClient();

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReactFlowProvider>
          {createJotaiProvider({ children })}
        </ReactFlowProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui) => render(ui, { wrapper: buildWrapper() });

describe("Dashboard – Log Activity Flow", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup({ delay: null });
  });

  it("opens log activity modal with creating skill cta if skills list is empty", async () => {
    clearSkills();
    clearActivities();

    renderWithProviders(<Dashboard />);

    expect(await screen.findByText(/no focus yet/i)).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: /log your first activity/i }),
    );

    const activityModal = within(
      await screen.findByTestId("activity-modal-content"),
    );

    expect(activityModal.getByText(/cannot log activity/i)).toBeInTheDocument();
    expect(
      activityModal.getByText(
        /you must have at least one skill to record an activity/i,
      ),
    ).toBeInTheDocument();
    expect(
      activityModal.getByRole("button", { name: /create my first skill/i }),
    ).toBeInTheDocument();
  });

  it("opens log activity modal and allows to create an activity", async () => {
    renderWithProviders(<Dashboard />);

    expect(await screen.findByText(/current focus/i)).toBeInTheDocument();
    expect(await screen.findByTestId("skill-count-badge")).toHaveTextContent(
      "03",
    );

    await user.click(
      await screen.findByRole("button", { name: /log other activity/i }),
    );

    const activityModal = within(
      await screen.findByTestId("activity-modal-content"),
    );

    expect(
      activityModal.getByRole("heading", { name: /log activity/i }),
    ).toBeInTheDocument();

    const minutesInput = activityModal.getByRole("spinbutton", {
      name: /minutes/i,
    });
    await user.clear(minutesInput);
    await user.type(minutesInput, "43");

    await user.click(activityModal.getByLabelText(/skill/i));
    await user.click(
      await screen.findByRole("option", {
        name: /project management/i,
      }),
    );

    await user.click(
      activityModal.getByRole("button", { name: /activity type/i }),
    );
    expect(
      await screen.findByRole("listbox", {
        name: /activity type/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("option", {
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

    await user.click(await screen.findByRole("button", { name: /log for/i }));
    expect(
      screen.queryByRole("heading", { name: /cannot log activity/i }),
    ).not.toBeInTheDocument();
  }, 10000);
});

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import Dashboard from "../DashBoard";
import { TEST_USER_ID } from "@mocks/stores";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID, email: "user@mail.com" },
    loader: { isInitialLoading: false },
  }),
}));

const Wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

describe("Dashboard – Graph Rendering and Interaction", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("loads skills and renders nodes in the graph", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    expect(await screen.findByText(/current focus/i)).toBeInTheDocument();
    expect(await screen.findByTestId("skills-count-badge")).toHaveTextContent(
      "03",
    );

    const knowledgeGraph = screen.getByTestId("knowledge-graph-widget");
    expect(knowledgeGraph).toBeInTheDocument();
    expect(
      await within(knowledgeGraph).findByText(/React JS/i),
    ).toBeInTheDocument();
    expect(
      await within(knowledgeGraph).findByText(/Java/i),
    ).toBeInTheDocument();
  });

  it("renders the full screen knowledge graph contents correctly", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await within(screen.getByTestId("skills-widget")).findByText("React JS");

    await user.click(screen.getByRole("button", { name: /expand graph/i }));
    expect(
      screen.getByRole("heading", { name: /knowledge graph/i }),
    ).toBeInTheDocument();

    const knowledgeGraph = screen.getByTestId("knowledge-graph-modal-content");

    expect(within(knowledgeGraph).getByText("React JS")).toBeInTheDocument();
    expect(within(knowledgeGraph).getByText("Java")).toBeInTheDocument();
  });

  it("applies track filter and updates graph content", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await within(screen.getByTestId("skills-widget")).findByText("React JS");

    await user.click(screen.getByRole("button", { name: /expand graph/i }));
    expect(
      screen.getByRole("heading", { name: /knowledge graph/i }),
    ).toBeInTheDocument();

    const trackSelect = screen.getByRole("combobox", { name: /track/i });
    await userEvent.selectOptions(trackSelect, "react-fundamentals");
    expect(trackSelect).toHaveValue("react-fundamentals");

    const fullscreenGraph = within(
      screen.getByTestId("knowledge-graph-modal-content"),
    );

    expect(fullscreenGraph.getByText("React JS")).toBeInTheDocument();
    expect(fullscreenGraph.queryByText("Java")).not.toBeInTheDocument();
    expect(
      fullscreenGraph.queryByText("Project Management"),
    ).not.toBeInTheDocument();
  });

  it("applies category filter and updates graph", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await within(screen.getByTestId("skills-widget")).findByText("React JS");

    await user.click(screen.getByRole("button", { name: /expand graph/i }));
    expect(
      screen.getByRole("heading", { name: /knowledge graph/i }),
    ).toBeInTheDocument();

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    await userEvent.selectOptions(categorySelect, "backend");
    expect(categorySelect).toHaveValue("backend");

    const fullscreenGraph = within(
      screen.getByTestId("knowledge-graph-modal-content"),
    );

    expect(fullscreenGraph.getByText("Java")).toBeInTheDocument();
    expect(fullscreenGraph.queryByText("React JS")).not.toBeInTheDocument();
  });
});

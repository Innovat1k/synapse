import { render, screen } from "@testing-library/react";
import { GraphNavigator } from "./GraphNavigator";
import { describe } from "vitest";

const MockGraphContent = () => (
  <div data-testid="mock-graph-content">Mock Graph</div>
);

describe("GraphNavigator", () => {
  it("renders graph content and navigation controls", () => {
    render(
      <GraphNavigator nodeCount={3}>
        <MockGraphContent />
      </GraphNavigator>,
    );

    expect(screen.getByTestId("mock-graph-content")).toBeInTheDocument();
    expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
    expect(screen.getByLabelText("Zoom out")).toBeInTheDocument();
    expect(screen.getByLabelText("Reset view")).toBeInTheDocument();
  });
});

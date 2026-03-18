import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillNode } from "./SkillNode";
import { ReactFlowProvider } from "@xyflow/react";

describe("SkillNode", () => {
  it("renders skill name and category", () => {
    render(
      <ReactFlowProvider>
        <SkillNode
          data={{
            label: "React",
            level: 3,
            category: "frontend",
            status: "available",
          }}
        />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("renders without crashing for edge cases", () => {
    const { container } = render(
      <ReactFlowProvider>
        <SkillNode
          data={{ label: "Test", level: 0, category: "", status: "locked" }}
        />
      </ReactFlowProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it("applies locked state correctly", () => {
    render(
      <ReactFlowProvider>
        <SkillNode
          data={{
            label: "Advanced TypeScript",
            level: 2,
            category: "frontend",
            status: "locked",
          }}
        />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("Advanced TypeScript")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("handles edge cases: level 0, level 5, no category", () => {
    render(
      <ReactFlowProvider>
        <SkillNode
          data={{
            label: "New Skill",
            level: 0,
            category: "",
            status: "available",
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getByText("New Skill")).toBeInTheDocument();

    render(
      <ReactFlowProvider>
        <SkillNode
          data={{
            label: "Expert Mode",
            level: 5,
            category: "backend",
            status: "available",
          }}
        />
      </ReactFlowProvider>,
    );
    expect(screen.getByText("Expert Mode")).toBeInTheDocument();
    expect(screen.getByText("backend")).toBeInTheDocument();
  });
});

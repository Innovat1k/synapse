// GraphContent.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReactFlowProvider } from "@xyflow/react";
import { GraphContent } from "./GraphContent";

const Wrapper = ({ children }) => (
  <div style={{ width: "800px", height: "600px" }}>
    <ReactFlowProvider>{children}</ReactFlowProvider>
  </div>
);

describe("GraphContent", () => {
  const skills = [
    { skill_id: "1", name: "React", level: 4, category: "ui", track_id: "t1" },
  ];
  const links = [];

  it("renders without crashing", () => {
    render(
      <GraphContent
        skills={skills}
        links={links}
        isCompact={false}
        selectors={null}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("shows controls when not compact", () => {
    render(
      <GraphContent
        skills={skills}
        links={links}
        isCompact={false}
        selectors={null}
      />,
      { wrapper: Wrapper },
    );

    expect(
      screen.getByRole("button", { name: /zoom in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /zoom out/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /fit view/i }),
    ).toBeInTheDocument();
  });

  it("hides controls when compact", () => {
    render(
      <GraphContent
        skills={skills}
        links={links}
        isCompact={true}
        selectors={null}
      />,
      { wrapper: Wrapper },
    );

    expect(
      screen.queryByRole("button", { name: /zoom in/i }),
    ).not.toBeInTheDocument();
  });
});

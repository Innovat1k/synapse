import { render, screen } from "@testing-library/react";
import { GraphTooltip } from "./GraphTooltip";

const mockNode = {
  id: "skill-react",
  label: "React",
  status: "completed",
};

const mockMutualSkills = new Set(["skill-js"]);
const mockIncoming = new Set(["skill-html"]);
const mockMousePos = { x: 100, y: 200 };

describe("GraphTooltip", () => {
  it("renders tooltip with correct content for desktop", () => {
    render(
      <GraphTooltip
        node={mockNode}
        isMobile={false}
        mutualSkills={mockMutualSkills}
        incoming={mockIncoming}
        config={{ tooltipBottom: "20px" }}
        mousePos={mockMousePos}
      />,
    );

    const tooltip = screen.getByTestId("graph-tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("React");
    expect(tooltip).toHaveTextContent("Status: completed");
    expect(tooltip).toHaveTextContent("Unlocked after mastering core");
  });

  it("renders tooltip with prerequisite message", () => {
    const nodeWithPrereq = { ...mockNode, id: "skill-html" };
    render(
      <GraphTooltip
        node={nodeWithPrereq}
        isMobile={false}
        mutualSkills={mockMutualSkills}
        incoming={new Set(["skill-html"])}
        config={{ tooltipBottom: "20px" }}
        mousePos={mockMousePos}
      />,
    );

    expect(screen.getByTestId("graph-tooltip")).toHaveTextContent(
      "Required to reach core skill",
    );
  });

  it("renders tooltip with mutual dependency message", () => {
    const nodeWithMutual = { ...mockNode, id: "skill-js" };
    render(
      <GraphTooltip
        node={nodeWithMutual}
        isMobile={false}
        mutualSkills={new Set(["skill-js"])}
        incoming={mockIncoming}
        config={{ tooltipBottom: "20px" }}
        mousePos={mockMousePos}
      />,
    );

    expect(screen.getByTestId("graph-tooltip")).toHaveTextContent(
      "Mutual dependency with core",
    );
  });

  it("shows complete button on mobile for available skills", () => {
    render(
      <GraphTooltip
        node={{ id: "test", label: "Test", status: "available" }}
        isMobile={true}
        mutualSkills={new Set()}
        incoming={new Set()}
        config={{}}
        onComplete={() => {}}
        mousePos={mockMousePos}
      />,
    );
    expect(
      screen.getByRole("button", { name: /mark as completed/i }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphView } from "./GraphView";
import { setWindowWidth } from "../../../../shared/utils/utils";

const mockCenterSkillId = "skill-react";
const mockNodes = [
  { id: "skill-react", label: "React", status: "completed" },
  { id: "skill-js", label: "JavaScript", status: "completed" },
  { id: "skill-html", label: "HTML", status: "available" },
  { id: "skill-pm", label: "Project Management", status: "locked" },
];
const mockLinks = [
  { source: "skill-js", target: "skill-react" },
  { source: "skill-react", target: "skill-js" },
  { source: "skill-html", target: "skill-react" },
  { source: "skill-react", target: "skill-pm" },
];

describe("GraphView", () => {
  beforeEach(() => {
    setWindowWidth(1200);
  });

  it("renders without crashing", () => {
    render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    expect(screen.getByTestId("graph-container")).toBeInTheDocument();
  });

  it("renders center node with teal color", () => {
    const { container } = render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    const centerNode = container.querySelector('circle[stroke="#2dd4bf"]');
    expect(centerNode).toBeInTheDocument();
  });

  it("renders prerequisite node with amber color", () => {
    const { container } = render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    const amberNode = container.querySelector('circle[stroke="#f59e0b"]');
    expect(amberNode).toBeInTheDocument();
  });

  it("renders unlock node with cyan color", () => {
    const { container } = render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    const unlockNode = container.querySelector('circle[stroke="#22d3ee"]');
    expect(unlockNode).toBeInTheDocument();
  });

  it("renders mutual dependency node with indigo color", () => {
    const { container } = render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    const indigoNodes = container.querySelectorAll('circle[stroke="#6366f1"]');
    expect(indigoNodes.length).toBe(1);
  });

  it("shows tooltip on hover (desktop)", async () => {
    const user = userEvent.setup();
    render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );

    const jsNode = screen.getByTestId("graph-node-skill-js");
    await user.hover(jsNode);

    const tooltip = await screen.findByTestId("graph-tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("JavaScript");
    expect(tooltip).toHaveTextContent("Mutual dependency with core");
  });

  it("shows tooltip on tap (mobile)", async () => {
    setWindowWidth(375);
    const user = userEvent.setup();

    render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );

    const htmlNode = screen.getByTestId("graph-node-skill-html");
    await user.click(htmlNode);

    const tooltip = screen.getByTestId("graph-tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("HTML");
    expect(tooltip).toHaveTextContent("Required to reach core skill");

    setWindowWidth(1200);
  });

  it("shows legend in column layout on mobile", () => {
    setWindowWidth(375);
    render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    const legend = screen.getByTestId("graph-legend");
    expect(legend).toHaveClass("flex-col");
    setWindowWidth(1200);
  });

  it("renders single node when center skill has no connections", () => {
    const singleNode = [
      { id: "skill-solo", label: "Solo Skill", status: "available" },
    ];
    render(
      <GraphView centerSkillId="skill-solo" nodes={singleNode} links={[]} />,
    );
    expect(screen.getByTestId("graph-node-skill-solo")).toBeInTheDocument();
  });

  it("renders all legend items", () => {
    render(
      <GraphView
        centerSkillId={mockCenterSkillId}
        nodes={mockNodes}
        links={mockLinks}
      />,
    );
    expect(screen.getByTestId("legend-amber")).toBeInTheDocument();
    expect(screen.getByTestId("legend-indigo")).toBeInTheDocument();
    expect(screen.getByTestId("legend-cyan")).toBeInTheDocument();
  });
});

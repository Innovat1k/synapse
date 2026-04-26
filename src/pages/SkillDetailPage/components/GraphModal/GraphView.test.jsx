import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphView } from "./GraphView";
import { beforeEach, describe, expect, it, vi } from "vitest";


let isMobileMock = false;

vi.mock("./hooks/useTooltipPosition", () => ({
  useTooltipPosition: () => ({
    visible: true,
  }),
}));

const mockState = {
  hoveredNodeId: "skill-js",
  hoveredNode: { id: "skill-js", label: "JavaScript" },
  nodesWithStatus: [
    { id: "skill-react", label: "React", status: "completed" },
    { id: "skill-js", label: "JavaScript", status: "completed" },
    { id: "skill-html", label: "HTML", status: "available" },
    { id: "skill-pm", label: "Project Management", status: "locked" },
  ],
  mousePos: { x: 0, y: 0 },
};

const mockMethods = {
  handleMouseMove: vi.fn(),
  setHoveredNode: vi.fn(),
  handleNodeClick: vi.fn(),
  handleNodeInteraction: vi.fn(),
  completeSkill: vi.fn(),
};

vi.mock("./hooks/useGraphInteraction", () => ({
  useGraphInteraction: () => ({
    isMobile: isMobileMock,
    state: mockState,
    methods: mockMethods,
  }),
}));


vi.mock("./hooks/useGraphLayout", () => ({
  useGraphLayout: () => ({
    nodePositions: new Map([
      ["skill-react", { x: 100, y: 100 }],
      ["skill-js", { x: 200, y: 100 }],
      ["skill-html", { x: 100, y: 200 }],
      ["skill-pm", { x: 200, y: 200 }],
    ]),
    mutualSkills: new Set(["skill-js"]),
    incoming: new Set(["skill-html"]),
    config: {
      viewBox: "0 0 300 300",
    },
  }),
}));



const mockNodes = mockState.nodesWithStatus;

const mockLinks = [
  { source: "skill-js", target: "skill-react" },
  { source: "skill-react", target: "skill-js" },
  { source: "skill-html", target: "skill-react" },
  { source: "skill-react", target: "skill-pm" },
];

const renderGraph = () =>
  render(
    <GraphView
      centerSkillId="skill-react"
      nodes={mockNodes}
      links={mockLinks}
    />,
  );



describe("GraphView (robust)", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    isMobileMock = false;
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders container", () => {
      renderGraph();
      expect(screen.getByTestId("graph-container")).toBeInTheDocument();
    });

    it("renders all nodes", () => {
      renderGraph();

      expect(screen.getByTestId("graph-node-skill-react")).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-js")).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-html")).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-pm")).toBeInTheDocument();
    });

    it("assigns correct roles", () => {
      renderGraph();

      expect(screen.getByTestId("node-circle-skill-react")).toHaveAttribute(
        "data-role",
        "center",
      );

      expect(screen.getByTestId("node-circle-skill-js")).toHaveAttribute(
        "data-role",
        "mutual",
      );

      expect(screen.getByTestId("node-circle-skill-html")).toHaveAttribute(
        "data-role",
        "prerequisite",
      );

      expect(screen.getByTestId("node-circle-skill-pm")).toHaveAttribute(
        "data-role",
        "unlock",
      );
    });

    it("renders legend", () => {
      renderGraph();

      expect(screen.getByTestId("legend-amber")).toBeInTheDocument();
      expect(screen.getByTestId("legend-indigo")).toBeInTheDocument();
      expect(screen.getByTestId("legend-cyan")).toBeInTheDocument();
    });
  });

  describe("Tooltip", () => {
    it("renders tooltip when visible", async () => {
      renderGraph();

      expect(await screen.findByTestId("graph-tooltip")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls desktop click handler", async () => {
      renderGraph();

      const node = screen.getByTestId("graph-node-skill-html");

      await user.click(node);

      expect(mockMethods.handleNodeClick).toHaveBeenCalledWith(
        "skill-html",
        "available",
      );
    });
  });

  describe("Mobile", () => {
    it("uses mobile interaction handler", async () => {
      isMobileMock = true;

      renderGraph();

      const node = screen.getByTestId("graph-node-skill-html");

      await user.click(node);

      expect(mockMethods.handleNodeInteraction).toHaveBeenCalledWith(
        "skill-html",
        false,
      );
    });
  });
});

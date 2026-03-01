import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphView } from "./GraphView";
import { setWindowWidth } from "@shared/utils/utils";
import { beforeEach, describe, expect } from "vitest";

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

const renderGraphView = ({
  nodes = mockNodes,
  centerSkillId = mockCenterSkillId,
  links = mockLinks,
} = {}) => {
  return render(
    <GraphView centerSkillId={centerSkillId} nodes={nodes} links={links} />,
  );
};

describe("GraphView", () => {
  let user;

  beforeEach(() => {
    localStorage.clear();
    user = userEvent.setup();
  });

  describe("Rendering", () => {
    describe("Desktop", () => {
      beforeEach(() => {
        setWindowWidth(1200);
      });

      it("renders without crashing", () => {
        renderGraphView();
        expect(screen.getByTestId("graph-container")).toBeInTheDocument();
      });

      it("renders center node with teal color", () => {
        const { container } = renderGraphView();

        const centerNode = container.querySelector('circle[stroke="#2dd4bf"]');
        expect(centerNode).toBeInTheDocument();
      });

      it("renders prerequisite node with amber color", () => {
        const { container } = renderGraphView();

        const amberNode = container.querySelector('circle[stroke="#f59e0b"]');
        expect(amberNode).toBeInTheDocument();
      });

      it("renders unlock node with cyan color", () => {
        const { container } = renderGraphView();

        const unlockNode = container.querySelector('circle[stroke="#22d3ee"]');
        expect(unlockNode).toBeInTheDocument();
      });

      it("renders mutual dependency node with indigo color", () => {
        const { container } = renderGraphView();

        const indigoNodes = container.querySelectorAll(
          'circle[stroke="#6366f1"]',
        );
        expect(indigoNodes.length).toBe(1);
      });

      it("renders single node when center skill has no connections", () => {
        const singleNode = [
          { id: "skill-solo", label: "Solo Skill", status: "available" },
        ];
        renderGraphView({
          centerSkillId: "skill-solo",
          nodes: singleNode,
          links: [],
        });

        expect(screen.getByTestId("graph-node-skill-solo")).toBeInTheDocument();
      });

      it("renders all legend items", () => {
        renderGraphView();

        expect(screen.getByTestId("legend-amber")).toBeInTheDocument();
        expect(screen.getByTestId("legend-indigo")).toBeInTheDocument();
        expect(screen.getByTestId("legend-cyan")).toBeInTheDocument();
      });

      it("shows navigation controls on desktop", () => {
        renderGraphView();
        expect(
          screen.getByRole("button", { name: /Zoom in/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Zoom out/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Reset view/i }),
        ).toBeInTheDocument();
      });
    });

    describe("Mobile", () => {
      beforeEach(() => {
        setWindowWidth(375);
      });

      it("shows legend in column layout on mobile", () => {
        renderGraphView();

        const legend = screen.getByTestId("graph-legend");
        expect(legend).toHaveClass("flex-col");
      });

      it("shows navigation controls on mobile", () => {
        renderGraphView();
        expect(
          screen.getByRole("button", { name: /Zoom in/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Zoom out/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /Reset view/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Interactions", () => {
    describe("Desktop", () => {
      beforeEach(() => {
        setWindowWidth(1200);
      });

      it("shows tooltip on hover", async () => {
        renderGraphView();

        const jsNode = screen.getByTestId("graph-node-skill-js");
        await user.hover(jsNode);

        const tooltip = await screen.findByTestId("graph-tooltip");
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent("JavaScript");
        expect(tooltip).toHaveTextContent("Mutual dependency with core");
      });

      it("allows completing an available skill on desktop click", async () => {
        const testNodes = [
          { id: "skill-react", label: "React", status: "completed" },
          { id: "skill-js", label: "JavaScript", status: "completed" },
          { id: "skill-html", label: "HTML", status: "available" },
          { id: "skill-pm", label: "Project Management", status: "locked" },
        ];
        renderGraphView({ centerSkillId: "skill-react", nodes: testNodes });

        const htmlNode = screen.getByTestId("graph-node-skill-html");
        await user.click(htmlNode);

        expect(htmlNode.querySelector("path")).toBeInTheDocument();
      });
    });

    describe("Mobile", () => {
      beforeEach(() => {
        setWindowWidth(375);
      });

      it("shows tooltip on tap", async () => {
        renderGraphView();

        const htmlNode = screen.getByTestId("graph-node-skill-html");
        await user.click(htmlNode);

        expect(await screen.findByTestId("graph-tooltip")).toBeInTheDocument();
      });

      it("completes skill via mobile tooltip button", async () => {
        renderGraphView();

        const htmlNode = screen.getByTestId("graph-node-skill-html");
        await user.click(htmlNode);

        const tooltip = await screen.findByTestId("graph-tooltip");
        expect(tooltip).toHaveTextContent("HTML");

        const completeBtn = screen.getByRole("button", {
          name: /mark as completed/i,
        });
        expect(completeBtn).toBeInTheDocument();

        await user.click(completeBtn);

        expect(htmlNode.querySelector("path")).toBeInTheDocument();
      });

      it("completes skill via mobile tooltip button", async () => {
        renderGraphView();

        await user.click(screen.getByTestId("graph-node-skill-html"));
        await user.click(
          screen.getByRole("button", { name: /mark as completed/i }),
        );

        expect(
          screen.getByTestId("graph-node-skill-html").querySelector("path"),
        ).toBeInTheDocument();
      });

      it("closes tooltip on node tap", async () => {
        renderGraphView();

        const skillNode = screen.getByTestId("graph-node-skill-html");

        await user.click(skillNode);
        expect(screen.getByTestId("graph-tooltip")).toBeInTheDocument();
        expect(
          within(screen.getByTestId("graph-tooltip")).getByText(/html/i),
        ).toBeInTheDocument();

        await user.click(skillNode);

        await waitFor(() => {
          expect(screen.queryByTestId("graph-tooltip")).not.toBeInTheDocument();
        });
      });

      it("closes tooltip when tapping on graph background", async () => {
        renderGraphView();

        await user.click(screen.getByTestId("graph-node-skill-html"));
        expect(screen.getByTestId("graph-tooltip")).toBeInTheDocument();
        expect(
          within(screen.getByTestId("graph-tooltip")).getByText(/html/i),
        ).toBeInTheDocument();

        await user.click(screen.getByTestId("graph-container"));

        await waitFor(() => {
          expect(screen.queryByTestId("graph-tooltip")).not.toBeInTheDocument();
        });
      });
    });
  });
});

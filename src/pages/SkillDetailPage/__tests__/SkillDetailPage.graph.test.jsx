import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, vi } from "vitest";
import {
  MOCK_SKILL_IDS,
  mockSkills,
  renderSkillDetailPage,
} from "./test-utils";
import { screen } from "@testing-library/react";
import { fetchSubgraph } from "../../../services/subgraphService";
import * as skillLinksService from "../../../services/skillLinksService";
import { setWindowWidth } from "../../../shared/utils/utils";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ skillId: CURRENT_SKILL_ID }),
    useOutletContext: () => ({ skills: mockSkills }),
  };
});

vi.mock("../../../services/subgraphService");
vi.mock("../../../services/skillLinksService");

const CURRENT_SKILL_ID = MOCK_SKILL_IDS.PROJECT_MGMT;

const mockNodes = [
  { id: CURRENT_SKILL_ID, label: "Project Management", status: "completed" },
  { id: "skill-prereq", label: "Prerequisite Skill", status: "completed" },
  { id: "skill-unlock", label: "Unlock Skill", status: "available" },
  { id: "skill-mutual", label: "Mutual Skill", status: "completed" },
];

const mockLinks = [
  { source: "skill-prereq", target: CURRENT_SKILL_ID },
  { source: CURRENT_SKILL_ID, target: "skill-unlock" },
  { source: "skill-mutual", target: CURRENT_SKILL_ID },
  { source: CURRENT_SKILL_ID, target: "skill-mutual" },
];

describe("SkillDetailPage: GraphView Integration", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();

    skillLinksService.fetchIncomingSkillLinks.mockResolvedValue([
      {
        id: "link-prereq",
        source_skill_id: "skill-prereq",
        target_skill_id: CURRENT_SKILL_ID,
        type: "prerequisite",
        skill_name: "Prerequisite Skill",
      },
      {
        id: "link-mutual-in",
        source_skill_id: "skill-mutual",
        target_skill_id: CURRENT_SKILL_ID,
        type: "support",
        skill_name: "Mutual Skill",
      },
    ]);

    skillLinksService.fetchOutgoingSkillLinks.mockResolvedValue([
      {
        id: "link-unlock",
        source_skill_id: CURRENT_SKILL_ID,
        target_skill_id: "skill-unlock",
        type: "unlock",
        skill_name: "Unlock Skill",
      },
      {
        id: "link-mutual-out",
        source_skill_id: CURRENT_SKILL_ID,
        target_skill_id: "skill-mutual",
        type: "support",
        skill_name: "Mutual Skill",
      },
    ]);

    fetchSubgraph.mockResolvedValue({ nodes: mockNodes, links: mockLinks });
  });

  describe("Desktop", () => {
    beforeEach(() => {
      setWindowWidth(1200);
    });

    it("opens graph modal and displays all elements", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      await user.click(screen.getByRole("button", { name: /graph/i }));

      expect(
        screen.getByRole("heading", { name: /knowledge graph/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId(`graph-node-${CURRENT_SKILL_ID}`),
      ).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-prereq")).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-unlock")).toBeInTheDocument();
      expect(screen.getByTestId("graph-node-skill-mutual")).toBeInTheDocument();

      expect(screen.getByTestId("legend-amber")).toBeInTheDocument();
      expect(screen.getByTestId("legend-cyan")).toBeInTheDocument();
      expect(screen.getByTestId("legend-indigo")).toBeInTheDocument();
    });
  });

  describe("Mobile", () => {
    beforeEach(() => {
      setWindowWidth(375);
    });

    it("opens graph modal from action menu", async () => {
      renderSkillDetailPage(CURRENT_SKILL_ID);

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );
      await user.click(screen.getByRole("button", { name: /view graph/i }));

      expect(
        screen.getByRole("heading", { name: /knowledge graph/i }),
      ).toBeInTheDocument();
    });
  });
});

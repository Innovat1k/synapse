import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import * as skillService from "../services/skillService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SkillsLayout from "./SkillsLayout";
import SkillsListPage from "../pages/SkillsListPage/SkillsListPage";
import SkillDetailPage from "../pages/SkillDetailPage/SkillDetailPage";

vi.mock("../services/skillService");

const mockSkills = [
  {
    name: "React JS",
    skill_id: "23",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: "3",
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Digital Painting",
    skill_id: "45",
    category: "art",
    level: 3,
    description: "Practicing digital illustration using drawing tablets.",
    tags: ["visual", "creativity"],
  },
  {
    name: "Project Management",
    skill_id: "51",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

describe("SkillsLayout", () => {
  let queryClient;
  let LayoutWrapper;
  let user;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    LayoutWrapper = ({ initialEntries = ["/skills"] }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/skills" element={<SkillsLayout />}>
              <Route index element={<SkillsListPage />} />
              <Route path=":skillId" element={<SkillDetailPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    user = userEvent.setup({ delay: null });
  });

  describe("SkillsListPage interactions", () => {
    it('SkillFormModal: creates new skill if "Save skill" button is clicked', async () => {
      const newSkill = {
        skill_id: "99",
        name: "Python",
        category: "backend",
        level: 1,
        description: "Learning Python for AI",
        tags: ["ai"],
      };

      vi.mocked(skillService.fetchSkills)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([newSkill]);

      vi.mocked(skillService.createSkill).mockResolvedValue(newSkill);

      render(<LayoutWrapper initialEntries={["/skills"]} />);

      await user.click(screen.getByRole("button", { name: /add new skill/i }));

      await user.type(screen.getByLabelText(/name/i), "Python");
      await user.type(screen.getByLabelText(/category/i), "backend");
      await user.type(
        screen.getByLabelText(/description/i),
        "Learning Python for AI"
      );

      await user.type(screen.getByLabelText(/tags/i), "ai");
      await user.click(screen.getByRole("button", { name: /add tag/i }));
      await user.click(screen.getByRole("button", { name: /save skill/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("cell", { name: /python/i })
        ).toBeInTheDocument();
        expect(screen.getByTestId("skill-count-badge")).toHaveTextContent("1");
      });
    }, 10000);

    it('SkillFormModal: updates selected skill if "update skill" button is clicked', async () => {
      const initialSkills = [
        {
          skill_id: "3",
          name: "CSS",
          category: "frontend",
          level: 1,
          description: "Basic knowledge of CSS for styling web pages.",
          tags: ["style"],
        },
      ];

      const updatedSkill = {
        skill_id: 3,
        name: "Tailwind CSS",
        category: "frontend",
        level: 3,
        description:
          "Using Tailwind CSS for fast and responsive design with a utility-first approach.",
        tags: ["style", "utility-first"],
      };

      vi.mocked(skillService.fetchSkills)
        .mockResolvedValueOnce(initialSkills)
        .mockResolvedValueOnce(
          initialSkills.map((s) => (s.skill_id === "3" ? updatedSkill : s))
        );

      vi.mocked(skillService.fetchSkills).mockResolvedValue(updatedSkill);

      render(<LayoutWrapper initialEntries={["/skills"]} />);

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          {
            name: /edit skill css/i,
          }
        )
      );

      expect(
        screen.getByRole("heading", { name: /edit skill/i })
      ).toBeInTheDocument();

      const editModal = within(screen.getByTestId(/modal-overlay/i));

      await user.clear(editModal.getByLabelText(/name/i));
      await user.type(editModal.getByLabelText(/name/i), "Tailwind CSS");
      await user.type(
        editModal.getByLabelText(/description/i),
        "Using Tailwind CSS for fast and responsive design with a utility-first approach."
      );

      const levelSlider = editModal.getByLabelText(/level/i);
      await user.click(levelSlider);
      fireEvent.change(levelSlider, { target: { value: "3" } });

      await user.type(editModal.getByLabelText(/tags/i), "utility-first");
      await user.click(editModal.getByRole("button", { name: /add tag/i }));

      await user.click(
        editModal.getByRole("button", { name: /update skill/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /edit skill/i })
        ).not.toBeInTheDocument();
      });

      expect(
        screen.queryByRole("cell", { name: "Css" })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: /Tailwind CSS/i })
      ).toBeInTheDocument();
    });

    it("SkillFormModal: removes a skill when delete button is confirmed", async () => {
      vi.mocked(skillService.fetchSkills)
        .mockResolvedValueOnce(mockSkills)
        .mockResolvedValueOnce(mockSkills.filter((s) => s.skill_id !== "3"));

      vi.mocked(skillService.deleteSkill).mockResolvedValue(undefined);

      render(<LayoutWrapper initialEntries={["/skills"]} />);

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          { name: /delete skill java/i }
        )
      );

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("cell", { name: /java/i })
        ).not.toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: /confirm deletion/i })
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("skill-count-badge")).toHaveTextContent("3");
    });

    it("navigates to the skill detail page if skill name is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop")
      );

      await user.click(
        desktop_layout.getByRole("link", { name: /project management/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /skill: project management/i })
        ).toBeInTheDocument();
      });

      expect(screen.getByText(/level 3/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /managing small agile projects and coordinating tasks/i
        )
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill-tags-container")).getByText(
          /organization/i
        )
      ).toBeInTheDocument();
    });
  });

  describe("SkillDetailPage interactions", () => {
    it("navigate to the skills list page if return button is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<LayoutWrapper initialEntries={["/skills/23"]} />);

      expect(
        await screen.findByRole("heading", { name: /skill: react js/i })
      ).toBeInTheDocument();

      await user.click(screen.getByText(/back to skills/i));

      expect(
        await screen.findByTestId("list-layout-desktop")
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", { name: /skill: react js/i, level: 1 })
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: /skill management/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("removes the current skill and return to the list of skills", async () => {
      vi.mocked(skillService.fetchSkills)
        .mockResolvedValueOnce(mockSkills)
        .mockResolvedValueOnce(mockSkills.filter((s) => s.skill_id !== "45"));

      vi.mocked(skillService.deleteSkill).mockResolvedValueOnce(undefined);

      render(<LayoutWrapper initialEntries={["/skills/45"]} />);

      expect(
        await screen.findByRole("heading", { name: /skill: digital painting/i })
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /open actions menu/i })
      );

      await user.click(
        screen.getByRole("button", { name: /delete digital painting skill/i })
      );

      expect(
        screen.getByText(/are you sure you want to delete ?/i)
      ).toHaveTextContent(/"digital painting"/i);

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );

      await waitFor(() => {
        expect(
          within(screen.getByTestId("list-layout-desktop")).queryByRole(
            "cell",
            {
              name: /digital painting/i,
            }
          )
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Mobile layout", () => {
    it("redirects to SkillDetailPage if skill name is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      const mobile_layout = within(
        await screen.findByTestId("list-layout-mobile")
      );

      await user.click(
        mobile_layout.getByRole("heading", {
          level: 3,
          name: /project management/i,
        })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /skill: project management/i })
        ).toBeInTheDocument();
      });
    });
  });
});

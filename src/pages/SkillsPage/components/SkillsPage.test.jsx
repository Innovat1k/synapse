import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import SkillsPage from "./SkillsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import * as skillService from "../../../services/skillService";

vi.mock("../../../services/skillService");

const mockSkills = [
  {
    name: "React js",
    id: 23,
    category: "frontend",
    level: 4,
    description: "online free react js course to get certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Code testing",
    id: 7,
    category: "tools",
    level: 2,
    description: "testing cases for both React js and Javascript.",
    tags: ["tools"],
  },
  {
    name: "Java",
    id: 3,
    category: "backend",
    level: 1,
    description: "Trying to explore Java development.",
    tags: ["programming"],
  },
  {
    name: "designing",
    id: 12,
    category: "design",
    level: 2,
    description:
      "learn to build visual template to enhance web app appearance.",
    tags: ["ui", "visual"],
  },
];

describe("SkillPage", () => {
  let queryClient;
  let Wrapper;
  let user;

  beforeEach(() => {
    queryClient = new QueryClient();
    Wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    user = userEvent.setup();
  });

  it("displays 'no skill' message if skills list is empty", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue([]);
    render(<SkillsPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/no skills found/i)).toBeInTheDocument();
    });
  });

  it("renders skill management UI and displays skills after successful fetch", async () => {
    const CATEGORIES = [
      "all skills",
      "frontend",
      "backend",
      "devOps",
      "soft skill",
    ];

    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /skill management/i
    );
    expect(
      screen.getByRole("button", { name: /add new skill/i })
    ).toBeInTheDocument();

    CATEGORIES.forEach((category) => {
      expect(
        within(screen.getByRole("combobox")).getByRole("option", {
          name: category,
        })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("columnheader", { name: /name/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /category/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /level/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /last updated/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /actions/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /sort by name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sort by level/i })
    ).toBeInTheDocument();
  });

  it("displays skills with correct values", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    mockSkills.forEach((skill) => {
      waitFor(() => {
        expect(
          within(screen.getByTestId(`Skill-${skill.id}`)).getByRole("cell", {
            name: skill.name,
          })
        ).toBeInTheDocument();
        expect(
          within(screen.getByTestId(`Skill-${skill.id}`)).getByRole("cell", {
            name: skill.category,
          })
        ).toBeInTheDocument();
        expect(
          within(screen.getByTestId(`Skill-${skill.id}`)).getByRole("cell", {
            name: `${skill.level}/5`,
          })
        ).toBeInTheDocument();

        expect(
          within(screen.getByTestId(`Skill-${skill.id}`)).getByRole("button", {
            name: `Delete skill ${skill.id}`,
          })
        );
        expect(
          within(screen.getByTestId(`Skill-${skill.id}`)).getByRole("button", {
            name: `Edit skill ${skill.id}`,
          })
        );
      });
    });
  });

  it("allows typing in search bar and display searched skill if it exists", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    const searchBar = screen.getByPlaceholderText(/search by/i);

    await user.type(searchBar, "React");

    expect(searchBar).toHaveValue("React");

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: "React js" })
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("Skill-23")).getByRole("cell", {
          name: /frontend/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "4/5" })).toBeInTheDocument();
    });
  });

  it("displays not found message if searched skill does not exist", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    const searchBar = screen.getByPlaceholderText(/search by/i);

    await user.type(searchBar, "Python");

    await waitFor(() => {
      expect(screen.getByText(/no skills found/i)).toBeInTheDocument();
    });
  });

  it("displays correct skills when filtering by category", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    const select = screen.getByTestId("Skills category");

    await user.selectOptions(select, "backend");

    await waitFor(() => {
      expect(
        within(screen.getByTestId("Skill-3")).getByRole("cell", {
          name: /backend/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "Java" })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "1/5" })).toBeInTheDocument();
    });

    await user.selectOptions(select, "frontend");

    await waitFor(() => {
      expect(
        within(screen.getByTestId("Skill-23")).getByRole("cell", {
          name: /frontend/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: "React js" })
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "4/5" })).toBeInTheDocument();
    });
  });

  it("displays empty skills list if none of skills is in selected category", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    render(<SkillsPage />, { wrapper: Wrapper });

    const select = screen.getByTestId("Skills category");

    await user.selectOptions(select, "soft skill");

    await waitFor(() => {
      expect(
        screen.getByText(
          /no skills found. try adjusting your search or filters./i
        )
      ).toBeInTheDocument();
    });
  });

  describe("SkillFormModal : create / add skill", () => {
    it("opens SkillFormModal:create if 'Add new skill' button is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue([]);
      render(<SkillsPage />, { wrapper: Wrapper });

      const addSkillBtn = screen.getByRole("button", {
        name: /add new skill/i,
      });

      await user.click(addSkillBtn);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: /add new skill/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
    });

    it('creates new skill if "Save skill" button is clicked', async () => {
      const createdSkill = {
        id: 99,
        name: "Python",
        category: "backend",
        level: 1,
        description: "Learning Python for AI",
        tags: ["ai"],
      };
      const mockFetchedSkills = [[]];

      vi.mocked(skillService.fetchSkills).mockImplementation(() => {
        return Promise.resolve(mockFetchedSkills.shift() || []);
      });
      vi.mocked(skillService.createSkill).mockResolvedValue(createdSkill);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /add new skill/i }));

      await user.type(screen.getByLabelText(/name/i), "Python");
      await user.type(screen.getByLabelText(/category/i), "backend");
      await user.type(
        screen.getByLabelText(/description/i),
        "Learning Python for AI"
      );

      await user.type(screen.getByLabelText(/tags/i), "ai");
      await user.click(screen.getByRole("button", { name: /add tag/i }));

      mockFetchedSkills.push([createdSkill]);

      await user.click(screen.getByRole("button", { name: /save skill/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /add new skill/i })
        ).not.toBeInTheDocument();
        expect(
          screen.getByRole("cell", { name: /python/i })
        ).toBeInTheDocument();
      });
    });

    it("closes any modal if X icon button is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue([]);
      render(<SkillsPage />, { wrapper: Wrapper });

      const addSkillBtn = screen.getByRole("button", {
        name: /add new skill/i,
      });
      await user.click(addSkillBtn);

      const closeBtn = screen.getByRole("button", {
        name: "Close modal",
      });
      await user.click(closeBtn);

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /add new skill/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("SkillFormModal : edit / update skill", () => {
    it("opens SkillFormModal:edit with currently clicked skill values", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<SkillsPage />, { wrapper: Wrapper });

      const editSkillBtn = await screen.findByRole("button", {
        name: "Edit skill 7",
      });

      await user.click(editSkillBtn);
      const editModal = within(await screen.findByTestId(/modal-overlay/i));

      expect(
        screen.getByRole("heading", { level: 2, name: /edit skill/i })
      ).toBeInTheDocument();

      expect(editModal.getByLabelText(/name/i)).toHaveValue("Code testing");
      expect(editModal.getByLabelText(/category/i)).toBeInTheDocument();
      expect(editModal.getByLabelText(/level/i)).toBeInTheDocument();
      expect(editModal.getByLabelText(/description/i)).toBeInTheDocument();
      expect(editModal.getByLabelText(/tags/i)).toBeInTheDocument();
      expect(editModal.getByText("tools")).toBeInTheDocument();

      expect(
        editModal.getByRole("button", {
          name: /update skill/i,
        })
      ).toBeInTheDocument();

      expect(
        editModal.getByRole("button", {
          name: /cancel/i,
        })
      ).toBeInTheDocument();
    });

    it('updates selected skill if "update skill" button is clicked', async () => {
      const initialSkills = [
        {
          id: 3,
          name: "CSS",
          category: "frontend",
          level: 1,
          description: "Basic knowledge of CSS for styling web pages.",
          tags: ["style"],
        },
      ];

      const updatedSkill = {
        id: 3,
        name: "Tailwind CSS",
        category: "frontend",
        level: 3,
        description:
          "Using Tailwind CSS for fast and responsive design with a utility-first approach.",
        tags: ["style", "utility-first"],
      };

      const mockFetchedSkills = [initialSkills];

      vi.mocked(skillService.fetchSkills).mockImplementation(() => {
        return Promise.resolve(mockFetchedSkills.shift() || []);
      });
      vi.mocked(skillService.updateSkill).mockResolvedValue(updatedSkill);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(
        await screen.findByRole("button", {
          name: /edit skill 3/i,
        })
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

      mockFetchedSkills.push([updatedSkill]);

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

    it("cancels any changes and close the modal if cancel button is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(
        await screen.findByRole("button", {
          name: /edit skill 3/i,
        })
      );

      await user.click(
        screen.getByRole("button", {
          name: /cancel/i,
        })
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { level: 2, name: /edit skill/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("SkillFormModal : delete skill", () => {
    it("opens SkillFormModal:delete if delete icon button is clicked", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(
        await screen.findByRole("button", {
          name: "Delete skill 12",
        })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: /confirm deletion/i })
        );

        const paragraph = screen.getByText(/are you sure/i);
        expect(paragraph).toHaveTextContent(/delete\s+"designing"\s*\?/i);

        expect(
          within(screen.getByTestId(/modal-overlay/i)).getByText(/"designing"/i)
        ).toBeInTheDocument();

        expect(
          screen.getByRole("button", {
            name: /keep it/i,
          })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", {
            name: /delete permanently/i,
          })
        ).toBeInTheDocument();
      });
    });

    it("deletes a skill when delete button is confirmed", async () => {
      const skillsAfterDelete = mockSkills.filter((s) => s.id !== 3);
      const mockFetchedSkills = [mockSkills];

      vi.mocked(skillService.fetchSkills).mockImplementation(() => {
        return Promise.resolve(mockFetchedSkills.shift() || []);
      });
      vi.mocked(skillService.deleteSkill).mockResolvedValue(undefined);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(
        await screen.findByRole("button", { name: /delete skill 3/i })
      );

      mockFetchedSkills.push(skillsAfterDelete);

      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /confirm deletion/i })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("cell", { name: /java/i })
        ).not.toBeInTheDocument();
      });

      expect(screen.getByRole("cell", { name: /react/i })).toBeInTheDocument();
    });

    it("keeps a skill when cancel button is clicked and close the modal", async () => {
      vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
      render(<SkillsPage />, { wrapper: Wrapper });

      await user.click(
        await screen.findByRole("button", { name: /delete skill 3/i })
      );

      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /keep it/i }));

      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: /confirm deletion/i })
        ).not.toBeInTheDocument();
      });

      expect(screen.queryByRole("cell", { name: /java/i })).toBeInTheDocument();
    });
  });
});

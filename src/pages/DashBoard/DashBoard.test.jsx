import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import Dashboard from "./DashBoard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as skillService from "@services/skillService";
import * as activityService from "@services/activityService";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/skillService");
vi.mock("../../services/activityService");

const mockSkills = [
  {
    name: "React JS",
    skill_id: "a3c4e2f1-1234-4f8d-95f3-4f0b9c12e7d2",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Project Management",
    skill_id: "8c4c6f4f-9b77-40b9-9d22-d38c2a423d9d",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

describe("DashBoard", () => {
  let client;
  let Wrapper;
  let user;

  beforeEach(() => {
    client = new QueryClient();
    Wrapper = ({ children }) => (
      <MemoryRouter>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
    user = userEvent.setup({ delay: null });
  });

  it("opens log activity modal with creating skill cta if skills list is empty", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue([]);
    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );

    expect(screen.getByText(/cannot log activity/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /you must have at least one skill to record an activity/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create my first skill/i }),
    ).toBeInTheDocument();
  });

  it("allows user to create first skill if cta button is clicked", async () => {
    const mockNewSkill = {
      name: "Node JS",
      skill_id: "a478e-45z-ce",
      category: "backend",
      level: 2,
      description: "Moving to a JS backend language.",
      tags: ["server"],
    };

    vi.mocked(skillService.fetchSkills)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockNewSkill]);
    vi.mocked(skillService.createSkill).mockResolvedValue(mockNewSkill);
    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );
    expect(screen.getByText(/cannot log activity/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /create my first skill/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /log activity/i }),
      ).not.toBeInTheDocument();
    });

    const create_skill_modal = within(screen.getByTestId("modal-overlay"));

    expect(
      create_skill_modal.getByRole("heading", { name: /add new skill/i }),
    ).toBeInTheDocument();

    await user.type(create_skill_modal.getByLabelText(/name/i), "Node JS");
    await user.type(create_skill_modal.getByLabelText(/category/i), "backend");

    const levelSlider = create_skill_modal.getByLabelText(/level/i);
    await user.click(levelSlider);
    fireEvent.change(levelSlider, { target: { value: "2" } });

    await user.type(
      create_skill_modal.getByLabelText(/description/i),
      "Moving to a JS backend language.",
    );

    await user.type(create_skill_modal.getByLabelText(/tags/i), "server");
    await user.click(
      create_skill_modal.getByRole("button", { name: /add tag/i }),
    );

    await user.click(
      create_skill_modal.getByRole("button", { name: /save skill/i }),
    );

    await waitFor(() => {
      expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("skill-count-badge")).toHaveTextContent("1");
  }, 7000);

  it("opens log activity modal from Dashboard then allows to create an activity", async () => {
    const mockNewActivity = {
      skill_id: "8c4c6f4f-9b77-40b9-9d22-d38c2a423d9d",
      duration_minutes: 43,
      activity_type: "project work",
      logged_at: "2025-12-25T15:17:00.000Z",
      notes: "",
    };

    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    vi.mocked(activityService.fetchActivitiesBySkill)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockNewActivity]);

    vi.mocked(activityService.createActivity).mockResolvedValue(
      mockNewActivity,
    );

    render(<Dashboard />, { wrapper: Wrapper });

    await user.click(
      await screen.findByRole("button", { name: /log activity/i }),
    );

    expect(
      screen.getByRole("heading", { name: /log activity/i }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/minutes/i), "43");

    await user.click(screen.getByLabelText(/skill/i));
    const skillOption = await screen.findByRole("option", {
      name: /project management/i,
    });
    await user.click(skillOption);

    await user.click(screen.getByLabelText(/activity type/i));
    const typeOption = await screen.findByRole("option", {
      name: /project work/i,
    });
    await user.click(typeOption);

    await user.click(screen.getByRole("button", { name: /add activity/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /log activity/i }),
      ).not.toBeInTheDocument();
    });

    expect(activityService.createActivity).toHaveBeenCalledOnce();
  });
});

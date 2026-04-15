import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SkillsLayout from "./SkillsLayout";
import SkillsListPage from "../pages/SkillsListPage/SkillsListPage";
import SkillDetailPage from "../pages/SkillDetailPage/SkillDetailPage";
import { clearSkills } from "../mocks/stores";

const TEST_USER_ID = "025af00a-1837-44e0-b03d-6150e1da4611";
vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: TEST_USER_ID },
    loader: { isInitialLoading: false },
  }),
}));

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
    it('allows user to create new skill if "Save skill" button is clicked', async () => {
      clearSkills();
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      await user.click(screen.getByRole("button", { name: /add new skill/i }));
      expect(
        await screen.findByTestId("skill-modal-content"),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /learning track/i }));
      expect(
        await screen.findByRole("listbox", { name: /learning track/i }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("option", { name: /computer science/i }),
      );

      await user.type(screen.getByLabelText(/name/i), "Python");
      await user.type(screen.getByLabelText(/category/i), "backend");
      await user.type(
        screen.getByLabelText(/description/i),
        "Learning Python for AI",
      );

      await user.type(screen.getByLabelText(/tags/i), "ai");
      await user.click(screen.getByRole("button", { name: /add tag/i }));
      await user.click(screen.getByRole("button", { name: /save skill/i }));

      expect(
        await screen.findByRole("cell", { name: /python/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("skill-count-badge")).toHaveTextContent("1");
    });

    it('SkillFormModal: updates selected skill if "update skill" button is clicked', async () => {
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      const desktopLayout = within(
        await screen.findByTestId("list-layout-desktop"),
      );

      await user.click(
        desktopLayout.getByRole("button", {
          name: /edit skill java/i,
        }),
      );

      expect(
        screen.getByRole("heading", { name: /edit skill/i }),
      ).toBeInTheDocument();

      const editModal = within(screen.getByTestId(/skill-modal-content/i));
      const nameInput = editModal.getByLabelText(/name/i);

      await user.clear(nameInput);
      await user.type(nameInput, "Advanced Java");

      const levelSlider = editModal.getByLabelText(/level/i);
      await user.click(levelSlider);
      fireEvent.change(levelSlider, { target: { value: "3" } });

      await user.type(editModal.getByLabelText(/tags/i), "oop programming");
      await user.click(editModal.getByRole("button", { name: /add tag/i }));

      await user.click(
        editModal.getByRole("button", { name: /update skill/i }),
      );

      const skillJava = within(screen.getByTestId("skill-row-skill-java"));
      await waitFor(() => {
        expect(skillJava.getByText(/advanced java/i)).toBeInTheDocument();
        expect(
          skillJava.getByRole("cell", { name: /3\/5/i }),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId("skill-modal-content"),
        ).not.toBeInTheDocument();
      });
    });

    it("SkillFormModal: removes a skill when delete button is confirmed", async () => {
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      await user.click(
        within(await screen.findByTestId("list-layout-desktop")).getByRole(
          "button",
          { name: /delete skill java/i },
        ),
      );

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i }),
      );

      await waitFor(() => {
        expect(
          within(screen.getByTestId("list-layout-desktop")).queryByText(
            /java/i,
          ),
        ).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("skill-count-badge")).toHaveTextContent("2");
    });

    it("navigates to the skill detail page if skill name is clicked", async () => {
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      const desktop_layout = within(
        await screen.findByTestId("list-layout-desktop"),
      );

      await user.click(
        desktop_layout.getByRole("link", { name: /project management/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /skill: project management/i }),
        ).toBeInTheDocument();
      });

      expect(screen.getByText(/level 3/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /managing small agile projects and coordinating tasks/i,
        ),
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("skill-tags-container")).getByText(
          /organization/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("SkillDetailPage interactions", () => {
    it("navigate to the skills list page if return button is clicked", async () => {
      render(<LayoutWrapper initialEntries={["/skills/skill-react"]} />);

      expect(
        await screen.findByRole("heading", { name: /skill: react js/i }),
      ).toBeInTheDocument();

      await user.click(screen.getByText(/back to skills/i));

      expect(
        await screen.findByTestId("list-layout-desktop"),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("heading", { name: /skill: react js/i, level: 1 }),
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: /skill management/i, level: 1 }),
      ).toBeInTheDocument();
    });

    it("removes the current skill and return to the list of skills", async () => {
      render(<LayoutWrapper initialEntries={["/skills/skill-java"]} />);

      expect(
        await screen.findByRole("heading", {
          name: /skill: java/i,
        }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /open skill actions/i }),
      );

      await user.click(screen.getByRole("button", { name: /delete skill/i }));

      expect(
        screen.getByText(/are you sure you want to delete ?/i),
      ).toHaveTextContent(/"java"/i);

      await user.click(
        screen.getByRole("button", { name: /delete permanently/i }),
      );

      await waitFor(() => {
        expect(
          within(screen.getByTestId("list-layout-desktop")).queryByRole(
            "cell",
            {
              name: /java/i,
            },
          ),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Mobile layout", () => {
    it("redirects to SkillDetailPage if skill name is clicked", async () => {
      render(<LayoutWrapper initialEntries={["/skills"]} />);

      const mobile_layout = within(
        await screen.findByTestId("list-layout-mobile"),
      );

      await user.click(
        mobile_layout.getByRole("heading", {
          level: 3,
          name: /project management/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /skill: project management/i }),
        ).toBeInTheDocument();
      });
    });
  });
}, 10000);

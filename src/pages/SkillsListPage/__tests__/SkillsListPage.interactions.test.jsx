import { describe, expect } from "vitest";
import { mockSkills, renderComponent } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { screen, waitFor, within } from "@testing-library/react";
import SkillsListPage from "../SkillsListPage";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useOutletContext: vi.fn() };
});

describe("SkillsListPage interactions", () => {
  const user = userEvent.setup({ delay: null });

  it("allows typing in search bar and display searched skill if it exists", async () => {
    renderComponent(<SkillsListPage />, { skills: mockSkills });

    const searchBar = screen.getByPlaceholderText(/search by/i);

    await user.type(searchBar, "React");

    expect(searchBar).toHaveValue("React");

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /react js/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: /frontend/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "4/5" })).toBeInTheDocument();
    });
  });

  it("displays not found message if searched skill does not exist", async () => {
    renderComponent(<SkillsListPage />, { skills: mockSkills });

    const searchBar = screen.getByPlaceholderText(/search by/i);

    await user.type(searchBar, "Python");

    await waitFor(() => {
      expect(screen.getByText(/no results for "python"/i)).toBeInTheDocument();
    });
  });

  it("displays correct skills when filtering by category", async () => {
    renderComponent(<SkillsListPage />, { skills: mockSkills });

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "backend");

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /backend/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: /java/i })).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "1/5" })).toBeInTheDocument();
    });

    await user.selectOptions(select, "frontend");

    await waitFor(() => {
      expect(
        screen.getByRole("cell", {
          name: /frontend/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: /react js/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("cell", { name: "4/5" })).toBeInTheDocument();
    });
  });

  it('dispays all non in category skills if "others" category is selected', async () => {
    renderComponent(<SkillsListPage />, { skills: mockSkills });

    await user.selectOptions(screen.getByRole("combobox"), "others");

    await waitFor(() => {
      const desktop_layout = within(screen.getByTestId("list-layout-desktop"));
      expect(
        desktop_layout.getByRole("cell", { name: /digital painting/i }),
      ).toBeInTheDocument();
      expect(
        desktop_layout.getByRole("cell", {
          name: /project management/i,
        }),
      ).toBeInTheDocument();
      expect(
        desktop_layout.queryByRole("cell", { name: /react js/i }),
      ).not.toBeInTheDocument();
      expect(
        desktop_layout.queryByRole("cell", { name: /java/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("displays empty skills list if none of skills is in selected category", async () => {
    renderComponent(<SkillsListPage />, { skills: mockSkills });

    await user.selectOptions(screen.getByRole("combobox"), "devOps");

    await waitFor(() => {
      expect(screen.getByText(/no skills in "devops"/i)).toBeInTheDocument();
    });
  });
});

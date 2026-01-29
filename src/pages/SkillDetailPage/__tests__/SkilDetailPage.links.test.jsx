import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useOutletContext, useParams } from "react-router-dom";
import { mockSkills, renderSkillDetailPage } from "./test-utils";
import {
  useCreateSkillLink,
  useIncomingSkillLinks,
  useOutgoingSkillLinks,
} from "../components/SkillLinks/hooks/useSkillLinks";
import { useSkillsQuery } from "../../../shared/hooks/useSkillsQuery/useSkillsQuery";
import { checkExistingLinks } from "../../../services/skillLinksService";

vi.mock("../../../services/activityService", () => ({
  fetchActivitiesBySkill: vi.fn().mockResolvedValue([]),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useOutletContext: vi.fn(), useParams: vi.fn() };
});

vi.mock("../../../services/skillLinksService", () => ({
  checkExistingLinks: vi.fn(),
}));

vi.mock("../components/SkillLinks/hooks/useSkillLinks", () => ({
  useIncomingSkillLinks: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useOutgoingSkillLinks: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
  useCreateSkillLink: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  })),
}));

vi.mock("../../../shared/hooks/useSkillsQuery/useSkillsQuery", () => ({
  useSkillsQuery: vi.fn(),
}));

describe("SkillDetailPage : SkillLinksSection", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();

    useSkillsQuery.mockReturnValue({ skills: mockSkills, isLoading: false });
    useOutletContext.mockReturnValue({
      skills: mockSkills,
    });
    useParams.mockReturnValue({
      skillId: "550e8400-e29b-41d4-a716-446655440001",
    });

    useIncomingSkillLinks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    useOutgoingSkillLinks.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    useCreateSkillLink.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    checkExistingLinks.mockResolvedValue({
      hasDirectLink: false,
      hasReverseLink: false,
    });
  });

  it("allows the user to submit a new skill link", async () => {
    const mutateAsyncMock = vi.fn().mockResolvedValue({});

    useCreateSkillLink.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isSuccess: true,
    });

    renderSkillDetailPage();

    expect(
      screen.queryByRole("link", { name: /React JS/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /add a prerequisite/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /project management/i }),
    );
    await user.click(screen.getByRole("button", { name: /support/i }));
    await user.click(screen.getByRole("button", { name: /link as support/i }));

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(useCreateSkillLink().isSuccess).toBe(true);
    });
  });

  it("displays a created skill link", () => {
    const mockCreatedLink = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      source_skill_id: "123e4567-e89b-12d3-a456-426614174000",
      target_skill_id: "550e8400-e29b-41d4-a716-446655440001",
      type: "support",
      skill_name: "React JS",
    };

    useIncomingSkillLinks.mockReturnValue({
      data: [mockCreatedLink],
      isLoading: false,
      isError: false,
    });

    renderSkillDetailPage();

    expect(screen.getByRole("link", { name: /React JS/i })).toBeInTheDocument();
  });

  it("displays an error if the mutation fails", async () => {
    const mutateAsyncMock = vi.fn().mockRejectedValue(new Error("Failed"));

    useCreateSkillLink.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: new Error("Failed"),
    });

    renderSkillDetailPage();

    await user.click(
      screen.getByRole("button", { name: /add a prerequisite/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /project management/i }),
    );
    await user.click(screen.getByRole("button", { name: /support/i }));
    await user.click(screen.getByRole("button", { name: /link as support/i }));

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to create link. Please try again/i),
      ).toBeInTheDocument();
    });
  });

  it("displays an error if the selected skill link already exists", async () => {
    useIncomingSkillLinks.mockReturnValue({
      data: [{ id: "123e4567-e89b-12d3-a456-426614174000" }],
      isLoading: false,
      isError: false,
    });

    checkExistingLinks.mockResolvedValue({ hasDirectLink: true });

    renderSkillDetailPage();

    await user.click(
      screen.getByRole("button", { name: /add a prerequisite/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /project management/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /This connection already exists between these two skills. Select another skill/i,
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /link as prerequisite/i }),
    ).toBeDisabled();
  });

  it("displays the synergy confirmation if the selected skill link already exists in the other direction", async () => {
    useOutgoingSkillLinks.mockReturnValue({
      data: [{ id: "550e8400-e29b-41d4-a716-446655440002" }],
      isLoading: false,
      isError: false,
    });

    checkExistingLinks.mockResolvedValue({ hasReverseLink: true });

    renderSkillDetailPage();

    await user.click(
      screen.getByRole("button", { name: /add a prerequisite/i }),
    );
    await user.click(screen.getByRole("button", { name: /java/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /synergy detected/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("skills-synergy")).toHaveTextContent(
        /java and react js form a reinforcing loop. They are best learned together/i,
      );
      expect(
        screen.getByRole("button", { name: /confirm synergy/i }),
      ).toBeInTheDocument();
    });
  });
});

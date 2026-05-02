import { beforeEach, describe, expect, vi } from "vitest";
import * as skillService from "@services/skillService";
import { renderHook, waitFor } from "@testing-library/react";
import { useSkillsQuery } from "./useSkillsQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-123" },
  }),
}));

vi.mock("@services/skillService");

const mockSkills = [
  {
    name: "React JS",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: "550e8400-e29b-41d4-a716-446655440002",
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Project Management",
    skill_id: "123e4567-e89b-12d3-a456-426614174000",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

describe("useSkillQuery", () => {
  let queryClient;
  let queryWrapper;

  beforeEach(() => {
    queryClient = new QueryClient();
    queryWrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it("returns the fetched array data if loading is finished", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);

    const { result } = renderHook(() => useSkillsQuery(), {
      wrapper: queryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.skills).toEqual(mockSkills);
    });
  });

  it("exposes isLoading: true while fetching is in progress", async () => {
    const mockPromise = new Promise((resolve) =>
      setTimeout(() => resolve([{ id: "1", name: "React" }]), 100),
    );
    vi.mocked(skillService.fetchSkills).mockReturnValue(mockPromise);

    const { result } = renderHook(() => useSkillsQuery(), {
      wrapper: queryWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.skills).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.skills).toEqual([{ id: "1", name: "React" }]);
  });
});

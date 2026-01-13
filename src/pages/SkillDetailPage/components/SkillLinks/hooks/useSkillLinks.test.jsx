import { renderHook, waitFor } from "@testing-library/react";
import { useIncomingSkillLinks } from "./useSynapseLinks";
import { supabase } from "../../../../../services/supabase-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../../services/supabase-client", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({
      data: [
        {
          id: "link-1",
          source_skill_id: "skill-a",
          target_skill_id: "skill-b",
          type: "prerequisite",
          skill: { name: "JavaScript" },
        },
      ],
      error: null,
    }),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const normalizeQuery = (str) => str.replace(/\s+/g, " ").trim();

describe("useIncomingSkillLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and remap incoming skill links when skillId is valid", async () => {
    const skillId = "skill-b";
    const { result } = renderHook(() => useIncomingSkillLinks(skillId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        id: "link-1",
        source_skill_id: "skill-a",
        target_skill_id: "skill-b",
        type: "prerequisite",
        skill_name: "JavaScript",
      },
    ]);

    expect(supabase.from).toHaveBeenCalledWith("synapse_skill_links");

    const actualQuery = supabase.from().select.mock.calls[0][0];
    const expectedQuery = `
      id,
      source_skill_id,
      target_skill_id,
      type,
      skill:source_skill_id!inner(name)
    `;
    expect(normalizeQuery(actualQuery)).toBe(normalizeQuery(expectedQuery));

    expect(supabase.from().select().eq).toHaveBeenCalledWith(
      "target_skill_id",
      skillId
    );
  });

it("should not run query when skillId is falsy", () => {
  const { result } = renderHook(() => useIncomingSkillLinks(null), {
    wrapper,
  });

  expect(supabase.from).not.toHaveBeenCalled();

  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeNull();
});

  it("should handle Supabase error correctly", async () => {
    supabase
      .from()
      .select()
      .eq.mockResolvedValueOnce({
        data: null,
        error: { message: "Network error" },
      });

    const { result } = renderHook(() => useIncomingSkillLinks("skill-b"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("should map missing skill.name to 'Unknown skill'", async () => {
    supabase
      .from()
      .select()
      .eq.mockResolvedValueOnce({
        data: [
          {
            id: "link-2",
            source_skill_id: "skill-c",
            target_skill_id: "skill-b",
            type: "support",
            skill: null,
          },
        ],
        error: null,
      });

    const { result } = renderHook(() => useIncomingSkillLinks("skill-b"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].skill_name).toBe("Unknown skill");
  });
});

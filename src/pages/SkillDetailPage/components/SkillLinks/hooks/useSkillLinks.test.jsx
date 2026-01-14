import { renderHook, waitFor } from "@testing-library/react";
import { useIncomingSkillLinks, useOutgoingSkillLinks } from "./useSkillLinks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  fromMock: vi.fn(),
  selectMock: vi.fn(),
  eqMock: vi.fn(),
}));

mocks.fromMock.mockReturnValue({ select: mocks.selectMock });
mocks.selectMock.mockReturnValue({ eq: mocks.eqMock });

vi.mock("../../../../../services/supabase-client", () => ({
  supabase: {
    from: mocks.fromMock,
  },
}));

// === Utilities ===
const wrapper = ({ children }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
const renderIncoming = (skillId) =>
  renderHook(() => useIncomingSkillLinks(skillId), { wrapper });

const renderOutgoing = (skillId) =>
  renderHook(() => useOutgoingSkillLinks(skillId), { wrapper });

// === Test data ===
const mockIncomingLink = {
  id: "link-1",
  source_skill_id: "skill-a",
  target_skill_id: "skill-b",
  type: "prerequisite",
  skill: { name: "JavaScript" },
};

const mockOutgoingLink = {
  id: "link-2",
  source_skill_id: "skill-b",
  target_skill_id: "skill-c",
  type: "related",
  skill: { name: "TypeScript" },
};

// ==================================================
// INCOMING
// ==================================================
describe("useIncomingSkillLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and remap incoming skill links when skillId is valid", async () => {
    const skillId = "skill-b";
    mocks.eqMock.mockResolvedValueOnce({
      data: [mockIncomingLink],
      error: null,
    });

    const { result } = renderIncoming(skillId);
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

    expect(mocks.fromMock).toHaveBeenCalledWith("synapse_skill_links");

    const selectArg = mocks.selectMock.mock.calls[0][0];
    expect(selectArg).toContain("id");
    expect(selectArg).toContain("source_skill_id");
    expect(selectArg).toContain("skill:source_skill_id!inner(name)");

    expect(mocks.eqMock).toHaveBeenCalledWith("target_skill_id", skillId);
  });

  it("should not run query when skillId is falsy", () => {
    const { result } = renderIncoming(null);
    expect(result.current.fetchStatus).toBe("idle");
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("should handle Supabase error correctly", async () => {
    mocks.eqMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Network error" },
    });

    const { result } = renderIncoming("skill-x");
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("should map missing skill.name to 'Unknown skill'", async () => {
    mocks.eqMock.mockResolvedValueOnce({
      data: [{ ...mockIncomingLink, skill: null }],
      error: null,
    });

    const { result } = renderIncoming("skill-b");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].skill_name).toBe("Unknown skill");
  });
});

// ==================================================
// OUTGOING
// ==================================================
describe("useOutgoingSkillLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and remap outgoing skill links when skillId is valid", async () => {
    const skillId = "skill-b";
    mocks.eqMock.mockResolvedValueOnce({
      data: [mockOutgoingLink],
      error: null,
    });

    const { result } = renderOutgoing(skillId);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      {
        id: "link-2",
        source_skill_id: "skill-b",
        target_skill_id: "skill-c",
        type: "related",
        skill_name: "TypeScript",
      },
    ]);

    expect(mocks.fromMock).toHaveBeenCalledWith("synapse_skill_links");

    const selectArg = mocks.selectMock.mock.calls[0][0];
    expect(selectArg).toContain("id");
    expect(selectArg).toContain("target_skill_id");
    expect(selectArg).toContain("skill:target_skill_id!inner(name)");

    expect(mocks.eqMock).toHaveBeenCalledWith("source_skill_id", skillId);
  });

  it("should not run query when skillId is falsy", () => {
    const { result } = renderOutgoing(null);
    expect(result.current.fetchStatus).toBe("idle");
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("should handle Supabase error correctly", async () => {
    mocks.eqMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Network error" },
    });

    const { result } = renderOutgoing("skill-y");
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it("should map missing skill.name to 'Unknown skill'", async () => {
    mocks.eqMock.mockResolvedValueOnce({
      data: [{ ...mockOutgoingLink, skill: null }],
      error: null,
    });

    const { result } = renderOutgoing("skill-b");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data[0].skill_name).toBe("Unknown skill");
  });
});

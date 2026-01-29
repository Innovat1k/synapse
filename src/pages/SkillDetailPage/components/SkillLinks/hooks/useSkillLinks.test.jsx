import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as skillLinksService from "../../../../../services/skillLinksService";
import {
  useCreateSkillLink,
  useIncomingSkillLinks,
  useOutgoingSkillLinks,
} from "./useSkillLinks";

vi.mock("../../../../../services/skillLinksService");

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockIncomingLink = {
  id: "link-1",
  source_skill_id: "skill-a",
  target_skill_id: "skill-b",
  type: "prerequisite",
  skill_name: "JavaScript",
};

const mockOutgoingLink = {
  id: "link-2",
  source_skill_id: "skill-b",
  target_skill_id: "skill-c",
  type: "related",
  skill_name: "TypeScript",
};

const mockCreatedLink = {
  id: "new-link-1",
  source_skill_id: "skill-a",
  target_skill_id: "skill-b",
  type: "prerequisite",
};

// ==================================================
// INCOMING LINKS
// ==================================================
describe("useIncomingSkillLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and remap incoming skill links when skillId is valid", async () => {
    skillLinksService.fetchIncomingSkillLinks.mockResolvedValue([
      mockIncomingLink,
    ]);

    const { result } = renderHook(() => useIncomingSkillLinks("skill-b"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mockIncomingLink]);
    expect(skillLinksService.fetchIncomingSkillLinks).toHaveBeenCalledWith(
      "skill-b",
    );
  });

  it("should not run query when skillId is falsy", () => {
    const { result } = renderHook(() => useIncomingSkillLinks(null), {
      wrapper,
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should handle error from service", async () => {
    skillLinksService.fetchIncomingSkillLinks.mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useIncomingSkillLinks("skill-x"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Network error");
  });
});

// ==================================================
// OUTGOING LINKS
// ==================================================
describe("useOutgoingSkillLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and remap outgoing skill links when skillId is valid", async () => {
    skillLinksService.fetchOutgoingSkillLinks.mockResolvedValue([
      mockOutgoingLink,
    ]);

    const { result } = renderHook(() => useOutgoingSkillLinks("skill-b"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([mockOutgoingLink]);
    expect(skillLinksService.fetchOutgoingSkillLinks).toHaveBeenCalledWith(
      "skill-b",
    );
  });

  it("should not run query when skillId is falsy", () => {
    const { result } = renderHook(() => useOutgoingSkillLinks(null), {
      wrapper,
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should handle error from service", async () => {
    skillLinksService.fetchOutgoingSkillLinks.mockRejectedValue(
      new Error("Database timeout"),
    );

    const { result } = renderHook(() => useOutgoingSkillLinks("skill-y"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Database timeout");
  });
});

// ==================================================
// CREATE LINK MUTATION
// ==================================================
describe("useCreateSkillLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new skill link successfully", async () => {
    // ✅ Mock résout directement avec l'objet (pas { data, error })
    skillLinksService.createSkillLink.mockResolvedValue(mockCreatedLink);

    const { result } = renderHook(() => useCreateSkillLink(), { wrapper });

    const variables = {
      sourceSkillId: "skill-a",
      targetSkillId: "skill-b",
      type: "prerequisite",
    };

    await waitFor(async () => {
      await result.current.mutateAsync(variables);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCreatedLink);
    expect(skillLinksService.createSkillLink).toHaveBeenCalledWith({
      source_skill_id: "skill-a",
      target_skill_id: "skill-b",
      type: "prerequisite",
    });
  });

  it("should throw error when linking a skill to itself", async () => {
    const { result } = renderHook(() => useCreateSkillLink(), { wrapper });

    const variables = {
      sourceSkillId: "same-skill",
      targetSkillId: "same-skill",
      type: "related",
    };

    let error;
    await waitFor(async () => {
      try {
        await result.current.mutateAsync(variables);
      } catch (err) {
        error = err;
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe(
          "Cannot link a skill to itself",
        );
      }
    });

    expect(error).toBeDefined();
  });

  it("should handle Supabase insertion error", async () => {
    // ✅ Mock rejette une erreur (comme le ferait throw error)
    skillLinksService.createSkillLink.mockRejectedValue(
      new Error("Duplicate key violation"),
    );

    const { result } = renderHook(() => useCreateSkillLink(), { wrapper });

    const variables = {
      sourceSkillId: "skill-x",
      targetSkillId: "skill-y",
      type: "support",
    };

    let error;
    await waitFor(async () => {
      try {
        await result.current.mutateAsync(variables);
      } catch (err) {
        error = err;
        expect(result.current.isError).toBe(true);
      }
    });

    expect(error).toBeDefined();
    expect(error.message).toBe("Duplicate key violation");
  });
});

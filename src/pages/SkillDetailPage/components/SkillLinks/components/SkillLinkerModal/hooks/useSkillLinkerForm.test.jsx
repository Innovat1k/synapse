import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { useSkillLinkerForm } from "./useSkillLinkerForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as skillService from "../../../../../../../services/skillService";
import * as skillLinksService from "../../../../../../../services/skillLinksService";

vi.mock("../../../../../../../services/skillService");
vi.mock("../../../../../../../services/skillLinksService");

const mockSkills = [
  { name: "javascript", skill_id: "skill-a" },
  { name: "react js", skill_id: "skill-b" },
  { name: "node js", skill_id: "skill-c" },
];

describe("useSkillLinkerForm", () => {
  let client;
  let QueryWrapper;

  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    QueryWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  });

  const renderUseSkillLinkerForm = (currentSkillId, mode = "outgoing") => {
    return renderHook(() => useSkillLinkerForm({ currentSkillId, mode }), {
      wrapper: QueryWrapper,
    }).result;
  };

  it("should filter skills based on search term", async () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    const result = renderUseSkillLinkerForm("skill-a");

    await waitFor(() => {
      expect(result.current.skills).toHaveLength(2);
    });

    act(() => {
      result.current.methods.handleChange({ target: { value: "node" } });
    });

    expect(result.current.searchTerm).toBe("node");
    expect(result.current.skills).toEqual([
      { name: "node js", skill_id: "skill-c" },
    ]);
  });

  it("should update search term", () => {
    const result = renderUseSkillLinkerForm("skill-a");
    act(() => {
      result.current.methods.handleChange({ target: { value: "mongo Db" } });
    });
    expect(result.current.searchTerm).toBe("mongo Db");
    expect(result.current.error).toBe("");
  });

  it("should select a skill and check for existing links", async () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    skillLinksService.checkExistingLinks.mockResolvedValue({
      hasDirectLink: false,
      hasReverseLink: false,
    });

    const result = renderUseSkillLinkerForm("skill-b");
    expect(result.current.selectedSkill).toBeNull();

    await act(async () => {
      result.current.methods.handleSelectSkill(mockSkills[0]);
    });

    expect(result.current.selectedSkill).toEqual({
      id: "skill-a",
      name: "javascript",
    });
    expect(result.current.error).toBe("");
  });

  it("should change link type", () => {
    const result = renderUseSkillLinkerForm("skill-a");
    expect(result.current.link.linkType).toBe("prerequisite");

    act(() => {
      result.current.methods.handleChangeLinkType("support");
    });

    expect(result.current.link.linkType).toBe("support");
    expect(result.current.error).toBe("");
  });

  it("should reset all form fields", () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    const result = renderUseSkillLinkerForm("skill-a");

    act(() => {
      result.current.methods.handleChange({ target: { value: "org" } });
      result.current.methods.handleSelectSkill(mockSkills[0]);
      result.current.methods.handleChangeLinkType("support");
    });

    expect(result.current.searchTerm).toBe("org");
    expect(result.current.selectedSkill).toEqual({
      id: "skill-a",
      name: "javascript",
    });
    expect(result.current.link.linkType).toBe("support");

    act(() => {
      result.current.methods.clearForm();
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedSkill).toBeNull();
    expect(result.current.link.linkType).toBe("prerequisite");
    expect(result.current.error).toBe("");
    expect(result.current.link.hasDirectLink).toBe(false);
    expect(result.current.link.hasReverseLink).toBe(false);
  });

  it("should show error if direct link already exists", async () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    skillLinksService.checkExistingLinks.mockResolvedValue({
      hasDirectLink: true,
      hasReverseLink: false,
    });

    const result = renderUseSkillLinkerForm("skill-b", "incoming");
    await act(async () => {
      result.current.methods.handleSelectSkill(mockSkills[0]);
    });

    await act(async () => {
      await result.current.methods.handleCreateLink(vi.fn());
    });

    expect(result.current.error).toBe(
      "This connection already exists between these two skills.",
    );
  });

  it("should prevent self-linking", async () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);

    const result = renderUseSkillLinkerForm("skill-a", "outgoing");
    await act(async () => {
      result.current.methods.handleSelectSkill(mockSkills[0]);
    });

    const onClose = vi.fn();
    await act(async () => {
      await result.current.methods.handleCreateLink({ onClose });
    });

    expect(result.current.error).toBe("A skill cannot link to itself.");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should handle creation error from service", async () => {
    skillService.fetchSkills.mockResolvedValue(mockSkills);
    skillLinksService.checkExistingLinks.mockResolvedValue({
      hasDirectLink: false,
      hasReverseLink: false,
    });
    skillLinksService.createSkillLink.mockRejectedValue(
      new Error("Network error"),
    );

    const result = renderUseSkillLinkerForm("skill-b", "outgoing");
    await act(async () => {
      result.current.methods.handleSelectSkill(mockSkills[0]);
    });

    const onClose = vi.fn();
    await act(async () => {
      await result.current.methods.handleCreateLink({ onClose });
    });

    expect(result.current.error).toBe(
      "Failed to create link. Please try again.",
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});

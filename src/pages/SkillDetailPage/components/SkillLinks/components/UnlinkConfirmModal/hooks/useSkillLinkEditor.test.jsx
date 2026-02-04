import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import { useSkillLinkEditor } from "./useSkillLinkEditor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteSkillLink } from "../../../hooks/useSkillLinks";

vi.mock("../../../hooks/useSkillLinks");

const mockLink = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  source_skill_id: "123e4567-e89b-12d3-a456-426614174000",
  target_skill_id: "550e8400-e29b-41d4-a716-446655440001",
  type: "support",
  skill_name: "React JS",
};

describe("useSkillLinkEditor", () => {
  let client;
  let QueryWrapper;

  beforeEach(() => {
    client = new QueryClient();
    QueryWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    useDeleteSkillLink.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("catches link data", () => {
    const { result } = renderHook(() => useSkillLinkEditor(), {
      wrapper: QueryWrapper,
    });

    act(() => {
      result.current.methods.removeLink(mockLink);
    });

    expect(result.current.unlinkingLink).toEqual(mockLink);
  });

  it("cancels removing", () => {
    const { result } = renderHook(() => useSkillLinkEditor(), {
      wrapper: QueryWrapper,
    });

    act(() => {
      result.current.methods.removeLink(mockLink);
    });
    expect(result.current.unlinkingLink).toEqual(mockLink);

    act(() => {
      result.current.methods.cancelRemoval();
    });

    expect(result.current.unlinkingLink).toBe(null);
  });

  it("toggles isEditing state", () => {
    const { result } = renderHook(() => useSkillLinkEditor(), {
      wrapper: QueryWrapper,
    });

    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.methods.toggleEditing();
    });

    expect(result.current.isEditing).toBe(true);
  });

  it("confirms to remove the selected link", async () => {
    const mutateMock = vi.fn((_, callbacks) => {
      callbacks?.onSuccess?.();
    });

    useDeleteSkillLink.mockReturnValue({
      mutate: mutateMock,
    });

    const { result } = renderHook(() => useSkillLinkEditor(), {
      wrapper: QueryWrapper,
    });

    act(() => {
      result.current.methods.removeLink(mockLink);
    });
    expect(result.current.unlinkingLink).toBe(mockLink);

    act(() => {
      result.current.methods.confirmRemoval();
    });

    await waitFor(() => {
      expect(result.current.unlinkingLink).toBe(null);
    });
    expect(mutateMock).toHaveBeenCalledWith(
      {
        linkId: mockLink.id,
        sourceSkillId: mockLink.source_skill_id,
        targetSkillId: mockLink.target_skill_id,
      },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("does not remove link if no link is selected", () => {
    const { result } = renderHook(() => useSkillLinkEditor(), {
      wrapper: QueryWrapper,
    });

    expect(result.current.unlinkingLink).toBe(null);

    act(() => {
      result.current.methods.confirmRemoval();
    });

    expect(result.current.unlinkingLink).toBe(null);
  });
});

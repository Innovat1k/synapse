import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { useSkillModal } from "./useSkillModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as skillService from "../../../../../services/skillService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../../../services/skillService")

describe("useSkillModal", () => {
  const mockSkill = {
    name: "React js",
    skill_id: "550e8400-e29b-41d4-a716-446655440000",
    category: "frontend",
    level: 4,
    description: "online free react js course to get certification.",
    tags: ["programming", "visual"],
  };

  let wrapper;
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  });

  it("opens modal with create status", () => {
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openCreateModal();
    });

    expect(result.current.modal.modalMode).toBe("create");
    expect(result.current.modal.isModalOpen).toBeTruthy();
  });

  it("opens modal with edit status", () => {
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openEditModal(mockSkill);
    });

    expect(result.current.modal.modalMode).toBe("edit");
    expect(result.current.modal.isModalOpen).toBeTruthy();
    expect(result.current.selectedSkill).toEqual(mockSkill);
  });

  it("opens modal with create status", () => {
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openDeleteModal(mockSkill);
    });

    expect(result.current.modal.modalMode).toBe("delete");
    expect(result.current.modal.isModalOpen).toBeTruthy();
    expect(result.current.selectedSkill).toEqual(mockSkill);
  });

  it("changes modal state to false", () => {
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.closeModal();
    });

    expect(result.current.modal.isModalOpen).toBeFalsy();
  });

  it("calls createSkill service if modalMode is create while saving", async () => {
    // vi.spyOn(skillService, "createSkill");
    vi.mocked(skillService.createSkill).mockResolvedValue(mockSkill);
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openCreateModal();
    });
    await act(async () => {
      await result.current.methods.handleSaveSkill(mockSkill);
    });

    await waitFor(() => {
      expect(skillService.createSkill).toHaveBeenCalledWith(mockSkill);
      expect(result.current.isSubmitting).toBeFalsy();
      expect(result.current.modal.modalMode).toEqual("");
    });
  });

  it("calls updateSkill service if modalMode is create while saving", async () => {
    vi.spyOn(skillService, "updateSkill");
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openEditModal();
    });
    await act(async () => {
      await result.current.methods.handleSaveSkill(mockSkill);
    });

    await waitFor(() => {
      expect(skillService.updateSkill).toHaveBeenCalledWith(
        mockSkill.skill_id,
        mockSkill
      );
      expect(result.current.isSubmitting).toBeFalsy();
      expect(result.current.modal.modalMode).toEqual("");
    });
  });

  it("calls deleteSkill service to delete selected skill, and close delete modal", async () => {
    vi.spyOn(skillService, "deleteSkill");
    const { result } = renderHook(() => useSkillModal(), { wrapper: wrapper });

    act(() => {
      result.current.methods.openDeleteModal(mockSkill);
    });
    expect(result.current.modal.isModalOpen).toBeTruthy();

    act(() => {
      result.current.methods.handleDelete();
    });

    await waitFor(() => {
      expect(skillService.deleteSkill).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      expect(result.current.selectedSkill).toBe(null);
      expect(result.current.modal.isModalOpen).toBeFalsy();
    });
  });
});

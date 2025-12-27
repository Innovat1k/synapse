import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { useActivityModal } from "./useActivityModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as activityService from "../../../../services/activityService";

const mockActivity = {
  id: "4f6c2b9d-1e3a-47c1-9f89-cc12e47a5b10",
  skill_id: "e19a47c2-8f4b-4e6d-9db1-1f0b6b2c9a33",
  activity_type: "project work",
  logged_at: "2025-04-12T14:10:00Z",
  notes:
    "Worked on the frontend project by building reusable UI components, improving layout responsiveness, and refining the overall design system.",
  duration_minutes: 98,
  created_at: "2025-04-12T14:12:00Z",
  updated_at: "2025-04-12T15:48:00Z",
};

describe("useActivityModal", () => {
  let client;
  let Wrapper;

  beforeEach(() => {
    client = new QueryClient();
    Wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  });

  it("sets the modal states with create attributes", () => {
    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openCreateModal();
    });

    expect(result.current.modal.isOpened).toBe(true);
    expect(result.current.modal.mode).toBe("create");
    expect(result.current.selectedActivity).toEqual(null);
  });

  it("sets the modal states with edit attributes and passes the current activity to edit", () => {
    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openEditModal(mockActivity);
    });

    expect(result.current.modal.isOpened).toBe(true);
    expect(result.current.modal.mode).toBe("edit");
    expect(result.current.selectedActivity).toEqual(mockActivity);
  });

  it("sets the modal states with delete attributes and passes the current activity to delete", () => {
    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openDeleteModal(mockActivity);
    });

    expect(result.current.modal.isOpened).toBe(true);
    expect(result.current.modal.mode).toBe("delete");
    expect(result.current.selectedActivity).toEqual(mockActivity);
  });

  it("applies the closing states", () => {
    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.closeModal();
    });

    expect(result.current.modal.isOpened).toBe(false);
    expect(result.current.modal.mode).toBe("");
  });

  it("calls createActivity when mode is create", async () => {
    const createActivitySpy = vi
      .spyOn(activityService, "createActivity")
      .mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openCreateModal();
    });

    await act(async () => {
      await result.current.methods.handleSaveActivity(mockActivity);
    });

    await waitFor(() => {
      expect(createActivitySpy).toHaveBeenCalledWith(mockActivity);
    });
  });

  it("calls updateActivity when mode is edit", async () => {
    const updateActivitySpy = vi
      .spyOn(activityService, "updateActivity")
      .mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openEditModal(mockActivity);
    });

    await act(async () => {
      await result.current.methods.handleSaveActivity(mockActivity);
    });

    await waitFor(() => {
      expect(updateActivitySpy).toHaveBeenCalledWith(
        mockActivity.id,
        mockActivity
      );
    });
  });

  it("calls deleteActivity when mode is delete", async () => {
    const deleteActivitySpy = vi
      .spyOn(activityService, "deleteActivity")
      .mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useActivityModal(), {
      wrapper: Wrapper,
    });

    act(() => {
      result.current.methods.openDeleteModal(mockActivity);
    });

    await act(async () => {
      await result.current.methods.handleDelete();
    });

    await waitFor(() => {
      expect(deleteActivitySpy).toHaveBeenCalledWith(mockActivity.id);
    });

    expect(result.current.selectedActivity).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.modal.isOpened).toBe(false);
    expect(result.current.modal.mode).toBe("");
  });
});

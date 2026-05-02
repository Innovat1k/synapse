import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useActivityForm } from "./useActivityForm";

const mockActivity = {
  id: "m52-c-1l",
  skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
  activity_type: "research",
  logged_at: "2025-02-15T14:32:00Z",
  notes:
    "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
  duration_minutes: 147,
  track_id: "frontend-architecture"
};

describe("useActivityForm", () => {
  it("assigns activityData by initialData in edit mode", () => {
    const { result } = renderHook(() =>
      useActivityForm({
        mode: "edit",
        initialData: mockActivity,
        isOpened: true,
      })
    );

    expect(result.current.activityData).toEqual(mockActivity);
  });

  it("converts initialData's duration_minutes to separate hours and minutes in edit mode", () => {
    const mockInitialData = {
      ...mockActivity,
      duration_minutes: 345,
    };

    const { result } = renderHook(() =>
      useActivityForm({
        mode: "edit",
        initialData: mockInitialData,
        isOpened: true,
      })
    );

    expect(result.current.durationData).toEqual({ hours: 5, minutes: 45 });
  });

  it("changes duration forms values", () => {
    const mockChangeHours = { target: { id: "hours", value: "2" } };
    const mockChangeMinutes = { target: { id: "minutes", value: "27" } };

    const { result } = renderHook(() => useActivityForm({ mode: "create" }));

    act(() => {
      result.current.methods.handleChangeDuration(mockChangeHours);
    });
    act(() => {
      result.current.methods.handleChangeDuration(mockChangeMinutes);
    });

    expect(result.current.durationData).toEqual({ hours: 2, minutes: 27 });
  });

  it("changes activity forms values", () => {
    const mockResult = {
      skill_id: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
      activity_type: "research",
      logged_at: "2025-02-15T14:32:00Z",
      notes:
        "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
    };

    const mockChangeSkill = {
      target: { id: "skill_id", value: "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01" },
    };
    const mockChangeDate = {
      target: {
        id: "logged_at",
        value: "2025-02-15T14:32:00Z",
      },
    };
    const mockChangeActivityType = {
      target: { id: "activity_type", value: "research" },
    };
    const mockChangeNotes = {
      target: {
        id: "notes",
        value:
          "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
      },
    };

    const { result } = renderHook(() =>
      useActivityForm({ mode: "create", isOpened: true })
    );

    act(() => {
      result.current.methods.handleChange(mockChangeSkill);
    });
    act(() => {
      result.current.methods.handleChange(mockChangeDate);
    });
    act(() => {
      result.current.methods.handleChange(mockChangeActivityType);
    });
    act(() => {
      result.current.methods.handleChange(mockChangeNotes);
    });

    expect(result.current.activityData).toEqual(mockResult);
  });
});

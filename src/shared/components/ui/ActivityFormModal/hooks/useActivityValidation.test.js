import { renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useActivityValidation } from "./useActivityValidation";

const mockActivityData = ({
  activity_type = "practice",
  logged_at = "2025-02-15T14:32:00Z",
  notes = "Practiced advanced JavaScript concepts including async patterns and performance optimization.",
  skill_id = "8f14e45f-ea71-4b9f-9c62-1d5f7ccf9c01",
}) => ({
  activity_type,
  logged_at,
  notes,
  skill_id,
});

const durationData = ({ hours = 1, minutes = 22 }) => ({ hours, minutes });

const mockTouchedState = ({
  skill_id = false,
  logged_at = false,
  duration = false,
  activity_type = false,
}) => ({
  skill_id,
  logged_at,
  duration,
  activity_type,
});

describe("useActivityValidation", () => {
  it("returns duration error if minutes is less than 1 and invalidate form", () => {
    const { result } = renderHook(() =>
      useActivityValidation({
        activityData: mockActivityData,
        durationData: durationData({ hours: 0, minutes: 0 }),
        touched: mockTouchedState({ duration: true }),
      })
    );

    expect(result.current.errors.duration).toBe(
      "Duration must be at least 1 minute."
    );
    expect(result.current.isValid).toBe(false);
  });

  it("returns skill error if no skill is selected", () => {
    const { result } = renderHook(() =>
      useActivityValidation({
        activityData: mockActivityData({ skill_id: "" }),
        durationData: durationData,
        touched: mockTouchedState({ skill_id: true }),
      })
    );

    expect(result.current.errors.skill).toBe("Please select a skill.");
    expect(result.current.isValid).toBe(false);
  });

  it("returns type error if no activity is selected", () => {
    const { result } = renderHook(() =>
      useActivityValidation({
        activityData: mockActivityData({ activity_type: "" }),
        durationData: durationData,
        touched: mockTouchedState({ activity_type: true }),
      })
    );

    expect(result.current.errors.activity_type).toBe(
      "Please select an activity type."
    );
    expect(result.current.isValid).toBe(false);
  });

  it("returns date error if date or time are not provided", () => {
    const { result } = renderHook(() =>
      useActivityValidation({
        activityData: mockActivityData({ logged_at: "" }),
        durationData: durationData,
        touched: mockTouchedState({ logged_at: true }),
      })
    );

    expect(result.current.errors.logged_at).toBe(
      "Please select a date and time."
    );
    expect(result.current.isValid).toBe(false);
  });
});

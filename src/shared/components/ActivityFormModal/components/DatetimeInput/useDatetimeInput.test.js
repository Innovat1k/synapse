import { renderHook } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import { useDatetimeInput } from "./useDatetimeInput";

const MOCK_DATE_VALUE = "2025-02-15T14:32";

describe("useDatetimeInput", () => {
  it("returns separate date and time if inputs values change", () => {
    const { result } = renderHook(() =>
      useDatetimeInput(MOCK_DATE_VALUE, vi.fn())
    );

    expect(result.current.dateValue).toEqual("2025-02-15");
    expect(result.current.timeValue).toEqual("14:32");
  });
});

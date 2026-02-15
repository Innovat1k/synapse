import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useGraphModal } from "./useGraphModal";

describe("useGraphModal", () => {
  it("opens GraphModal", () => {
    const { result } = renderHook(() => useGraphModal());

    act(() => {
      result.current.openGraphModal();
    });
    expect(result.current.isGraphModalOpen).toBe(true);
  });

    it("closes GraphModal", () => {
    const { result } = renderHook(() => useGraphModal());

    act(() => {
      result.current.closeGraphModal();
    });
    expect(result.current.isGraphModalOpen).toBe(false);
  });
});

import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useSkillLinkerModal } from "./useSkillLinkerModal";

describe("useSkillLinkerModal", () => {
  it("initializes with a closed modal and no mode", () => {
    const { result } = renderHook(() => useSkillLinkerModal());

    expect(result.current.linkerModal).toEqual({
      isOpen: false,
      mode: null,
    });
  });

  it("opens the linker modal with the given mode", () => {
    const { result } = renderHook(() => useSkillLinkerModal());

    act(() => {
      result.current.openLinkerModal("incoming");
    });

    expect(result.current.linkerModal.isOpen).toBe(true);
    expect(result.current.linkerModal.mode).toBe("incoming");
  });

  it("closes the linker modal and reset its mode", () => {
    const { result } = renderHook(() => useSkillLinkerModal());

    act(() => {
      result.current.closeLinkerModal();
    });

    expect(result.current.linkerModal.isOpen).toBe(false);
    expect(result.current.linkerModal.mode).toBe(null);
  });
});

import { renderHook } from "@testing-library/react";
import { useIsTopModal } from "./useIsTopModal";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useIsTopModal (unit tests)", () => {
  const originalQuerySelectorAll = document.querySelectorAll;

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.querySelectorAll = originalQuerySelectorAll;
  });

  it("returns false by default", () => {
    const { result } = renderHook(() =>
      useIsTopModal(false, { current: null }),
    );
    expect(result.current).toBe(false);
  });

  it("returns false if isOpen is false even when modalRef is defined", () => {
    const mockRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useIsTopModal(false, mockRef));
    expect(result.current).toBe(false);
  });

  it("returns false if modalRef.current is null when isOpen is true", () => {
    const { result } = renderHook(() => useIsTopModal(true, { current: null }));
    expect(result.current).toBe(false);
  });

  it("sets isTop to true when isOpen is true and modalRef.current is the last modal", () => {
    const fakeModal = document.createElement("div");
    fakeModal.setAttribute("role", "dialog");
    const mockRef = { current: fakeModal };

    document.querySelectorAll = vi.fn(() => [fakeModal]);

    const { result } = renderHook(() => useIsTopModal(true, mockRef));

    expect(result.current).toBe(true);
  });

  it("sets isTop to false if modalRef is not the last element", () => {
    const fakeModal1 = document.createElement("div");
    const fakeModal2 = document.createElement("div");
    const mockRef = { current: fakeModal1 };

    document.querySelectorAll = vi.fn(() => [fakeModal1, fakeModal2]);

    const { result } = renderHook(() => useIsTopModal(true, mockRef));

    expect(result.current).toBe(false);
  });
});

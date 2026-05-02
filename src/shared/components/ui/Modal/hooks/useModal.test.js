import { renderHook, act } from "@testing-library/react";
import { useModal } from "./useModal";

describe("useModal", () => {
  it("initializes with isOpen = false", () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it("opens the modal", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("closes the modal", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("toggles the modal state", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleModal();
    });
    expect(result.current.isOpen).toBe(false);
  });
});

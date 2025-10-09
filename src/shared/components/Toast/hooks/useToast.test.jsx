import { act, renderHook } from "@testing-library/react";
import { describe, expect } from "vitest";
import { useToast } from "./useToast";
import { createStore, Provider } from "jotai";
import { notification_atom } from "../../../../atoms/atoms";

describe("useToast", () => {
  it("changes notification visibility state", () => {
    const mockNotification = {
      isVisible: false,
      type: "",
      message: "",
    };

    const store = createStore();

    store.set(notification_atom, mockNotification);

    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useToast(), { wrapper: Wrapper });

    expect(result.current.notif.isVisible).toBeFalsy();

    act(() => {
      result.current.closeNotif();
    });

    expect(result.current.notif.isVisible).toBeTruthy();
  });
});

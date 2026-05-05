import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { useNetworkStatus } from "./useNetworkStatus";
import { isOnlineAtom } from "@atoms/networkAtom";

const store = createStore();
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe("useNetworkStatus (unit tests)", () => {
  beforeEach(() => {
    store.set(isOnlineAtom, true);
  });

  it("initializes atom", () => {
    renderHook(() => useNetworkStatus(), { wrapper });
    expect(store.get(isOnlineAtom)).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import NetworkStatus from "./NetworkStatus";
import { isOnlineAtom } from "@atoms/networkAtom";

const store = createStore();

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe("NetworkStatus (integration)", () => {
  it("does not render when online", () => {
    act(() => {
      store.set(isOnlineAtom, true);
    });

    render(<NetworkStatus />, { wrapper });

    expect(screen.queryByText(/offline/i)).not.toBeInTheDocument();
  });

  it("renders banner when offline", async () => {
    act(() => {
      store.set(isOnlineAtom, false);
    });

    render(<NetworkStatus />, { wrapper });

    expect(await screen.findByText(/offline mode/i)).toBeInTheDocument();
    expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();
  });

  it("shows/hides banner when atom changes", async () => {
    render(<NetworkStatus />, { wrapper });

    // OFFLINE → banner appears
    act(() => {
      store.set(isOnlineAtom, false);
    });

    expect(await screen.findByText(/offline mode/i)).toBeInTheDocument();

    // ONLINE → banner disappears
    act(() => {
      store.set(isOnlineAtom, true);
    });

    expect(screen.queryByText(/offline/i)).not.toBeInTheDocument();
  });
});

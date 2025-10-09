import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect } from "vitest";
import ToastComponent from "./ToastComponent";
import { Toast } from "radix-ui";
import { createStore, Provider } from "jotai";
import { notification_atom } from "../../../../atoms/atoms";

describe("ToastComponent", () => {
  let store;
  let Wrapper;
  let mockNotification;

  beforeEach(() => {
    store = createStore();
    Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    mockNotification = ({ isVisible = true, type = "error", message }) => {
      return {
        isVisible,
        type,
        message,
      };
    };
  });

  it("shows error message if SignIn submit fails", () => {
    store.set(
      notification_atom,
      mockNotification({
        message:
          "Invalid login credentials. Please check your email and password.",
      })
    );

    render(
      <Toast.Provider>
        <ToastComponent />
      </Toast.Provider>,
      { wrapper: Wrapper }
    );
    screen.debug();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
  });

  it("shows error message if SignUp submit fails", () => {
    store.set(
      notification_atom,
      mockNotification({
        message: "Something went wrong. Please try again later.",
      })
    );

    render(
      <Toast.Provider>
        <ToastComponent />
      </Toast.Provider>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it("shows error message if email is invalid in SignUp", () => {
    store.set(
      notification_atom,
      mockNotification({
        message: "This email is already registered. Please sign in instead.",
      })
    );

    render(
      <Toast.Provider>
        <ToastComponent />
      </Toast.Provider>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/already registered/i)).toBeInTheDocument();
  });
});

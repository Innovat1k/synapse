import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserAuthPage from "./UserAuthPage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { createStore, Provider } from "jotai";
import { formDataAtom, isLoginAtom } from "@atoms/formDataAtom";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockHandleChange = vi.fn();
const mockHandleBlur = vi.fn();
const mockHandleToggleAuth = vi.fn();

vi.mock("./hooks/useAuth", async () => {
  const actual = await vi.importActual("./hooks/useAuth");
  return {
    ...actual,
    useAuth: () => {
      const actualAuth = actual.useAuth();
      return {
        ...actualAuth,
        methods: {
          ...actualAuth.methods,
          // Mock api calls only
          handleSignIn: mockSignIn,
          handleSignUp: mockSignUp,
          handleSignOut: mockSignOut,
        },
      };
    },
  };
});

describe("UserAuthPage", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockSignIn.mockClear();
    mockSignUp.mockClear();
    mockHandleChange.mockClear();
    mockHandleBlur.mockClear();
    mockHandleToggleAuth.mockClear();
  });

  // ===================================================================
  // DESCRIBE : Rendering
  // ===================================================================
  describe("Rendering", () => {
    it("renders sign in form when isLogin is true", () => {
      const store = createStore();
      store.set(isLoginAtom, true);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      expect(
        screen.getByRole("heading", { name: /sign in/i, level: 2 })
      ).toBeVisible();
      expect(screen.getByLabelText(/email/i)).toBeVisible();
      expect(screen.getByLabelText(/password$/i)).toBeVisible();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeVisible();
      expect(
        screen.queryByLabelText(/Confirm Password/i)
      ).not.toBeInTheDocument();
    });

    it("renders sign up form when isLogin is false", () => {
      const store = createStore();
      store.set(isLoginAtom, false);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      expect(
        screen.getByRole("heading", { name: /sign up/i, level: 2 })
      ).toBeVisible();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeInTheDocument();

      screen.debug();
    });

    it("disables submit button when form data is empty", () => {
      const store = createStore();
      store.set(isLoginAtom, true);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
    });
  });

  // ===================================================================
  // DESCRIBE : Interactions
  // ===================================================================
  describe("Interactions", () => {
    it("allows user to type in inputs and updates formData", async () => {
      const store = createStore();
      store.set(isLoginAtom, true);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const signInBtn = screen.getByRole("button", { name: /sign in/i });
      await waitFor(() => {
        expect(signInBtn).toBeEnabled();
      });
    });

    it("enables submit button when form data is filled and calls handleSignIn", async () => {
      const store = createStore();
      store.set(isLoginAtom, true);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const signInBtn = screen.getByRole("button", { name: /sign in/i });
      await waitFor(() => {
        expect(signInBtn).toBeEnabled();
      });

      await user.click(signInBtn);
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    it("enables submit button when form data is valid and calls handleSignUp", async () => {
      const store = createStore();
      store.set(isLoginAtom, false);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password123");

      const signUpBtn = screen.getByRole("button", { name: /sign up/i });
      await waitFor(() => {
        expect(signUpBtn).toBeEnabled();
      });

      await user.click(signUpBtn);
      expect(mockSignUp).toHaveBeenCalledTimes(1);
    });

    it("disables submit button and shows error when passwords do not match in sign up", async () => {
      const store = createStore();
      store.set(isLoginAtom, false);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "different123");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/Confirmation password doesn't match the password/i)
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
      });
    });

    it("switches form mode when user clicks switch mode link", async () => {
      const store = createStore();
      store.set(isLoginAtom, true);
      store.set(formDataAtom, {
        email: "",
        password: "",
        confirmPassword: "",
      });

      const atomWrap = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>,
        { wrapper: atomWrap }
      );

      expect(
        screen.getByRole("heading", { name: /sign in/i })
      ).toBeInTheDocument();

      expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();

      await user.click(screen.getByText(/sign up/i));

      expect(
        screen.getByRole("heading", { name: /sign up/i })
      ).toBeInTheDocument();
    });
  });
});

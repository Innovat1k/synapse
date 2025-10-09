import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import UserAuthPage from "./UserAuthPage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useOutletContext } from "react-router-dom";

const mockChange = vi.fn();
const mockBlur = vi.fn();
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

const initialLoader = { isSubmitting: false, isInitialLoading: false };
const initialFormData = { email: "", password: "", confirmPassword: "" };

const mockOutletContext = ({
  isLogin = true,
  loader = initialLoader,
  formData = initialFormData,
}) => ({
  isLogin,
  loader,
  methods: {
    handleChange: mockChange,
    handleToggleAuth: vi.fn(),
    handleSignIn: mockSignIn,
    handleSignUp: mockSignUp,
    handleBlur: mockBlur,
  },
  formData,
  touched: { email: false, password: false, confirmPassword: false },
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: vi.fn(),
  };
});

describe("UserAuthPage", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("calls handleChange if user types", async () => {
    useOutletContext.mockReturnValue(mockOutletContext({ isLogin: true }));
    render(
      <MemoryRouter>
        <UserAuthPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Email"), "octobe@");
    expect(mockChange).toHaveBeenCalledTimes(7);

    await user.type(screen.getByLabelText("Password"), "octo09");
    expect(mockChange).toHaveBeenCalled();
  });

  it("calls handleBlur if user unfocus any input", async () => {
    useOutletContext.mockReturnValue(mockOutletContext({ isLogin: true }));
    render(
      <MemoryRouter>
        <UserAuthPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Email"), "octobe@");
    await user.click(screen.getByRole("button"));
    expect(mockBlur).toHaveBeenCalled();
  });

  it("disables the submit button if formData is empty", async () => {
    useOutletContext.mockReturnValue(mockOutletContext({ isLogin: true }));
    render(
      <MemoryRouter>
        <UserAuthPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("disables the submit button if there is isSubmiting state", async () => {
    useOutletContext.mockReturnValue(
      mockOutletContext({
        isLogin: true,
        loader: { isSubmitting: true, isInitialLoading: false },
      })
    );
    render(
      <MemoryRouter>
        <UserAuthPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button");
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/submitting/i);
  });

  describe("SignIn", () => {
    it("displays email and password inputs correctly while on SignIn form", () => {
      useOutletContext.mockReturnValue(mockOutletContext({ isLogin: true }));
      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>
      );

      expect(
        screen.getByRole("heading", { name: /sign in/i, level: 2 })
      ).toBeVisible();
      expect(screen.getByLabelText("Email")).toBeVisible();
      expect(screen.getByLabelText("Password")).toBeVisible();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    it("enables submitting button and calls handleSignIn if user fills formData", async () => {
      useOutletContext.mockReturnValue(
        mockOutletContext({
          isLogin: true,
          formData: { email: "octobuser@gmail.com", password: "secure09" },
        })
      );
      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>
      );

      const signInBtn = screen.getByRole("button", { name: /sign in/i });
      expect(signInBtn).toBeEnabled();

      await user.click(signInBtn);
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  describe("SignUp", () => {
    it("displays email, password and confirm password while on SignUp form", () => {
      useOutletContext.mockReturnValue(mockOutletContext({ isLogin: false }));
      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>
      );

      expect(
        screen.getByRole("heading", { name: /sign up/i, level: 2 })
      ).toBeVisible();
      expect(screen.getByLabelText("Email")).toBeVisible();
      expect(screen.getByLabelText("Password")).toBeVisible();
      expect(screen.getByRole("button", { name: /sign up/i })).toBeVisible();
    });

    it("disables the submit button if confirmPassword is different of password on signUp form", async () => {
      useOutletContext.mockReturnValue(
        mockOutletContext({
          isLogin: false,
          formData: {
            email: "octobuser@gmail.com",
            password: "secure09",
            confirmPassword: "secure9",
          },
        })
      );
      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>
      );

      expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
    });

    it("enables submitting button and calls handleSignUp if user fills formData", async () => {
      useOutletContext.mockReturnValue(
        mockOutletContext({
          isLogin: false,
          formData: {
            email: "octobuser@yahoo.com",
            password: "secure09",
            confirmPassword: "secure09",
          },
        })
      );
      render(
        <MemoryRouter>
          <UserAuthPage />
        </MemoryRouter>
      );

      const signUpBtn = screen.getByRole("button", { name: /sign up/i });
      expect(signUpBtn).toBeEnabled();

      await user.click(signUpBtn);
      expect(mockSignUp).toHaveBeenCalled();
    });
  });
});

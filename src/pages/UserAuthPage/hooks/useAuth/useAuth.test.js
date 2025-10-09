import { beforeEach, describe, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockAuth = {
  getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
  onAuthStateChange: vi.fn((callback) => {
    callback("INITIAL", null);
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  }),

  signInWithPassword: vi
    .fn()
    .mockResolvedValue({ data: { user: { id: "123" } }, error: null }),

  signUp: vi
    .fn()
    .mockResolvedValue({ data: { user: { id: "456" } }, error: null }),

  signOut: vi.fn().mockResolvedValue({ error: null }),
};

vi.mock("../../../../services/supabase-client", () => ({
  supabase: {
    get auth() {
      return mockAuth;
    },
  },
}));

const mockFormData = { email: "test@example.com", password: "password123" };
const mockUseFormData = {
  isLogin: true,
  formData: mockFormData,
  touched: {},
  handleBlur: vi.fn(),
  handleToggleAuth: vi.fn(),
  handleChange: vi.fn(),
};

vi.mock("../../../../shared/hooks/useFormData/useFormData", () => ({
  useFormData: () => mockUseFormData,
}));

describe("useAuth", () => {
  beforeEach(() => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: "456" } },
      error: null,
    });
    mockAuth.getSession.mockResolvedValue({ data: { session: null } });
    mockNavigate.mockClear();
  });

  it("nitializes the session and stops initial loading", async () => {
    const mockSession = { user: { id: "active-user" } };
    mockAuth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockAuth.getSession).toHaveBeenCalled();
      expect(mockAuth.onAuthStateChange).toHaveBeenCalled();
    });

    expect(result.current.loader.isInitialLoading).toBe(false);
  });

  it("handleSignIn: navigates to /dashboard while success", async () => {
    const { result } = renderHook(() => useAuth());
    const mockEvent = { preventDefault: vi.fn() };

    result.current.methods.handleSignIn(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith(mockFormData);
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      expect(result.current.loader.isSubmitting).toBe(false);
    });
  });

  it("handleSignIn: throws error if the authentication fails", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid credentials" },
    });

    const { result } = renderHook(() => useAuth());

    result.current.methods.handleSignIn({ preventDefault: vi.fn() });

    await waitFor(() => {
      expect(result.current.notification.isVisible).toBe(true);
      expect(result.current.notification.type).toBe("error");
      expect(result.current.notification.message).toContain(
        "Invalid login credentials"
      );

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.loader.isSubmitting).toBe(false);
    });
  });

  it("handleSignUp: navigates to /auth/check-email while success", async () => {
    const { result } = renderHook(() => useAuth());

    result.current.methods.handleSignUp({ preventDefault: vi.fn() });

    await waitFor(() => {
      expect(mockAuth.signUp).toHaveBeenCalledWith(mockFormData);
      expect(mockNavigate).toHaveBeenCalledWith("/auth/check-email");
      expect(result.current.loader.isSubmitting).toBe(false);
    });
  });

  it("handleSignUp: shows message for registered user", async () => {
    mockAuth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: "User already registered" },
    });

    const { result } = renderHook(() => useAuth());

    result.current.methods.handleSignUp({ preventDefault: vi.fn() });

    await waitFor(() => {
      expect(result.current.notification.isVisible).toBe(true);
      expect(result.current.notification.type).toBe("error");
      expect(result.current.notification.message).toContain(
        "already registered"
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("handleSignOut: calls signOut and navigate to /auth", async () => {
    const { result } = renderHook(() => useAuth());

    result.current.methods.handleSignOut();

    await waitFor(() => {
      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
      expect(result.current.loader.isInitialLoading).toBe(false);
    });
  });
});

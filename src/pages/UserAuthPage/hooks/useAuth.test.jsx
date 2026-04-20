import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@shared/components/Toast/hooks/useToast", () => ({
  useToast: () => ({ showNotif: vi.fn() }),
}));

vi.mock("@services/supabase-lazy", () => {
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
  return {
    getSupabase: vi.fn().mockResolvedValue({ auth: mockAuth }),
    __mockAuth: mockAuth,
  };
});

const mockFormData = { email: "test@example.com", password: "password123" };
const mockUseFormData = {
  isLogin: true,
  formData: mockFormData,
  touched: {},
  handleBlur: vi.fn(),
  handleToggleAuth: vi.fn(),
  handleChange: vi.fn(),
  resetForm: vi.fn(),
};

vi.mock("./useFormData", () => ({
  useFormData: () => mockUseFormData,
}));

const Wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe("useAuth", () => {
  let mockAuth;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    const supabaseLazy = await import("@services/supabase-lazy");
    const supabase = await supabaseLazy.getSupabase();
    mockAuth = supabase.auth;

    mockAuth.getSession.mockResolvedValue({ data: { session: null } });
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: "456" } },
      error: null,
    });
    mockAuth.signOut.mockResolvedValue({ error: null });
  });

  it("initializes the session and stops initial loading", async () => {
    const mockSession = {
      user: { id: "active-user", email: "test@example.com" },
    };

    mockAuth.getSession.mockResolvedValueOnce({
      data: { session: mockSession },
    });

    mockAuth.onAuthStateChange.mockImplementationOnce((callback) => {
      callback("SIGNED_IN", mockSession);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.loader.isInitialLoading).toBe(false);
    });

    expect(result.current.user?.id).toBe("active-user");
  });

  it("handleSignIn: navigates to /dashboard while success", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() =>
      expect(result.current.loader.isInitialLoading).toBe(false),
    );

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      await result.current.methods.handleSignIn(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith(mockFormData);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(result.current.loader.isSubmitting).toBe(false);
  });

  it("handleSignIn: stays on error", async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid credentials" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() =>
      expect(result.current.loader.isInitialLoading).toBe(false),
    );

    await act(async () => {
      await result.current.methods.handleSignIn({ preventDefault: vi.fn() });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.loader.isSubmitting).toBe(false);
  });

  it("handleSignUp: navigates to /auth/check-email while success", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() =>
      expect(result.current.loader.isInitialLoading).toBe(false),
    );

    await act(async () => {
      await result.current.methods.handleSignUp({ preventDefault: vi.fn() });
    });

    expect(mockAuth.signUp).toHaveBeenCalledWith(mockFormData);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/check-email");
    expect(result.current.loader.isSubmitting).toBe(false);
  });

  it("handleSignUp: stays on error", async () => {
    mockAuth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: "User already registered" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() =>
      expect(result.current.loader.isInitialLoading).toBe(false),
    );

    await act(async () => {
      await result.current.methods.handleSignUp({ preventDefault: vi.fn() });
    });

    expect(mockNavigate).not.toHaveBeenCalledWith("/auth/check-email");
  });

  it("handleSignOut: calls signOut and does NOT navigate on success", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    await waitFor(() =>
      expect(result.current.loader.isInitialLoading).toBe(false),
    );

    await act(async () => {
      await result.current.methods.handleSignOut();
    });

    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

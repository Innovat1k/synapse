import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthRedirect } from "./useAuthRedirect";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  const mockNavigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
  };
});

vi.mock("../useAuth/useAuth", () => ({
  useAuth: vi.fn(),
}));

import * as routerDom from "react-router-dom";
import * as useAuthModule from "../useAuth/useAuth";

describe("useAuthRedirect", () => {
  const mockNavigate = routerDom.useNavigate();

  beforeEach(() => {
    mockNavigate.mockClear();
    routerDom.useLocation.mockClear();
    useAuthModule.useAuth.mockClear();
  });

  it("redirects to '/auth' if userSession is null and if user isn't in auth page", () => {
    useAuthModule.useAuth.mockReturnValue({
      userSession: null,
      isLoading: false,
    });
    routerDom.useLocation.mockReturnValue({ pathname: "/dashboard" });

    renderHook(() => useAuthRedirect());

    expect(mockNavigate).toHaveBeenCalledWith("/auth", { replace: true });
  });

  it("doesn't redirect if userSession is null and location is '/auth'", () => {
    useAuthModule.useAuth.mockReturnValue({
      userSession: null,
      isLoading: false,
    });
    routerDom.useLocation.mockReturnValue({ pathname: "/auth" });

    renderHook(() => useAuthRedirect());

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard if there is userSession and location is '/auth'", () => {
    useAuthModule.useAuth.mockReturnValue({
      userSession: { id: "123" },
      isLoading: false,
    });
    routerDom.useLocation.mockReturnValue({ pathname: "/auth" });

    renderHook(() => useAuthRedirect());

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("doen't redirect while loading", () => {
    useAuthModule.useAuth.mockReturnValue({
      userSession: null,
      isLoading: true,
    });
    routerDom.useLocation.mockReturnValue({ pathname: "/settings" });

    renderHook(() => useAuthRedirect());

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../useAuth/useAuth";

/**
 * Custom hook for managing authentication-related redirects.
 * It ensures that unauthenticated users cannot access private routes
 * and that authenticated users do not remain on authentication pages.
 */
export const useAuthRedirect = () => {
  const { userSession, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const AUTH_PATHS = ["/auth", "/auth/check-email"];
  const isAuthRoute = AUTH_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    if (isLoading) return;

    // Redirect non authenticated user
    if (!userSession && !isAuthRoute) {
      navigate("/auth", { replace: true });
      return;
    }

    // Redirect user to main
    if (userSession && isAuthRoute) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [userSession, isLoading, isAuthRoute, navigate]);
};


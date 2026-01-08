import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase-client";
import { useAtom } from "jotai";
import {
  notification_atom,
  session_atom,
  user_atom,
} from "../../../atoms/atoms";
import { useNavigate } from "react-router-dom";
import { useFormData } from "./useFormData";

/**
 * Manages user authentication and session state with Supabase.
 *
 * Handles:
 * - Initial session restoration on app load (with timeout fallback)
 * - Sign-in and sign-up flows with user feedback via notifications
 * - Secure sign-out (clears form data and navigates away)
 * - Real-time auth state sync via Supabase listener
 *
 * Uses Jotai atoms only to ensure stable state during mounting
 * (prevents undefined values), not for cross-component sharing.
 *
 * @param {void} — This hook takes no parameters.
 * @returns {{
 *   loader: { isSubmitting: boolean; isInitialLoading: boolean; isSigningOut: boolean },
 *   isLoading: boolean,
 *   userSession: import('@supabase/supabase-js').Session | null,
 *   user: import('@supabase/supabase-js').User | null,
 *   notification: { isVisible?: boolean; type: string; message: string },
 *   methods: {
 *     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *     handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
 *     handleToggleAuth: () => void,
 *     handleSignIn: (e: React.FormEvent) => Promise<void>,
 *     handleSignUp: (e: React.FormEvent) => Promise<void>,
 *     handleSignOut: () => Promise<void>
 *   }
 * }} Authentication state and action handlers.
 */

export const useAuth = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [notification, setNotification] = useAtom(notification_atom);
  const [userSession, setUserSession] = useAtom(session_atom);
  const [user, setUser] = useAtom(user_atom);

  // Get form input methods
  const { formData, handleBlur, handleToggleAuth, handleChange, resetForm } =
    useFormData();

  const navigate = useNavigate();

  // Check and update user session
  useEffect(() => {
    let isSubscribed = true;
    let timeoutId;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (isSubscribed) {
          setUserSession(data.session);
          setIsInitialLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        if (isSubscribed) {
          setIsInitialLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    // Guard Timeout (5 seconds)
    timeoutId = setTimeout(() => {
      if (isSubscribed) {
        setIsInitialLoading(false);
      }
    }, 5000);

    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (isSubscribed) {
        setUserSession(session);
      }
    });

    const subscription = authListener.data.subscription;

    initAuth();

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [setUserSession]);

  // Get user with session
  useEffect(() => {
    if (userSession?.user) {
      setUser(userSession.user);
    } else {
      setUser(null);
    }
  }, [userSession, setUser]);

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setNotification({
          isVisible: true,
          type: "error",
          message:
            "Invalid login credentials. Please check your email and password.",
        });
      } else {
        // TODO: show user-facing success (toast)
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        const isUserExistsError = /registered/i.test(error.message);
        setNotification({
          isVisible: true,
          type: "error",
          message: isUserExistsError
            ? "This email is already registered. Please sign in instead."
            : "Something went wrong. Please try again later.",
        });
      } else {
        navigate("/auth/check-email");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    setIsInitialLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // TODO: show user-facing success (toast)
      } else {
        resetForm();
        navigate("/auth");
      }
    } finally {
      setIsSigningOut(false);
      setIsInitialLoading(false);
    }
  };

  return {
    loader: { isSubmitting, isInitialLoading, isSigningOut },
    userSession,
    user,
    notification,
    methods: {
      handleChange,
      handleToggleAuth,
      handleSignIn,
      handleSignOut,
      handleSignUp,
      handleBlur,
    },
  };
};

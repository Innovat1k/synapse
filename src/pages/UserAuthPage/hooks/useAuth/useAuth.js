import { useEffect, useState } from "react";
import { supabase } from "../../../../services/supabase-client";
import { useAtom } from "jotai";
import {
  notification_atom,
  session_atom,
  user_atom,
} from "../../../../atoms/atoms";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../../../../shared/hooks/useFormData/useFormData";

/**
 * Custom hook for managing users authentication and session.
 * It ensures that users can create account and login with existing account
 * and also allows logged users to sign out.
 */

export const useAuth = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useAtom(notification_atom);
  const [userSession, setUserSession] = useAtom(session_atom);
  const [user, setUser] = useAtom(user_atom);

  // Get form input methods
  const {
    isLogin,
    formData,
    touched,
    handleBlur,
    handleToggleAuth,
    handleChange,
    resetForm,
  } = useFormData();

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
        console.warn(
          "Auth check timed out after 5s – proceeding unauthenticated"
        );
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

  // Sign Out user
  const handleSignOut = async () => {
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
      setIsInitialLoading(false);
    }
  };

  return {
    loader: { isSubmitting, isInitialLoading },
    isLoading: isInitialLoading,
    isLogin,
    userSession,
    user,
    methods: {
      handleChange,
      handleToggleAuth,
      handleSignIn,
      handleSignOut,
      handleSignUp,
      handleBlur,
    },
    notification,
    formData,
    touched,
  };
};

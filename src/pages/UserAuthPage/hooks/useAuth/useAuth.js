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
  } = useFormData();

  const navigate = useNavigate();

  // Check and update user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    setIsInitialLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get user with session
  useEffect(() => {
    if (userSession?.user) {
      setUser(userSession.user);
    } else {
      setUser(null);
    }
  }, [userSession]);

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
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
        console.log("User authenticated :", data.user);
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
      const { error, data } = await supabase.auth.signUp({
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
        console.log(
          "User account creation proceded, please check your email to confirm submission."
        );
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
        console.log("An error has occured while signing out:", error);
      } else {
        navigate("/auth");
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  return {
    loader: { isSubmitting, isInitialLoading },
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

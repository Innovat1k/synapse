import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { notification_atom, session_atom, user_atom } from "@atoms/atoms";
import { useNavigate } from "react-router-dom";
import { useFormData } from "./useFormData";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { TOAST_MESSAGES } from "@shared/components/Toast/toastMessages";
import { getSupabase } from "@services/supabase.lazy";

// Manages full authentication flow (sign-in/sign-up/sign-out) with session persistence via Jotai atoms.
// Includes 5s timeout fallback on init and lazy Supabase client loading for performance.
export const useAuth = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [notification, setNotification] = useAtom(notification_atom);
  const [userSession, setUserSession] = useAtom(session_atom);
  const [user, setUser] = useAtom(user_atom);

  const { formData, handleBlur, handleToggleAuth, handleChange, resetForm } =
    useFormData();
  const { showNotif } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;
    let timeoutId;

    const initAuth = async () => {
      try {
        const supabase = await getSupabase();
        const { data } = await supabase.auth.getSession();
        if (isSubscribed) {
          setUserSession(data.session);
          setIsInitialLoading(false);
          clearTimeout(timeoutId);
        }
      } catch {
        if (isSubscribed) {
          setIsInitialLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    // Guard Timeout (5 secondes)
    timeoutId = setTimeout(() => {
      if (isSubscribed) {setIsInitialLoading(false);}
    }, 5000);

    const setupListener = async () => {
      const supabase = await getSupabase();
      const authListener = supabase.auth.onAuthStateChange((_, session) => {
        if (isSubscribed) {setUserSession(session);}
      });
      return authListener.data.subscription;
    };

    let subscription;
    initAuth().then(async () => {
      subscription = await setupListener();
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      if (subscription) {subscription.unsubscribe();}
    };
  }, [setUserSession]);

  useEffect(() => {
    if (userSession?.user) {setUser(userSession.user);}
    else {setUser(null);}
  }, [userSession, setUser]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {showNotif(TOAST_MESSAGES.AUTH.SIGN_IN_ERROR, "error");}
      else {navigate("/dashboard");}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ type: "", message: "" });

    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {showNotif(TOAST_MESSAGES.AUTH.SIGN_UP_ERROR, "error");}
      else {navigate("/auth/check-email");}
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setIsInitialLoading(true);

    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) {throw error;}

      showNotif(TOAST_MESSAGES.AUTH.SIGN_OUT_SUCCESS, "success");
      resetForm();
      navigate("/auth");
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

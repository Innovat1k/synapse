import { useState } from "react";

/**
 * Manages form state and user input for authentication (sign-in / sign-up).
 *
 * Tracks field values and touched status for real-time validation.
 * Allows toggling between login and registration modes,
 * and provides a secure way to reset sensitive data (e.g., after sign-out).
 *
 * @param {void} — This hook takes no parameters.
 * @returns {{
 *   isLogin: boolean,
 *   formData: { email: string; password: string; confirmPassword: string },
 *   touched: { email: boolean; password: boolean; confirmPassword: boolean },
 *   handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
 *   handleToggleAuth: () => void,
 *   resetForm: () => void
 * }} Object containing form state, metadata, and handlers.
 */

const initialFormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

const initialTouchedState = {
  email: false,
  password: false,
  confirmPassword: false,
};

export const useFormData = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialFormData);

  // state for touched input
  const [touched, setTouched] = useState(initialTouchedState);

  // Update formData while user inputs
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  // Trigger an input with it's unfocused
  const handleBlur = (event) => {
    const { id } = event.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  // Toggle between SignIn and SignUp
  const handleToggleAuth = () => {
    setFormData(initialFormData);
    setTouched(initialTouchedState);
    setIsLogin((prev) => !prev);
  };

  // Reset form to initial state (used after sign out to clear sensitive data)
  const resetForm = () => {
    setFormData(initialFormData);
    setTouched(initialTouchedState);
    setIsLogin(true);
  };

  return {
    isLogin,
    formData,
    touched,
    handleChange,
    handleBlur,
    handleToggleAuth,
    resetForm,
  };
};

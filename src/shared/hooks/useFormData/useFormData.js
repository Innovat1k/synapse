import { useState } from "react";

/**
 * Custom hook for managing form and user inputs data.
 * It ensures switching between SignIn and SignUp form
 * and collects user data while filling inputs.
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

  return {
    isLogin,
    formData,
    touched,
    handleChange,
    handleBlur,
    handleToggleAuth,
  };
};

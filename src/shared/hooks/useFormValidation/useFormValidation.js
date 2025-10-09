import { useMemo } from "react";

/**
 * This custom hook is responsible to check if any inputs get an error while user is inputting.
 * Then if form is correctly filled without any arrors, it enables the submit button.
 */

export const useFormValidation = (formData, isLogin) => {
  const validation = useMemo(() => {
    const errors = {};
    const MIN_LENGTH = 6;

    // 1. Check email
    if (formData.email.trim() === "") {
      errors.email = "Email is required.";
    }

    // 2. Check pasword
    if (formData.password.trim() === "") {
      errors.password = "Password is required.";
    } else if (formData.password.length < MIN_LENGTH) {
      errors.password = `Password must be at least ${MIN_LENGTH} characters long.`;
    }

    // 3. Check confirm password on sign up
    if (!isLogin) {
      if (formData.confirmPassword.trim() === "") {
        errors.confirmPassword = "Confirm password is required.";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword =
          "Confirmation password doesn't match the password.";
      }
    }

    // The form est valid if the 'errors' object is empty
    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
  }, [formData, isLogin]);

  return validation;
};

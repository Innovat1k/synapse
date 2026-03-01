import {
  formDataAtom,
  isLoginAtom,
  resetFormAtom,
  touchedAtom,
} from "@atoms/formDataAtom";
import { useAtom, useSetAtom } from "jotai";

/**
 * Manages authentication form state (sign-in / sign-up) using Jotai atoms
 * to ensure stable initial values during component mounting.
 *
 * Prevents undefined state issues on initial render by initializing form data,
 * touched status, and auth mode via atoms. Provides handlers for:
 * - Input changes and blur events (with touched tracking)
 * - Switching between login and registration modes
 * - Secure reset of sensitive fields (e.g., after sign-out)
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
 * }} Object containing form state and interaction handlers.
 */

export const useFormData = () => {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [touched, setTouched] = useAtom(touchedAtom);
  const resetForm = useSetAtom(resetFormAtom);

  // Update formData while user inputs
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // setTouched((prev) => ({ ...prev, [id]: true }));
  };

  // Trigger an input with it's unfocused
  const handleBlur = (event) => {
    const { id } = event.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
  };

  // Toggle between SignIn and SignUp
  const handleToggleAuth = () => {
    setFormData({ email: "", password: "", confirmPassword: "" });
    setTouched({ email: false, password: false, confirmPassword: false });
    setIsLogin((prev) => !prev);
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

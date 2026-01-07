import { atom } from "jotai";

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

// Local atoms for the authentication form
export const formDataAtom = atom(initialFormData);
export const touchedAtom = atom(initialTouchedState);
export const isLoginAtom = atom(true);

// Atom to reset the form
export const resetFormAtom = atom(null, (get, set) => {
  set(formDataAtom, initialFormData);
  set(touchedAtom, initialTouchedState);
  set(isLoginAtom, true);
});

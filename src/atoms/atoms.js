import { atom } from "jotai";

// Atom for user session : object{} if he is connected
export const session_atom = atom(null);

// Atom for the currently connected user data
export const user_atom = atom(null);

// Atom for toast notifiacation visibility, type and message
export const notification_atom = atom({
  isVisible: false,
  type: "",
  message: "",
});

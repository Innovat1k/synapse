import { useAtom } from "jotai";
import { notification_atom } from "../../../../atoms/atoms";

/**
 * Custom hook for managing notification's visibility.
 */

export const useToast = () => {
  const [notif, setNotif] = useAtom(notification_atom);

  // Open and close toast message
  const closeNotif = () => {
    setNotif((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  return { notif, setNotif, closeNotif };
};

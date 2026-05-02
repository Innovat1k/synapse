import { useAtom } from "jotai";
import { notification_atom } from "@atoms/atoms";

export const useToast = () => {
  const [notif, setNotif] = useAtom(notification_atom);

  // Show a notification with auto-close
  const showNotif = (message, type = "success", duration = 3000) => {
    setNotif({
      isVisible: true,
      message,
      type,
      duration,
    });

    // Self-closing after timeout
    if (duration > 0) {
      setTimeout(() => {
        setNotif((prev) =>
          prev.isVisible ? { ...prev, isVisible: false } : prev,
        );
      }, duration);
    }
  };

  // Close immediately (cancels timeout if necessary)
  const closeNotif = () => {
    setNotif((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    notif,
    setNotif,
    showNotif,
    closeNotif,
  };
};

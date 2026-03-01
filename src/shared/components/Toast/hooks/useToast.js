import { useAtom } from "jotai";
import { notification_atom } from "../../../../atoms/atoms";
// import { notification_atom } from "@/atoms/atoms";

export const useToast = () => {
  const [notif, setNotif] = useAtom(notification_atom);

  // Affiche une notification avec auto-fermeture
  const showNotif = (message, type = "success", duration = 3000) => {
    setNotif({
      isVisible: true,
      message,
      type,
      duration,
    });

    // Auto-fermeture après le délai
    if (duration > 0) {
      setTimeout(() => {
        setNotif((prev) =>
          prev.isVisible ? { ...prev, isVisible: false } : prev,
        );
      }, duration);
    }
  };

  // Ferme immédiatement (annule le timeout si nécessaire)
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

import { useEffect } from "react";

/**
 * Custom hook that triggers a dismissal callback when the Escape key is pressed.
 *
 * Typically used in modals, dialogs, or popovers to support keyboard accessibility.
 *
 * @param {Object} options
 * @param {boolean} options.isOpen - Whether the dismiss listener should be active
 * @param {Function} options.onDismiss - Callback invoked on Escape key press
 */

export const useKeyboardDismiss = ({ isOpen, onDismiss }) => {
  useEffect(() => {
    if (!isOpen) {return;}

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onDismiss]);
};

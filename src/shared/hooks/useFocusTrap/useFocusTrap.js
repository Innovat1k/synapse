import { useEffect } from "react";

/**
 * Traps keyboard focus inside a container (e.g., modal or dialog) when open.
 *
 * Prevents focus from leaving the container by cycling Tab/Shift+Tab between
 * the first and last focusable elements. Only considers visible, enabled,
 * and non-aria-hidden elements.
 *
 * @param {boolean} isOpen - Whether the focus trap should be active
 * @param {React.RefObject} containerRef - Ref to the container element
 */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container) =>
  Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("aria-hidden")
  );

export const useFocusTrap = (isOpen, containerRef) => {
  useEffect(() => {
    if (!isOpen || !containerRef?.current) {return;}

    const container = containerRef.current;

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") {return;}

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {return;}

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, containerRef]);
};

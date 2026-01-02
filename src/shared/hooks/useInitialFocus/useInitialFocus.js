import { useEffect } from "react";

/**
 * Sets initial focus inside a container when it opens.
 *
 * Prioritizes an optional `initialFocusRef`. If none is provided,
 * focuses the first naturally focusable element inside the container.
 *
 * Uses `requestAnimationFrame` to ensure focus is applied after render.
 *
 * @param {boolean} isOpen - Whether the container is open
 * @param {React.RefObject} containerRef - Ref to the container element
 * @param {React.RefObject} [initialFocusRef] - Optional ref to a specific element to focus first
 */

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useInitialFocus = (
  isOpen,
  containerRef,
  initialFocusRef
) => {
  useEffect(() => {
    if (!isOpen || !containerRef?.current) return;

    const rafId = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const firstFocusable =
        containerRef.current.querySelector(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    });

    return () => cancelAnimationFrame(rafId);
  }, [isOpen, containerRef, initialFocusRef]);
};

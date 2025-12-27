import { useEffect } from 'react';

/**
 * Custom hook that traps keyboard focus inside a modal or dialog when open.
 *
 * Ensures:
 * - Initial focus lands on the first focusable element (or the container as fallback)
 * - Tab navigation cycles within the container (focus trap)
 * - Elements are filtered by visibility, disabled state, and `aria-hidden`
 *
 * Complies with WCAG accessibility recommendations for modal dialogs.
 *
 * @param {boolean} isOpen - Whether the trap should be active
 * @param {React.RefObject} containerRef - Ref to the container element (e.g., modal root)
 */

const getFocusableElements = (container) => {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => {
    return (
      !el.hasAttribute('disabled') &&
      !el.getAttribute('aria-hidden') &&
      el.offsetParent !== null
    );
  });
};

export const useFocusTrap = (isOpen, containerRef) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    // Initial focus
    const initialFocusables = getFocusableElements(containerRef.current);
    if (initialFocusables.length > 0) {
      initialFocusables[0].focus();
    } else {
      // Fallback : make the container focusable
      containerRef.current.tabIndex = -1;
      containerRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef]);
};
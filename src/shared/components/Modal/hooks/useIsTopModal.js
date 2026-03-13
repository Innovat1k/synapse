import { useLayoutEffect, useState, useCallback } from "react";

// Determines if the current modal is the topmost one in the DOM stack.
// Used to prevent background interactions when multiple modals are open.

export function useIsTopModal(isOpen, modalRef) {
  const [isTop, setIsTop] = useState(false);

  const checkIsTop = useCallback(() => {
    if (!modalRef?.current) {
      setIsTop(false);
      return;
    }

    const modals = Array.from(document.querySelectorAll('[data-modal="true"]'));
    const lastModal = modals[modals.length - 1];
    setIsTop(lastModal === modalRef.current);
  }, [modalRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setIsTop(false);
      return;
    }

    checkIsTop();

    const observer = new MutationObserver(checkIsTop);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isOpen, checkIsTop]);

  return isTop;
}

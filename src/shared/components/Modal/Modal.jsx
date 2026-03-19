import { createPortal } from "react-dom";
import { useRef } from "react";
import { LuX } from "react-icons/lu";
import { useInitialFocus } from "@shared/hooks/useInitialFocus/useInitialFocus";
import { useFocusTrap } from "@shared/hooks/useFocusTrap/useFocusTrap";
import { useKeyboardDismiss } from "@shared/hooks/useKeyboardDismiss/useKeyboardDismiss";
import { useIsTopModal } from "./hooks/useIsTopModal";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const Modal = ({
  isOpened,
  onClose,
  title,
  description,
  icon: IconComponent,
  children,
  size = "md",
  initialFocusRef,
  dataTestId = "modal",
  showDescriptionInFull = false,
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Accessibility
  const isTopModal = useIsTopModal(isOpened, modalRef);

  useInitialFocus(
    isOpened && isTopModal,
    modalRef,
    initialFocusRef || closeButtonRef,
  );

  useFocusTrap(isOpened && isTopModal, modalRef);

  useKeyboardDismiss({
    isOpen: isOpened && isTopModal,
    onDismiss: onClose,
  });

  if (!isOpened) {
    return null;
  }

  //Full mode detection for space adjustments
  const isFull = size === "full";

  // Size mapping
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[98vw] md:max-w-[96vw]",
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-testid={`${dataTestId}-overlay`}
      />

      {/* Modal Container */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        data-modal="true"
        className={`relative w-full ${sizeClasses[size]} 
          ${isFull ? "h-[96vh] max-h-[96vh]" : "max-h-[90vh]"} 
          bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        data-testid={`${dataTestId}-content`}
      >
        {/*Header -Compacted if Full mode */}
        <div
          className={`flex items-start justify-between border-b border-slate-800/50 bg-slate-900/50 
          ${isFull ? "p-3 md:p-4 px-5" : "p-4 md:p-5"}`}
        >
          <div className="flex gap-3 items-center">
            {IconComponent && (
              <div
                className="shrink-0 p-2 bg-teal-500/10 rounded-lg h-fit"
                data-testid="modal-icon"
              >
                <IconComponent
                  className="text-teal-400"
                  size={isFull ? 16 : 18}
                />
              </div>
            )}
            <div className="min-w-0">
              <h2
                className={`text-slate-100 font-bold leading-tight truncate
                ${isFull ? "text-sm md:text-base" : "text-base md:text-lg"}`}
              >
                {title}
              </h2>
              {/*Hide the description in Full mode to maximize graph space */}
              {description && (!isFull || showDescriptionInFull) && (
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            ref={closeButtonRef}
            aria-label="Close modal"
            onClick={onClose}
            type="button"
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <LuX size={isFull ? 18 : 20} />
          </button>
        </div>

        {/* Body */}
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar 
          ${isFull ? "p-0" : "p-4 md:p-6"}`}
        >
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

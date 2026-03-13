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
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  //Accessibility
  const isTopModal = useIsTopModal(isOpened, modalRef);

  // Focus initial uniquement si ce modal est actif
  useInitialFocus(
    isOpened && isTopModal,
    modalRef,
    initialFocusRef || closeButtonRef,
  );
  useFocusTrap(isOpened && isTopModal, modalRef);

  // useInitialFocus(isOpened, modalRef, closeButtonRef);
  // useFocusTrap(isOpened, modalRef);
  useKeyboardDismiss({ isOpen: isOpened, onDismiss: onClose });

  if (!isOpened) {return null;}

  //Size mapping to keep control
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
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
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        data-testid={`${dataTestId}-content`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 md:p-5 border-b border-slate-800/50 bg-slate-900/50">
          <div className="flex gap-3">
            {IconComponent && (
              <div
                className="shrink-0 p-2 bg-teal-500/10 rounded-lg h-fit"
                data-testid="modal-icon"
              >
                <IconComponent className="text-teal-400" size={18} />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-slate-100 font-bold text-base md:text-lg leading-tight truncate">
                {title}
              </h2>
              {description && (
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
            <LuX size={20} />
          </button>
        </div>

        {/*Body: Scrollable only if necessary */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

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

  // ============= SPACING LOGIC =============
  const isFull = size === "full";

  // Container spacing (outer wrapper around modal)
  const containerSpacing = {
    wrapper: "fixed inset-0 z-[1000] flex items-center justify-center",
    padding: "p-3 sm:p-4 md:p-6",
    margin: "m-2 sm:m-3 md:m-0",
  };

  // Size mapping (modal width responsively)
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] sm:max-w-[90vw] md:max-w-[96vw]",
  };

  // Header spacing
  // LOGIC: Normal mode = more padding (content is smaller)
  //        Full mode = progressive padding (content maximizes space)
  const headerSpacing = {
    normal: "p-6",
    full: "p-4 sm:p-5 md:p-6",
    icon: isFull ? 16 : 18,
  };

  // Body spacing
  // LOGIC: Normal mode = content needs padding (modal is smaller)
  //        Full mode = minimal padding (maximize graph/content area)
  const bodySpacing = {
    normal: "p-6 pt-2",
    full: "p-3 sm:p-4 md:p-6 pt-2",
  };

  // Height constraints (responsive)
  const heightClasses = isFull
    ? "h-[90vh] sm:h-[92vh] md:h-[94vh] max-h-[94vh]"
    : "max-h-[90vh]";

  return createPortal(
    <div
      className={`${containerSpacing.wrapper} ${containerSpacing.padding} ${containerSpacing.margin}`}
    >
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
        className={`relative w-full ${sizeClasses[size]} ${heightClasses}
          bg-slate-900 border border-slate-800/50 rounded-xl shadow-2xl 
          flex flex-col overflow-hidden`}
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        data-testid={`${dataTestId}-content`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between border-b border-slate-800/50 bg-slate-900/40 
          shrink-0 gap-4 ${isFull ? headerSpacing.full : headerSpacing.normal}`}
        >
          <div className="flex gap-3 items-center min-w-0 flex-1">
            {/* Icon */}
            {IconComponent && (
              <div
                className="shrink-0 p-2.5 bg-cyan-500/10 rounded-lg h-fit ring-1 ring-cyan-500/20"
                data-testid="modal-icon"
              >
                <IconComponent
                  className="text-cyan-400"
                  size={headerSpacing.icon}
                />
              </div>
            )}

            {/* Title + Description */}
            <div className="min-w-0 flex-1">
              <h2
                className={`text-slate-100 font-bold tracking-tight leading-tight truncate
                ${isFull ? "text-base sm:text-lg md:text-xl" : "text-lg md:text-xl"}`}
              >
                {title}
              </h2>
              {description && (!isFull || showDescriptionInFull) && (
                <p className="text-slate-500 text-xs sm:text-xs md:text-sm mt-1 leading-relaxed truncate">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            ref={closeButtonRef}
            aria-label="Close modal"
            onClick={onClose}
            type="button"
            className="shrink-0 p-2 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 
            transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <LuX size={isFull ? 18 : 20} />
          </button>
        </div>

        {/* Body - Content area (flex-1 to fill remaining space) */}
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar 
          ${isFull ? bodySpacing.full : bodySpacing.normal}`}
        >
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

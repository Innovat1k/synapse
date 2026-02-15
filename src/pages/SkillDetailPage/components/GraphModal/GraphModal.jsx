import { createPortal } from "react-dom";
import { useRef } from "react";
import { LuX, LuBrainCircuit } from "react-icons/lu";
import { useInitialFocus } from "../../../../shared/hooks/useInitialFocus/useInitialFocus";
import { useFocusTrap } from "../../../../shared/hooks/useFocusTrap/useFocusTrap";
import { useKeyboardDismiss } from "../../../../shared/hooks/useKeyboardDismiss/useKeyboardDismiss";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const GraphModal = ({ isOpened, onClose, skillName, children }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Accessibility
  useInitialFocus(isOpened, modalRef, closeButtonRef);
  useFocusTrap(isOpened, modalRef);
  useKeyboardDismiss({ isOpen: isOpened, onDismiss: onClose });

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
        data-testid="modal-overlay"
      />

      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="knowledge-graph-title"
        className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-800/50 rounded-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <LuBrainCircuit className="text-teal-400" size={20} />
            </div>
            <div>
              <h2
                id="knowledge-graph-title"
                className="text-slate-100 font-bold text-lg"
              >
                Knowledge Graph
              </h2>
              <p
                className="text-slate-400 text-sm"
                data-testid="center-skill-description"
              >
                Connections around{" "}
                <span className="text-slate-200">{skillName}</span>
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close knowledge graph"
          >
            <LuX size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="w-full h-[calc(100%-72px)] overflow-hidden">
          {children}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

import { LuX } from "react-icons/lu";
import { useKeyboardDismiss } from "../../../../shared/hooks/useKeyboardDismiss/useKeyboardDismiss";
import { useFocusTrap } from "../../../../shared/hooks/useFocusTrap/useFocusTrap";
import { useInitialFocus } from "../../../../shared/hooks/useInitialFocus/useInitialFocus";
import { useRef } from "react";
import ButtonSpinner from "../../../../shared/components/ButtonSpinner";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function PurgeActivitiesModal({
  // Modal state
  isOpened = false,
  context,

  // Data
  skill = {},
  activityCount,

  // Actions
  closeModal,
  openFinalVerification,
  handlePurge,

  // Form
  skillValue,
  changeValue,
  hasError,
  isSubmitting,
}) {
  // Accessibility
  // Close the modal by ESCAPE key
  useKeyboardDismiss({ isOpen: isOpened, onDismiss: closeModal });

  // Modals ref
  const confirmStepRef = useRef(null);
  const verificationStepRef = useRef(null);

  // Ref for initial focused element
  const inputRef = useRef(null);

  const targetModalRef =
    context === "confirm-step" ? confirmStepRef : verificationStepRef;

  // Set initial focus
  useInitialFocus(isOpened, targetModalRef, inputRef);

  // Trap key focus on the modal
  useFocusTrap(isOpened, targetModalRef);

  return (
    <AnimatePresence>
      motion
      {isOpened && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-testid="purge-modal-overlay"
          onClick={closeModal}
        >
          {context === "confirm-step" ? (
            <motion.div
              className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-red-500/40 p-5 sm:p-6 max-w-md w-full mx-4 shadow-lg"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              ref={confirmStepRef}
              key="confirm-step"
              tabIndex={-1}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-red-500/5 to-transparent pointer-events-none opacity-40"></div>

              <div className="flex items-start justify-between gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  Irreversible Purge Confirmation
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-200 flex-shrink-0 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <LuX size={20} />
                </button>
              </div>

              <p className="text-slate-300 mb-6 text-sm sm:text-base">
                You are about to delete{" "}
                <strong>
                  {activityCount}{" "}
                  {activityCount > 1 ? "activities" : "activity"}
                </strong>{" "}
                linked to the skill <strong>"{skill?.name}"</strong>.
              </p>

              <div className="mb-6 p-3 bg-red-900/30 border border-red-500/40 rounded-lg">
                <p className="text-sm text-red-400">
                  <strong>Attention:</strong> This action is permanent and
                  cannot be undone. All statistics and tracking data for this
                  skill will be reset.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={openFinalVerification}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)] cursor-pointer"
                >
                  Continue to Purge
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-red-500/40 p-5 sm:p-6 max-w-lg w-full mx-4 shadow-lg"
              initial={{ scale: 0.95, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              ref={verificationStepRef}
              key="verification-step"
              tabIndex={-1}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-red-500/5 to-transparent pointer-events-none opacity-40"></div>

              <div className="flex items-start justify-between gap-2 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
                  Confirm Skill Name
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-200 flex-shrink-0 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <LuX size={20} />
                </button>
              </div>

              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                To confirm deletion of{" "}
                <strong>
                  {activityCount}{" "}
                  {activityCount > 1 ? "activities" : "activity"}
                </strong>{" "}
                linked to <strong>"{skill?.name}"</strong>, please type the
                exact name of the skill below:
              </p>

              <form onSubmit={handlePurge} className="contents.">
                <input
                  type="text"
                  value={skillValue}
                  onChange={changeValue}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition"
                  placeholder={`Type '${skill?.name}'`}
                  disabled={isSubmitting}
                  aria-label="Enter skill name"
                  ref={inputRef}
                />

                <AnimatePresence>
                  {hasError && (
                    <motion.p
                      className="flex items-center text-sm text-red-500 mt-1 space-x-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {skillValue.length === 0
                        ? "Please enter the skill name."
                        : "The skill name does not match. Please try again."}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
        flex-1 px-4 py-2.5 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)]
        ${
          skillValue === skill?.name
            ? "bg-red-600 hover:bg-red-700 cursor-pointer"
            : "bg-red-600/50 cursor-not-allowed"
        }
      `}
                  >
                    {isSubmitting ? (
                      <ButtonSpinner label="Purging Activities" />
                    ) : (
                      <span className="whitespace-normal text-center uppercase tracking-wide">
                        Purge Permanently
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PurgeActivitiesModal;

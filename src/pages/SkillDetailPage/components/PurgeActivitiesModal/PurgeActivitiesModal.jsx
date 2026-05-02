import { useRef } from "react";
import { Modal } from "@shared/components/Modal/Modal";
import ButtonSpinner from "@shared/components/ButtonSpinner";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function PurgeActivitiesModal({
  isOpened = false,
  context,

  skill = {},
  activityCount,

  closeModal,
  openFinalVerification,
  handlePurge,

  skillValue,
  changeValue,
  hasError,
  isSubmitting,
}) {
  const inputRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpened && (
        <Modal
          isOpened={isOpened}
          onClose={closeModal}
          title={
            context === "confirm-step"
              ? "Irreversible Purge Confirmation"
              : "Confirm Skill Name"
          }
          size={context === "confirm-step" ? "sm" : "md"}
          initialFocusRef={context === "verification-step" ? inputRef : null}
          dataTestId="purge-modal"
        >
          {context === "confirm-step" ? (
            <>
              <p className="text-slate-300 mb-6 text-base">
                You are about to delete{" "}
                <strong>
                  {activityCount}{" "}
                  {activityCount > 1 ? "activities" : "activity"}
                </strong>{" "}
                linked to the skill <strong>"{skill?.name}"</strong>.
              </p>

              <div className="mb-6 p-4 bg-rose-900/30 border border-rose-500/40 rounded-lg">
                <p className="text-sm text-rose-400">
                  <strong>Attention:</strong> This action is permanent and
                  cannot be undone. All statistics and tracking data will be
                  reset.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={openFinalVerification}
                  className="flex-1 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors duration-200 font-bold cursor-pointer"
                >
                  Continue to Purge
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handlePurge}>
              <p className="text-slate-300 mb-6 text-base">
                To confirm deletion of{" "}
                <strong>
                  {activityCount}{" "}
                  {activityCount > 1 ? "activities" : "activity"}
                </strong>{" "}
                linked to <strong>"{skill?.name}"</strong>, type the exact name:
              </p>

              <input
                ref={inputRef}
                type="text"
                value={skillValue}
                onChange={changeValue}
                disabled={isSubmitting}
                placeholder={`Type '${skill?.name}'`}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-transparent transition-all"
              />

              <AnimatePresence>
                {hasError && (
                  <motion.p
                    className="text-xs text-rose-500 mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {skillValue.length === 0
                      ? "Please enter the skill name."
                      : "The skill name does not match."}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors duration-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-2.5 text-white rounded-lg transition-all duration-200 font-bold ${
                    skillValue === skill?.name
                      ? "bg-rose-600 hover:bg-rose-700 cursor-pointer active:scale-95"
                      : "bg-rose-600/50 cursor-not-allowed opacity-60"
                  }`}
                >
                  {isSubmitting ? (
                    <ButtonSpinner label="Purging Activities" />
                  ) : (
                    "Purge Permanently"
                  )}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default PurgeActivitiesModal;

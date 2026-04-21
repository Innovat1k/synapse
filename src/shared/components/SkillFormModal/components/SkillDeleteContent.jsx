import { LuX } from "react-icons/lu";
import ButtonSpinner from "../../ButtonSpinner";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Sub-component: Delete Confirmation Content
const SkillDeleteContent = ({
  initialData,
  isSubmitting,
  onDelete,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative p-5 sm:p-6"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-transparent via-red-500/5 to-transparent pointer-events-none opacity-40" />

      <div className="flex items-start justify-between gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 truncate">
          Confirm Deletion
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 shrink-0 transition-colors"
          aria-label="Close modal"
        >
          <LuX size={20} />
        </button>
      </div>

      <p className="text-slate-300 mb-6 text-sm sm:text-base">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-100 capitalize wrap-break-word">
          "{initialData.name}"
        </span>
        ?
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {isSubmitting ? (
          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/80 text-white rounded-lg text-sm sm:text-base w-full sm:flex-1 cursor-not-allowed"
          >
            <ButtonSpinner
              color="border-white"
              label="Deleting skill..."
              labelColor="text-white"
              inline={true}
            />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors text-sm sm:text-base"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={() => onDelete(initialData)}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            >
              Delete permanently
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SkillDeleteContent;

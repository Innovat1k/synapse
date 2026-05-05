import { LuX } from "react-icons/lu";
import ButtonSpinner from "../../ButtonSpinner";
import { useIsOnline } from "@shared/components/utils/NetworkStatus/hooks/useNetworkStatus";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Sub-component: Delete Confirmation Content
const SkillDeleteContent = ({
  initialData,
  isSubmitting,
  onDelete,
  onClose,
}) => {
  const isOnline = useIsOnline();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative p-2"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-transparent via-rose-500/5 to-transparent pointer-events-none opacity-40" />

      <div className="relative z-10 space-y-6">
        <p className="text-slate-300 text-sm leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-100 capitalize wrap-break-word">
            "{initialData.name}"
          </span>
          ?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/50">
          {isSubmitting ? (
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600/60 text-white rounded-lg text-sm w-full sm:flex-1 cursor-not-allowed"
            >
              <ButtonSpinner
                color="border-white"
                label="Deleting..."
                labelColor="text-white"
                inline={true}
              />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-200 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer order-2 md:order-1"
              >
                Keep it
              </button>
              <button
                disabled={!isOnline}
                type="button"
                onClick={() => onDelete(initialData)}
                className="flex-1 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all duration-200 text-sm font-bold shadow-lg shadow-rose-500/20 cursor-pointer active:scale-95 order-1 md:order-2"
              >
                Delete permanently
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillDeleteContent;

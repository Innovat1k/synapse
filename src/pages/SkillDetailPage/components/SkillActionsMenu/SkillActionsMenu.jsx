import { AnimatePresence, motion } from "framer-motion";
import { LuEllipsis, LuPencil, LuTrash2, LuX } from "react-icons/lu";

function SkillActionsMenu({
  actionsMenu,
  openPurgeModal,
  skill,
  activityCount,
  methods,
}) {
  return (
    <div className="relative">
      {!actionsMenu.isOpened && (
        <button
          type="button"
          aria-label="Open skill actions"
          className="p-2 rounded-full border border-slate-700/60 hover:border-teal-400/60 hover:text-teal-400 text-slate-400 transition-colors cursor-pointer"
          onClick={actionsMenu.handleToggle}
        >
          <LuEllipsis size={20} aria-hidden="true" />
        </button>
      )}
      <AnimatePresence>
        {actionsMenu.isOpened && (
          <motion.div
            className="absolute right-0 mt-2 w-48 z-10 bg-slate-900/80 backdrop-blur-lg border border-slate-800/50 rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b border-slate-800/50 flex justify-end">
              <button
                type="button"
                aria-label="Close actions menu"
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                onClick={actionsMenu.handleToggle}
              >
                <LuX size={18} />
              </button>
            </div>

            <div className="py-2">
              {/* Principal Skill Actions (Edit - Delete) */}
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800/50 hover:text-teal-400 transition-colors rounded-lg cursor-pointer"
                onClick={() => {
                  methods.openEditModal(skill);
                  actionsMenu.handleToggle();
                }}
              >
                <LuPencil size={18} aria-hidden="true" />
                <span>Edit skill</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800/50 hover:text-red-400 transition-colors rounded-lg cursor-pointer"
                onClick={() => {
                  methods.openDeleteModal(skill);
                  actionsMenu.handleToggle();
                }}
              >
                <LuTrash2 size={18} aria-hidden="true" />
                <span>Delete skill</span>
              </button>

              {/* Separator */}
              <div className="border-t border-slate-800/50 my-2"></div>

              {/* Destructive Action (Purge) */}
              <button
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800/50 transition-colors rounded-lg ${
                  activityCount === 0
                    ? "opacity-50 cursor-not-allowed text-slate-500"
                    : "hover:text-red-400 cursor-pointer"
                }`}
                onClick={() => {
                  openPurgeModal();
                  actionsMenu.handleToggle();
                }}
                disabled={activityCount === 0}
                type="button"
              >
                <LuTrash2 size={18} aria-hidden="true" />
                <span className="uppercase text-xs sm:text-sm">
                  Purge Activities
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SkillActionsMenu;

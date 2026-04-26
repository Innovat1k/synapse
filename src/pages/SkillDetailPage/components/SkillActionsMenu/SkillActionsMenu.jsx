import {
  LuBrainCircuit,
  LuEllipsis,
  LuPencil,
  LuTrash2,
  LuX,
} from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function SkillActionsMenu({
  actionsMenu,
  openPurgeModal,
  skill,
  activityCount,
  methods,
  openGraphModal,
}) {
  return (
    <div className="relative">
      {!actionsMenu.isOpened && (
        <button
          type="button"
          aria-label="Open skill actions"
          className="p-2.5 rounded-lg border active:scale-95 border-slate-800/50 bg-[#1a2332]/50 hover:border-cyan-500/40 hover:text-cyan-400 text-slate-400 transition-all duration-200 cursor-pointer"
          onClick={actionsMenu.handleToggle}
        >
          <LuEllipsis size={20} aria-hidden="true" />
        </button>
      )}

      <AnimatePresence>
        {actionsMenu.isOpened && (
          <>
            {/* Overlay for closing on outside click */}
            <div
              className="fixed inset-0 z-10"
              onClick={actionsMenu.handleToggle}
            />

            <motion.div
              className="absolute right-0 mt-2 w-56 z-20 bg-[#161b2c]/95 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-2xl overflow-hidden shadow-cyan-950/20"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="px-4 py-3 border-b border-slate-800/50 flex justify-between items-center bg-slate-800/20">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Actions
                </span>
                <button
                  type="button"
                  aria-label="Close actions menu"
                  className="p-1 rounded-md text-slate-500 active:scale-95 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={actionsMenu.handleToggle}
                >
                  <LuX size={16} />
                </button>
              </div>

              <div className="p-1.5">
                {/* Main Actions */}
                <button
                  type="button"
                  onClick={() => {
                    openGraphModal();
                    actionsMenu.handleToggle();
                  }}
                  className="w-full md:hidden flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-200 rounded-lg cursor-pointer group"
                >
                  <LuBrainCircuit
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">View graph</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-slate-100 transition-all duration-200 rounded-lg cursor-pointer group"
                  onClick={() => {
                    methods.openEditModal(skill);
                    actionsMenu.handleToggle();
                  }}
                >
                  <LuPencil
                    size={18}
                    className="text-slate-500 group-hover:text-cyan-400"
                  />
                  <span className="font-medium">Edit skill</span>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 rounded-lg cursor-pointer group"
                  onClick={() => {
                    methods.openDeleteModal(skill);
                    actionsMenu.handleToggle();
                  }}
                >
                  <LuTrash2
                    size={18}
                    className="text-slate-500 group-hover:text-rose-400"
                  />
                  <span className="font-medium">Delete skill</span>
                </button>

                {/* Separator */}
                <div className="border-t border-slate-800/40 my-1.5 mx-2" />

                {/* Purge Activities */}
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                    activityCount === 0
                      ? "opacity-40 cursor-not-allowed text-slate-500"
                      : "text-rose-500 hover:bg-rose-500/10 cursor-pointer font-bold"
                  }`}
                  onClick={() => {
                    if (activityCount > 0) {
                      openPurgeModal();
                      actionsMenu.handleToggle();
                    }
                  }}
                  disabled={activityCount === 0}
                  type="button"
                >
                  <LuTrash2 size={18} />
                  <span className="uppercase text-xs tracking-widest">
                    Purge Activities ({activityCount})
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SkillActionsMenu;

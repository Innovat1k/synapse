import { useRef } from "react";
import { createPortal } from "react-dom";
import {
  LuX,
  LuCornerLeftUp,
  LuCornerRightUp,
  LuSearch,
  LuCircleHelp,
} from "react-icons/lu";
import { useKeyboardDismiss } from "@shared/hooks/useKeyboardDismiss/useKeyboardDismiss";
import { useInitialFocus } from "@shared/hooks/useInitialFocus/useInitialFocus";
import { useFocusTrap } from "@shared/hooks/useFocusTrap/useFocusTrap";
import { useSkillLinkerForm } from "./hooks/useSkillLinkerForm";
import ButtonSpinner from "@shared/components/ButtonSpinner";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

export const SkillLinkerModal = ({
  isOpened,
  onClose,
  mode,
  currentSkillId,
  existingIncomingLinks = [],
  existingOutgoingLinks = [],
  currentSkillName = "this skill",
}) => {
  const { skills, searchTerm, selectedSkill, link, loader, error, methods } =
    useSkillLinkerForm({
      currentSkillId,
      mode,
      existingIncomingLinks,
      existingOutgoingLinks,
    });

  const closeModal = () => {
    methods.clearForm();
    onClose();
  };

  // Trap focus to the modal contents
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);

  useInitialFocus(isOpened, modalRef, searchInputRef);
  useFocusTrap(isOpened, modalRef);

  // Keyboard dismiss
  useKeyboardDismiss({
    isOpen: isOpened,
    onDismiss: closeModal,
  });

  //
  const isPrerequisiteMode = mode === "incoming";
  const isBlocked = link.hasDirectLink || loader.isChecking;

  const handleSubmit = () => {
    methods.handleCreateLink({ onClose });
  };

  // Dynamic title
  const getTitle = () => {
    if (isPrerequisiteMode) {
      return `Add a prerequisite for ${currentSkillName}`;
    }
    return `Add a skill unlocked by ${currentSkillName}`;
  };

  return createPortal(
    <AnimatePresence>
      {isOpened && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-testid="modal-overlay"
        >
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/70 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            ref={modalRef}
            className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800/50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-100">
                  {getTitle()}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <LuX size={18} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="relative mb-4">
                <label htmlFor="skill-search" className="sr-only">
                  Search skills
                </label>
                <LuSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  id="skill-search"
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={methods.handleChange}
                  placeholder="Search skills..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {skills.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">
                    No skills found.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <button
                      key={skill.skill_id}
                      type="button"
                      aria-selected={selectedSkill?.id === skill.skill_id}
                      onClick={() => methods.handleSelectSkill(skill)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center cursor-pointer ${
                        selectedSkill?.id === skill.skill_id
                          ? "bg-slate-700/60 border border-slate-600/60"
                          : "bg-slate-800/20 hover:bg-slate-800/40"
                      }`}
                    >
                      <div>
                        <span className="text-slate-200">{skill.name}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          Level {skill.level}
                        </span>
                      </div>

                      {selectedSkill?.id === skill.skill_id && (
                        <>
                          {link.linkType === "prerequisite" ? (
                            <LuCornerLeftUp className="w-4 h-4 text-amber-400" />
                          ) : (
                            <LuCornerRightUp className="w-4 h-4 text-cyan-400" />
                          )}
                        </>
                      )}
                    </button>
                  ))
                )}
              </div>

              {selectedSkill && (
                <div className="mt-5 pt-4 border-t border-slate-800/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">
                    Connection type
                  </h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        methods.handleChangeLinkType("prerequisite")
                      }
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        link.linkType === "prerequisite"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <LuCornerLeftUp size={14} className="inline mr-1" />
                      Prerequisite
                    </button>
                    <button
                      type="button"
                      onClick={() => methods.handleChangeLinkType("support")}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        link.linkType === "support"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <LuCornerRightUp size={14} className="inline mr-1" />
                      Support
                    </button>
                  </div>
                  <div className="flex items-center text-slate-500 mt-2 gap-2">
                    <LuCircleHelp size={14} />
                    <p className="text-sm">
                      {link.linkType === "prerequisite"
                        ? "Essential foundation required before this skill."
                        : "Helpful but optional to master this skill."}
                    </p>
                  </div>
                </div>
              )}

              {link.hasDirectLink && (
                <motion.div
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex gap-2.5">
                    <LuX className="mt-0.5 text-red-400" size={16} />
                    <p className="text-sm text-red-300">
                      This connection already exists between these two skills.
                      Select another skill.
                    </p>
                  </div>
                </motion.div>
              )}

              {error && !link.hasDirectLink && (
                <motion.div
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex gap-2.5">
                    <LuX className="mt-0.5 text-red-400" size={16} />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}

              {link.hasReverseLink && !link.hasDirectLink && (
                <motion.div
                  className="mt-6 p-4 bg-cyan-500/5 border border-teal-500/20 rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg h-fit">
                      <LuCircleHelp className="text-teal-400" size={20} />
                    </div>
                    <div>
                      <h4 className="text-teal-100 font-semibold text-sm">
                        Synergy Detected
                      </h4>
                      <p
                        className="text-slate-400 text-sm mt-1 leading-relaxed"
                        data-testid="skills-synergy"
                      >
                        <strong className="text-slate-100">
                          {selectedSkill?.name}
                        </strong>{" "}
                        and{" "}
                        <strong className="text-slate-100">
                          {currentSkillName}
                        </strong>{" "}
                        form a reinforcing loop. They are best learned together.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all rounded-lg text-sm font-medium cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer"
                    >
                      {loader.isCreating ? (
                        <ButtonSpinner label="Syncing..." />
                      ) : (
                        "Confirm Synergy"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {!link.hasReverseLink && (
              <div className="p-5 border-t border-slate-800/50 flex flex-col md:flex-row md:justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer order-2 md:order-1"
                  type="button"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={!selectedSkill || isBlocked}
                  className={`px-4 py-2.5 text-white rounded-lg transition-colors text-sm cursor-pointer order-1 md:order-2 disabled:bg-slate-800/30 disabled:cursor-not-allowed border disabled:border-slate-700/20 disabled:text-slate-500
                     ${
                       link.linkType === "prerequisite"
                         ? "bg-amber-600 hover:bg-amber-700 border border-amber-500/40 disabled:bg-slate-800/30 disabled:text-slate-500"
                         : "bg-cyan-600 hover:bg-cyan-700 border border-cyan-500/40 disabled:bg-slate-800/30 disabled:text-slate-500"
                     }`}
                >
                  {loader.isChecking ? (
                    <ButtonSpinner
                      label="Checking for conflicts…"
                      labelColor="text-slate-500"
                      color="text-slate-500"
                    />
                  ) : loader.isCreating ? (
                    <ButtonSpinner
                      label={`Creating ${link.linkType} link...`}
                    />
                  ) : (
                    `Link as ${selectedSkill ? link.linkType : "..."}`
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

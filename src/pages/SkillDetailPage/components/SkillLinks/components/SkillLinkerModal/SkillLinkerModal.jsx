import { useRef } from "react";
import {
  LuCornerLeftUp,
  LuCornerRightUp,
  LuSearch,
  LuCircleHelp,
  LuX,
} from "react-icons/lu";
import { Modal } from "@shared/components/ui/Modal/Modal";
import { useSkillLinkerForm } from "./hooks/useSkillLinkerForm";
import ButtonSpinner from "@shared/components/ui/ButtonSpinner";

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

  const searchInputRef = useRef(null);

  const closeModal = () => {
    methods.clearForm();
    onClose();
  };

  const isPrerequisiteMode = mode === "incoming";
  const isBlocked = link.hasDirectLink || loader.isChecking;

  const handleSubmit = () => {
    methods.handleCreateLink({ onClose: closeModal });
  };

  const getTitle = () => {
    if (isPrerequisiteMode) {
      return `Add a prerequisite for ${currentSkillName}`;
    }
    return `Add a skill unlocked by ${currentSkillName}`;
  };

  return (
    <AnimatePresence>
      {isOpened && (
        <Modal
          isOpened={isOpened}
          onClose={closeModal}
          title={getTitle()}
          size="md"
          initialFocusRef={searchInputRef}
          dataTestId="skill-linker-modal"
        >
          {/* Main Container with Standard Spacing */}
          <div className="p-2">
            {/* Search Input Section */}
            <div className="relative mb-6">
              <label
                htmlFor="skill-search"
                className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
              >
                Search skills
              </label>
              <div className="relative">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Skills List */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {skills.length === 0 ? (
                <p className="text-slate-500 text-sm italic py-4">
                  No skills found.
                </p>
              ) : (
                skills.map((skill) => (
                  <button
                    key={skill.skill_id}
                    type="button"
                    aria-selected={selectedSkill?.id === skill.skill_id}
                    onClick={() => methods.handleSelectSkill(skill)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex justify-between items-center cursor-pointer border ${
                      selectedSkill?.id === skill.skill_id
                        ? "bg-cyan-500/10 border-cyan-500/40"
                        : "bg-slate-800/20 border-transparent hover:bg-slate-800/40 hover:border-slate-700/30"
                    }`}
                  >
                    <div>
                      <span
                        className={`font-medium ${selectedSkill?.id === skill.skill_id ? "text-cyan-400" : "text-slate-200"}`}
                      >
                        {skill.name}
                      </span>
                      <span className="text-xs font-bold uppercase text-slate-500 ml-3 tracking-wide">
                        Level {skill.level}
                      </span>
                    </div>

                    {selectedSkill?.id === skill.skill_id && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        {link.linkType === "prerequisite" ? (
                          <LuCornerLeftUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <LuCornerRightUp className="w-4 h-4 text-cyan-400" />
                        )}
                      </motion.div>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Connection Type Selection */}
            {selectedSkill && (
              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
                  Connection type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => methods.handleChangeLinkType("prerequisite")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer border active:scale-95 ${
                      link.linkType === "prerequisite"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10"
                        : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <LuCornerLeftUp size={14} className="inline mr-2 mb-0.5" />
                    Prerequisite
                  </button>
                  <button
                    type="button"
                    onClick={() => methods.handleChangeLinkType("support")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer border active:scale-95 ${
                      link.linkType === "support"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-300"
                    }`}
                  >
                    <LuCornerRightUp size={14} className="inline mr-2 mb-0.5" />
                    Support
                  </button>
                </div>
                <div className="flex items-start text-slate-500 mt-4 gap-2 px-1">
                  <LuCircleHelp size={14} className="mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed">
                    {link.linkType === "prerequisite"
                      ? "Essential foundation required before this skill."
                      : "Helpful but optional to master this skill."}
                  </p>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {(link.hasDirectLink || error) && (
              <motion.div
                className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex gap-3">
                  <LuX className="mt-0.5 text-rose-400" size={16} />
                  <p className="text-sm text-rose-300">
                    {link.hasDirectLink
                      ? "This connection already exists between these two skills. Select another skill."
                      : error}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          {!link.hasReverseLink && (
            <div className="p-2 border-t border-slate-800/50 flex flex-col md:flex-row md:justify-end gap-3 bg-slate-900/20">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-100 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-all duration-200 cursor-pointer order-2 md:order-1 active:scale-95"
                type="button"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                type="button"
                disabled={!selectedSkill || isBlocked}
                className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer order-1 md:order-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg ${
                  link.linkType === "prerequisite"
                    ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/20"
                    : "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                }`}
              >
                {loader.isChecking ? (
                  <ButtonSpinner
                    label="Checking for conflicts..."
                    color="text-white"
                  />
                ) : loader.isCreating ? (
                  <ButtonSpinner label="Linking..." />
                ) : (
                  `Link as ${selectedSkill ? link.linkType : "..."}`
                )}
              </button>
            </div>
          )}

          {/* Synergy Special Block */}
          {link.hasReverseLink && !link.hasDirectLink && (
            <div className="p-6 border-t border-slate-800/50 bg-slate-900/40">
              <motion.div
                className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex gap-4">
                  <div className="p-2 bg-cyan-500/10 rounded-lg h-fit">
                    <LuCircleHelp className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide">
                      Synergy Detected
                    </h4>
                    <p
                      className="text-slate-400 text-sm mt-2 leading-relaxed"
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

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    {loader.isCreating ? (
                      <ButtonSpinner label="Syncing..." />
                    ) : (
                      "Confirm Synergy"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </Modal>
      )}
    </AnimatePresence>
  );
};

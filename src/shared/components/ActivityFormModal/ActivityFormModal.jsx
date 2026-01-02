import { AnimatePresence, motion } from "framer-motion";
import { LuX, LuClock, LuTriangleAlert, LuCircleAlert } from "react-icons/lu";
import { useActivityForm } from "./hooks/useActivityForm";
import ButtonSpinner from "../ButtonSpinner";
import DeleteModal from "../DeleteModal/DeleteModal";
import DatetimeInput from "./components/DatetimeInput/DatetimeInput";
import SelectInput from "./components/SelectInput";
import { useKeyboardDismiss } from "../../hooks/useKeyboardDismiss/useKeyboardDismiss";
import { useFocusTrap } from "../../hooks/useFocusTrap/useFocusTrap";
import { useRef } from "react";
import { useInitialFocus } from "../../hooks/useInitialFocus/useInitialFocus";

function ActivityFormModal({
  mode = "create",
  isOpened = false,
  selectedActivity,
  skill,
  allSkills = [],
  closeModal,
  closeByOverlay,
  onSubmit,
  onDelete,
  isSubmitting,
  openSkillModal,
}) {
  const ACTIVITIES_TYPE = [
    "learning",
    "practice",
    "project work",
    "research",
    "teaching/mentoring",
    "administration/setup",
    "other",
  ];

  const { activityData, durationData, methods, isFormValid, errors } =
    useActivityForm({
      mode: mode,
      initialData: selectedActivity,
      onSubmit: onSubmit,
      skills: allSkills,
      id: skill?.skill_id,
      isOpened: isOpened,
    });

  const createFirstSkill = () => {
    closeModal();
    openSkillModal();
  };

  const isBlocked = allSkills.length === 0;

  // Determine if the context is skill
  const isSkillContext = !!skill;

  // Keyboard dismiss
  useKeyboardDismiss({ isOpen: isOpened, onDismiss: closeModal });

  // Trap focus
  // Trap focus to the modal contents
  const modalRef = useRef(null);
  const dateInputRef = useRef(null);

  useInitialFocus(isOpened, modalRef, dateInputRef);
  useFocusTrap(isOpened, modalRef);

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-testid="modal-overlay"
          onClick={closeByOverlay}
        >
          {mode == "delete" ? (
            <DeleteModal
              ref={modalRef}
              entity="activity"
              initialData={selectedActivity}
              isSubmitting={isSubmitting}
              confirmDelete={onDelete}
              closeModal={closeModal}
            />
          ) : (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              ref={modalRef}
              className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-teal-400/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg     [scrollbar-gutter:stable]  /* ← cette ligne */"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-teal-400/5 to-transparent pointer-events-none opacity-40"></div>

              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <LuClock size={20} className="text-teal-400" />
                  <h2
                    className="text-xl font-bold text-slate-100"
                    id="modal-title"
                  >
                    {mode === "create" ? "Log Activity" : "Edit Activity"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <LuX size={20} />
                </button>
              </div>

              {isBlocked ? (
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <LuTriangleAlert className="text-amber-400 w-8 h-8 animate-pulse" />
                  </div>
                  <p className="text-xl text-slate-100 mb-4 animate-pulse">
                    Cannot log activity
                  </p>
                  <p className="text-slate-400 mb-6">
                    You must have at least one skill to record an activity.
                  </p>
                  <button
                    type="button"
                    onClick={createFirstSkill}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-colors cursor-pointer"
                  >
                    Create my first skill
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={methods.handleSubmit}
                  className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-5">
                    {/* Skill */}
                    <div>
                      {isSkillContext ? (
                        <div>
                          <div
                            id="skill-label"
                            className="block text-sm font-medium text-slate-400 mb-1.5"
                          >
                            Skill
                          </div>
                          <div
                            aria-labelledby="skill-label"
                            aria-readonly="true"
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 opacity-70"
                          >
                            {skill.name}
                          </div>
                        </div>
                      ) : (
                        <SelectInput
                          label="Skill"
                          value={activityData?.skill_id || ""}
                          key={activityData?.skill_id}
                          id="skill_id"
                          onChange={(value) =>
                            methods.handleChange({
                              target: { id: "skill_id", value },
                            })
                          }
                          options={allSkills.map((s) => ({
                            value: s.skill_id,
                            label: s.name,
                          }))}
                          placeholder="Select a skill..."
                          disabled={isSubmitting}
                        />
                      )}

                      <AnimatePresence>
                        {errors.skill && (
                          <motion.p
                            className="flex items-center text-sm text-red-500 mt-1 space-x-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {errors.skill}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <DatetimeInput
                      id="logged_at"
                      value={activityData.logged_at}
                      onChange={(isoString) => {
                        methods.handleChange({
                          target: { id: "logged_at", value: isoString },
                        });
                      }}
                      ref={dateInputRef}
                      disabled={isSubmitting}
                    />

                    {/* Duration */}
                    <div>
                      <label
                        className="block text-sm font-medium text-slate-400 mb-1.5"
                        htmlFor="duration"
                      >
                        Duration
                      </label>

                      <div className="flex gap-2 items-center">
                        <label htmlFor="hours" className="sr-only">
                          Hours
                        </label>
                        <input
                          type="number"
                          id="hours"
                          placeholder="0"
                          min="0"
                          max="24"
                          value={durationData.hours}
                          onChange={methods.handleChangeDuration}
                          className="w-16 px-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                        />
                        <span className="text-slate-400">h</span>

                        <label htmlFor="minutes" className="sr-only">
                          Minutes
                        </label>
                        <input
                          type="number"
                          id="minutes"
                          placeholder="0"
                          min="0"
                          max="59"
                          value={durationData.minutes}
                          onChange={methods.handleChangeDuration}
                          className="w-16 px-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                        />
                        <span className="text-slate-400">min</span>
                      </div>
                      <AnimatePresence>
                        {errors.duration && (
                          <motion.p
                            className="flex items-center text-sm text-red-500 mt-1 space-x-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <LuCircleAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{errors.duration}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <SelectInput
                      label="Activity type"
                      value={activityData.activity_type}
                      id="activity_type"
                      key={activityData.activity_type || "empty"}
                      onChange={(value) =>
                        methods.handleChange({
                          target: { id: "activity_type", value },
                        })
                      }
                      options={ACTIVITIES_TYPE}
                      placeholder="Choose an activity type"
                      disabled={isSubmitting}
                    />

                    <div>
                      <label
                        className="block text-sm font-medium text-slate-400 mb-1.5"
                        htmlFor="notes"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        placeholder="Describe what you did..."
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition first-letter:capitalize"
                        rows={6}
                        value={activityData?.notes}
                        onChange={methods.handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={closeModal}
                      className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(16,185,129,0.4)] w-full sm:w-auto cursor-pointer"
                    >
                      {isSubmitting ? (
                        <ButtonSpinner
                          label={mode === "create" ? "Adding..." : "Saving..."}
                        />
                      ) : mode === "create" ? (
                        "Add activity"
                      ) : (
                        "Save changes"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ActivityFormModal;

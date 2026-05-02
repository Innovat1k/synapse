import { useRef } from "react";
import { LuClock, LuTriangleAlert, LuCircleAlert } from "react-icons/lu";
import { useActivityForm } from "./hooks/useActivityForm";
import ButtonSpinner from "../ButtonSpinner";
import DeleteModal from "../DeleteModal";
import DatetimeInput from "./components/DatetimeInput/DatetimeInput";
import SelectInput from "./components/SelectInput";
import { Modal } from "../Modal/Modal";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function ActivityFormModal({
  mode = "create",
  isOpened = false,
  selectedActivity,
  skill,
  allSkills = [],
  closeModal,
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

  const isBlocked = allSkills.length === 0;
  const isSkillContext = !!skill;
  const dateInputRef = useRef(null);

  const { activityData, durationData, methods, isFormValid, errors } =
    useActivityForm({
      mode: mode,
      initialData: selectedActivity,
      onSubmit: onSubmit,
      skills: allSkills,
      id: isSkillContext ? skill?.skill_id : undefined,
      isOpened: isOpened,
    });

  const createFirstSkill = () => {
    closeModal();
    openSkillModal();
  };

  const modalTitle =
    mode === "create"
      ? "Log Activity"
      : mode === "edit"
        ? "Edit Activity"
        : "Confirm Deletion";

  const modalSize = mode === "create" ? "xl" : mode === "edit" ? "xl" : "md";

  return (
    <Modal
      isOpened={isOpened}
      onClose={closeModal}
      title={modalTitle}
      icon={LuClock}
      size={modalSize}
      initialFocusRef={dateInputRef}
      dataTestId="activity-modal"
    >
      {mode === "delete" ? (
        <DeleteModal
          entity="activity"
          initialData={selectedActivity}
          isSubmitting={isSubmitting}
          confirmDelete={onDelete}
          closeModal={closeModal}
        />
      ) : isBlocked ? (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <LuTriangleAlert className="text-amber-400 w-8 h-8 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-slate-100 mb-4">
            Cannot log activity
          </p>
          <p className="text-slate-400 mb-6">
            You must have at least one skill to record an activity.
          </p>
          <button
            type="button"
            onClick={createFirstSkill}
            className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-white font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            Create my first skill
          </button>
        </div>
      ) : (
        <form
          onSubmit={methods.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-5">
            {/* Skill */}
            <div>
              {isSkillContext ? (
                <div>
                  <div
                    id="skill-label"
                    className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
                  >
                    Skill
                  </div>
                  <div
                    aria-labelledby="skill-label"
                    aria-readonly="true"
                    className="w-full px-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg text-slate-300 opacity-70"
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
                    className="flex items-center text-xs text-rose-500 mt-2 gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <LuCircleAlert className="w-4 h-4 shrink-0" />
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
                className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
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
                  className="w-16 px-3 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all"
                />
                <span className="text-slate-500">h</span>

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
                  className="w-16 px-3 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all"
                />
                <span className="text-slate-500">min</span>
              </div>
              <AnimatePresence>
                {errors.duration && (
                  <motion.p
                    className="flex items-center text-xs text-rose-500 mt-2 gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <LuCircleAlert className="w-4 h-4 shrink-0" />
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
                className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
                htmlFor="notes"
              >
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Describe what you did..."
                className="w-full px-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all"
                rows={6}
                value={activityData?.notes}
                onChange={methods.handleChange}
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col-reverse md:flex-row sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-800/50">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={closeModal}
              className="px-6 py-2.5 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 w-full sm:w-auto cursor-pointer font-bold active:scale-95"
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
    </Modal>
  );
}

export default ActivityFormModal;

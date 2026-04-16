import React, { useRef } from "react";
import { LuClock, LuTriangleAlert, LuCircleAlert } from "react-icons/lu";
import { useActivityForm } from "./hooks/useActivityForm";
import ButtonSpinner from "../ButtonSpinner";
import DeleteModal from "../DeleteModal/DeleteModal";
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                    <LuCircleAlert className="w-4 h-4 text-red-500 shrink-0" />
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
    </Modal>
  );
}

export default ActivityFormModal;

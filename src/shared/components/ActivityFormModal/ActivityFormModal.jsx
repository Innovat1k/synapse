import { AnimatePresence, motion } from "framer-motion";
import { LuX, LuClock, LuCalendar } from "react-icons/lu";
import { useActivityForm } from "./hooks/useActivityForm";
import { formatDateShort, formatDateUTC } from "../../utils/utils";
import ButtonSpinner from "../ButtonSpinner";

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

  const {
    activityData,
    handleChange,
    durationData,
    handleChangeDuration,
    handleSubmit,
  } = useActivityForm({
    mode: mode,
    initialData: selectedActivity,
    onClose: closeModal,
    onSubmit: onSubmit,
    skills: allSkills,
    id: skill?.skill_id,
  });

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
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title-delete"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl border border-red-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-lg"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-red-500/5 to-transparent pointer-events-none opacity-40"></div>

              <div className="flex items-start justify-between gap-2 mb-4">
                <h2
                  className="text-lg sm:text-xl font-bold text-slate-100 truncate"
                  id="modal-title-delete"
                >
                  Confirm Deletion
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-200 flex-shrink-0 transition-colors"
                  aria-label="Close modal"
                >
                  <LuX size={20} />
                </button>
              </div>

              <p className="text-slate-300 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this activity from{" "}
                <span className="font-semibold text-slate-100 capitalize break-words">
                  {formatDateShort(selectedActivity.logged_at)}
                </span>{" "}
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
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Keep it
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(selectedActivity)}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    >
                      Delete permanently
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-teal-400/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-teal-400/5 to-transparent pointer-events-none opacity-40"></div>
              {/* <div className="absolute inset-0 rounded-2xl border border-teal-400/30 pointer-events-none"></div> */}

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
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Close modal"
                >
                  <LuX size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-5">
                  {/* Skill */}
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-400 mb-1.5"
                      htmlFor="skill"
                    >
                      Skill
                    </label>
                    <select
                      id="skill"
                      value={skill?.skill_id}
                      onChange={handleChange}
                      disabled={!!skill?.name} // Désactivé si skillName est fourni
                      className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition ${
                        skill?.name ? "cursor-not-allowed opacity-70" : ""
                      }`}
                    >
                      <option value="">Select a skill...</option>
                      {allSkills.map((skill) => (
                        <option key={skill.skill_id} value={skill.skill_id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-400 mb-1.5"
                      htmlFor="date"
                    >
                      Date
                    </label>
                    <div className="relative">
                      <LuCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="datetime-local"
                        id="logged_at"
                        value={formatDateUTC(activityData.logged_at)}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-400 mb-1.5"
                      htmlFor="duration"
                    >
                      Duration
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        id="hours"
                        placeholder="0"
                        min="0"
                        max="24"
                        value={durationData.hours}
                        onChange={handleChangeDuration}
                        className="w-16 px-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                      />
                      <span className="text-slate-400">h</span>
                      <input
                        type="number"
                        id="minutes"
                        placeholder="0"
                        min="0"
                        max="59"
                        value={durationData.minutes}
                        onChange={handleChangeDuration}
                        className="w-16 px-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                      />
                      <span className="text-slate-400">min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-400 mb-1.5"
                      htmlFor="activity_type"
                    >
                      Activity type
                    </label>
                    <select
                      id="activity_type"
                      value={activityData.activity_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                    >
                      {ACTIVITIES_TYPE.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                      rows={6}
                      value={activityData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={closeModal}
                    className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(16,185,129,0.4)] w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <ButtonSpinner
                        label={mode === "create" ? "Creating..." : "Saving..."}
                      />
                    ) : mode === "create" ? (
                      "Save Skill"
                    ) : (
                      "Update Skill"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ActivityFormModal;

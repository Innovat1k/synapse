import {
  LuAlarmClockPlus,
  LuCalendar,
  LuClock,
  LuListChecks,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { useActivityModal } from "@shared/components/ActivityFormModal/hooks/useActivityModal";
import ActivityFormModal from "@shared/components/ActivityFormModal/ActivityFormModal";
import { useActivitiesQuery } from "@shared/hooks/useActivitiesQuery/useActivitiesQuery";
import {
  formatDateShort,
  formatDuration,
} from "@shared/utils/utils";
import ButtonSpinner from "@shared/components/ButtonSpinner";

function SkillActivities({ skill, skills }) {
  const { activities, isLoading } = useActivitiesQuery(skill.skill_id);
  const { modal, methods, selectedActivity, isSubmitting } = useActivityModal(
    skill.skill_id
  );

  // Prevent passing undefined skill
  if (!skill) {return null;}

  return (
    <>
      <ActivityFormModal
        mode={modal.mode}
        isOpened={modal.isOpened}
        closeModal={methods.closeModal}
        closeByOverlay={methods.handleCloseOverlay}
        selectedActivity={selectedActivity}
        skill={skill}
        allSkills={skills}
        isSubmitting={isSubmitting}
        onSubmit={methods.handleSaveActivity}
        onDelete={methods.handleDelete}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-100">
              Activity log
            </h2>

            {!isLoading && activities?.length > 0 && (
              <div
                data-testid="activity-count-badge"
                className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800/40"
              >
                <LuListChecks
                  size={14}
                  className="text-slate-500 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-200 tabular-nums">
                  {activities.length}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm cursor-pointer"
            onClick={methods.openCreateModal}
          >
            <LuAlarmClockPlus size={16} />
            <span>Log activity</span>
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-slate-400 bg-slate-900/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-800/50 text-sm">
            <p>You haven't logged any activity for this skill.</p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <ButtonSpinner label="loading activities..." />
            ) : (
              <>
                {" "}
                {/* Desktop : full table */}
                <div
                  className="hidden lg:block"
                  data-testid="list-layout-desktop"
                >
                  <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-slate-400 border-b border-slate-800/50">
                          <th className="py-3 px-4 min-w-[140px]">Date</th>
                          <th className="py-3 px-4 min-w-[100px]">Duration</th>
                          <th className="py-3 px-4 min-w-[100px]">Type</th>
                          <th className="py-3 px-4">Notes</th>
                          <th className="py-3 px-4 text-right min-w-[90px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr
                            key={activity.id}
                            className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors"
                            data-testid={`activity-row-${activity.id}`}
                          >
                            <td className="py-3 px-4 text-slate-100 whitespace-nowrap">
                              {formatDateShort(activity.logged_at)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-slate-800/50 text-slate-200">
                                {formatDuration(activity.duration_minutes)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-300 capitalize">
                              {activity.activity_type}
                            </td>
                            <td className="py-3 px-4 text-slate-400 first-letter:capitalize">
                              {activity.notes ? activity.notes : "..."}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                                  aria-label={`Edit activity ${activity.id}`}
                                  onClick={() =>
                                    methods.openEditModal(activity)
                                  }
                                  type="button"
                                >
                                  <LuPencil size={18} />
                                </button>
                                <button
                                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  aria-label={`Delete activity ${activity.id}`}
                                  onClick={() =>
                                    methods.openDeleteModal(activity)
                                  }
                                  type="button"
                                >
                                  <LuTrash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Mobile + Tablet : cards */}
                <div
                  className="lg:hidden space-y-3"
                  data-testid="list-layout-mobile"
                >
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 p-3"
                      data-testid={`activity-card-${activity.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <LuCalendar size={12} className="flex-shrink-0" />
                            <span>{formatDateShort(activity.logged_at)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            className="text-teal-400 hover:text-teal-300 p-0.5 rounded"
                            aria-label={`Edit activity ${activity.id}`}
                            onClick={() => methods.openEditModal(activity)}
                            type="button"
                          >
                            <LuPencil size={14} />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300 p-0.5 rounded"
                            aria-label={`Delete activity ${activity.id}`}
                            onClick={() => methods.openDeleteModal(activity)}
                            type="button"
                          >
                            <LuTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <LuClock size={12} />
                          <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-300">
                            {formatDuration(activity.duration_minutes)}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs capitalize">
                          {activity.activity_type}
                        </div>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed first-letter:capitalize">
                        {activity.notes ? activity.notes : "..."}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SkillActivities;

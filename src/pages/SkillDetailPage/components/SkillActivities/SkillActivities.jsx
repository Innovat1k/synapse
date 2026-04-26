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
import { formatDateShort, formatDuration } from "@shared/utils/utils";
import ButtonSpinner from "@shared/components/ButtonSpinner";
import { AnimatePresence } from "framer-motion";

function SkillActivities({ skill, skills }) {
  const { activities, isLoading } = useActivitiesQuery(skill.skill_id);
  const { modal, methods, selectedActivity, isSubmitting } = useActivityModal(
    skill.skill_id,
  );

  if (!skill) return null;

  return (
    <>
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
              Activity log
            </h2>

            {!isLoading && activities?.length > 0 && (
              <div
                data-testid="activity-count-badge"
                className="flex items-center gap-2 bg-[#1a2332] px-3 py-1 rounded-lg border border-slate-800/50 shadow-sm"
              >
                <LuListChecks size={14} className="text-cyan-400 shrink-0" />
                <span className="text-sm font-bold text-slate-200 tabular-nums">
                  {activities.length}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-200 text-sm font-bold cursor-pointer active:scale-95"
            onClick={methods.openCreateModal}
          >
            <LuAlarmClockPlus size={18} />
            <span>Log activity</span>
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-[#0f1420]/60 backdrop-blur-sm rounded-xl border border-slate-800/50 text-sm">
            <p>You haven't logged any activity for this skill.</p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <ButtonSpinner label="loading activities..." />
            ) : (
              <>
                {/* Desktop : full table */}
                <div
                  className="hidden lg:block"
                  data-testid="list-layout-desktop"
                >
                  <div className="bg-[#0f1420]/60 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden shadow-2xl">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-slate-400 border-b border-slate-800/50 bg-[#1a2332]/40">
                          <th className="py-3 px-6 min-w-35 text-xs font-bold uppercase tracking-widest">
                            Date
                          </th>
                          <th className="py-3 px-6 min-w-25 text-xs font-bold uppercase tracking-widest">
                            Duration
                          </th>
                          <th className="py-3 px-6 min-w-25 text-xs font-bold uppercase tracking-widest">
                            Type
                          </th>
                          <th className="py-3 px-6 text-xs font-bold uppercase tracking-widest">
                            Notes
                          </th>
                          <th className="py-3 px-6 text-right min-w-22.5 text-xs font-bold uppercase tracking-widest">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr
                            key={activity.id}
                            className="border-b border-slate-800/30 hover:bg-[#1a2332]/30 transition-colors"
                            data-testid={`activity-row-${activity.id}`}
                          >
                            <td className="py-3 px-6 text-slate-100 whitespace-nowrap">
                              {formatDateShort(activity.logged_at)}
                            </td>
                            <td className="py-3 px-6">
                              <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg bg-slate-800/50 text-cyan-400 border border-slate-700/30">
                                {formatDuration(activity.duration_minutes)}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-slate-300 capitalize text-sm">
                              {activity.activity_type}
                            </td>
                            <td className="py-3 px-6 text-slate-400 first-letter:capitalize text-sm">
                              {activity.notes || "..."}
                            </td>
                            <td className="py-3 px-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                                  onClick={() =>
                                    methods.openEditModal(activity)
                                  }
                                  type="button"
                                  aria-label={`Edit activity ${activity.id}`}
                                >
                                  <LuPencil size={18} />
                                </button>
                                <button
                                  className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                  onClick={() =>
                                    methods.openDeleteModal(activity)
                                  }
                                  type="button"
                                  aria-label={`Delete activity ${activity.id}`}
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
                      className="bg-[#0f1420]/60 backdrop-blur-sm rounded-lg border border-slate-800/50 p-4"
                      data-testid={`activity-card-${activity.id}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <LuCalendar size={12} className="shrink-0" />
                          <span>{formatDateShort(activity.logged_at)}</span>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <button
                            className="text-cyan-400 active:scale-95"
                            onClick={() => methods.openEditModal(activity)}
                            type="button"
                            aria-label={`Edit activity ${activity.id}`}
                          >
                            <LuPencil size={16} />
                          </button>
                          <button
                            className="text-rose-400 active:scale-95"
                            onClick={() => methods.openDeleteModal(activity)}
                            type="button"
                            aria-label={`Delete activity ${activity.id}`}
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <LuClock size={12} />
                          <span className="bg-[#1a2332] px-2 py-0.5 rounded border border-slate-700/30 text-cyan-400 font-bold text-xs">
                            {formatDuration(activity.duration_minutes)}
                          </span>
                        </div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-800/30 rounded">
                          {activity.activity_type}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed first-letter:capitalize">
                        {activity.notes || "..."}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {modal.isOpened && (
          <ActivityFormModal
            mode={modal.mode}
            isOpened={true}
            closeModal={methods.closeModal}
            closeByOverlay={methods.handleCloseOverlay}
            selectedActivity={selectedActivity}
            skill={skill}
            allSkills={skills}
            isSubmitting={isSubmitting}
            onSubmit={methods.handleSaveActivity}
            onDelete={methods.handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default SkillActivities;

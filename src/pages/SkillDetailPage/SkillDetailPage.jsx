import {
  LuArrowLeft,
  LuEllipsis,
  LuPencil,
  LuTag,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useSkillDetail } from "./hooks/useSkillDetail";
import SkillFormModal from "../../shared/components/SkillFormModal/SkillFormModal";
import SkillActivities from "./components/SkillActivities/SkillActivities";
import { useSkillModal } from "../../shared/components/SkillFormModal/hooks/useSkillModal";
import PurgeActivitiesModal from "./components/PurgeActivitiesModal/PurgeActivitiesModal";
import { usePurgeActivities } from "./components/PurgeActivitiesModal/hooks/usePurgeActivities";
import { useActivitiesQuery } from "../../shared/hooks/useActivitiesQuery/useActivitiesQuery";
import SkillSkeleton from "./components/SkillSkeleton";

function SkillDetailPage() {
  const { skills } = useOutletContext();
  const { skillId } = useParams();
  const { skill, actionsMenu } = useSkillDetail(skillId, skills);
  const { modal, isSubmitting, methods } = useSkillModal();
  const activityPurge = usePurgeActivities(skillId, skill?.name);
  const { activities } = useActivitiesQuery(skillId);

  // Show the skeleton if skill is not ready
  if (!skill) {
    return <SkillSkeleton />;
  }

  return (
    <>
      <SkillFormModal
        isOpened={modal.isModalOpen}
        initialData={skill}
        isSubmitting={isSubmitting}
        mode={modal.modalMode}
        onClose={methods.closeModal}
        onDelete={methods.handleDelete}
        onSubmit={methods.handleSaveSkill}
      />

      <PurgeActivitiesModal
        isOpened={activityPurge.modal.isOpened}
        context={activityPurge.modal.context}
        skill={skill}
        activityCount={activities.length}
        closeModal={activityPurge.closePurgeModal}
        openFinalVerification={activityPurge.openFinalVerification}
        handlePurge={activityPurge.confirmPurge}
        skillValue={activityPurge.typedSkillName}
        changeValue={activityPurge.handleChange}
        hasError={activityPurge.hasError}
        isSubmitting={activityPurge.isSubmitting}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 px-4 sm:px-5 md:px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Skill: {skill?.name}
              </h1>
              <Link
                to="/skills"
                className="inline-flex items-center gap-1.5 mt-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <LuArrowLeft size={18} />
                <span className="text-sm">Back to Skills</span>
              </Link>
            </div>

            <div className="relative">
              {!actionsMenu.isOpened ? (
                <button
                  type="button"
                  aria-label="Open skill actions"
                  className="p-2 rounded-full border border-slate-700/60 hover:border-teal-400/60 hover:text-teal-400 text-slate-400 transition-colors"
                  onClick={actionsMenu.handleToggle}
                >
                  <LuEllipsis size={20} aria-hidden="true" />
                </button>
              ) : (
                <div className="absolute right-0 mt-2 w-48 z-10 bg-slate-900/80 backdrop-blur-lg border border-slate-800/50 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-slate-800/50">
                    <button
                      type="button"
                      aria-label="Close actions menu"
                      className="w-full text-right text-slate-400 hover:text-slate-200 transition-colors"
                      onClick={actionsMenu.handleToggle}
                    >
                      <LuX size={18} />
                    </button>
                  </div>
                  <div className="py-2">
                    <button
                      type="button"
                      aria-label={`Edit ${skill?.name} skill`}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800/50 hover:text-teal-400 transition-colors rounded-lg"
                      onClick={() => methods.openEditModal(skill)}
                    >
                      <LuPencil size={18} aria-hidden="true" />
                      <span>Edit skill</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${skill?.name} skill`}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-slate-300 hover:bg-slate-800/50 hover:text-red-400 transition-colors rounded-lg"
                      onClick={() => methods.openDeleteModal(skill)}
                    >
                      <LuTrash2 size={18} aria-hidden="true" />
                      <span>Delete skill</span>
                    </button>

                    <button
                      className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                        activities.length === 0
                          ? "opacity-50 cursor-not-allowed bg-red-600/50"
                          : "cursor-pointer"
                      }`}
                      onClick={activityPurge.openPurgeModal}
                      disabled={activities.length === 0}
                      type="button"
                    >
                      <LuTrash2 size={16} />
                      <span className="uppercase text-xs sm:text-sm">
                        Purge Activities
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 sm:p-5 mb-6 md:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 md:mb-5">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-400/20 border border-teal-400/40 text-teal-400 rounded-full text-xs sm:text-sm font-medium">
                Level {skill?.level}
              </span>
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-full text-xs sm:text-sm font-medium capitalize">
                Category: {skill?.category}
              </span>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {skill?.description ? (
                skill.description
              ) : (
                <span className="text-slate-500 italic">
                  Add a description to track your progress more effectively.
                </span>
              )}
            </p>

            {skill?.tags?.length > 0 && (
              <div className="my-6" data-testid="skill-tags-container">
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/40 hover:border-slate-600/50 text-slate-300 hover:text-slate-200 rounded-full text-xs transition-all duration-200"
                    >
                      <LuTag size={12} className="opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <hr className="my-5 md:my-6 border-slate-800/50" />

          {skill && <SkillActivities skill={skill} skills={skills} />}
        </div>
      </div>
    </>
  );
}

export default SkillDetailPage;

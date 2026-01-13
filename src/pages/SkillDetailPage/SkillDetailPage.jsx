import { LuArrowLeft, LuTag } from "react-icons/lu";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useSkillDetail } from "./hooks/useSkillDetail";
import SkillFormModal from "../../shared/components/SkillFormModal/SkillFormModal";
import SkillActivities from "./components/SkillActivities/SkillActivities";
import { useSkillModal } from "../../shared/components/SkillFormModal/hooks/useSkillModal";
import PurgeActivitiesModal from "./components/PurgeActivitiesModal/PurgeActivitiesModal";
import { usePurgeActivities } from "./components/PurgeActivitiesModal/hooks/usePurgeActivities";
import { useActivitiesQuery } from "../../shared/hooks/useActivitiesQuery/useActivitiesQuery";
import SkillSkeleton from "./components/SkillSkeleton";
import SkillActionsMenu from "./components/SkillActionsMenu/SkillActionsMenu";
import { SkillLinksSection } from "./components/SkillLinks/SkillLinksSection";

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

            <SkillActionsMenu
              actionsMenu={actionsMenu}
              openPurgeModal={activityPurge.openPurgeModal}
              skill={skill}
              activityCount={activities.length}
              methods={methods}
            />
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

          <SkillLinksSection skillId={skillId} />

          {skill && <SkillActivities skill={skill} skills={skills} />}
        </div>
      </div>
    </>
  );
}

export default SkillDetailPage;

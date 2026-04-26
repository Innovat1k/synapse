import { LuArrowLeft, LuBrainCircuit, LuTag } from "react-icons/lu";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useSkillDetail } from "./hooks/useSkillDetail";
import SkillFormModal from "@shared/components/SkillFormModal/SkillFormModal";
import SkillActivities from "./components/SkillActivities/SkillActivities";
import { useSkillModal } from "@shared/components/SkillFormModal/hooks/useSkillModal";
import PurgeActivitiesModal from "./components/PurgeActivitiesModal/PurgeActivitiesModal";
import { usePurgeActivities } from "./components/PurgeActivitiesModal/hooks/usePurgeActivities";
import { useActivitiesQuery } from "@shared/hooks/useActivitiesQuery/useActivitiesQuery";
import SkillActionsMenu from "./components/SkillActionsMenu/SkillActionsMenu";
import { SkillLinksSection } from "./components/SkillLinks/SkillLinksSection";
import { useGraphModal } from "./components/GraphModal/hooks/useGraphModal";
import { GraphModal } from "./components/GraphModal/GraphModal";
import { useSubgraph } from "./components/GraphModal/hooks/useSubgraph";
import { AnimatePresence, motion } from "framer-motion";
import { GraphView } from "./components/GraphModal/GraphView";
import ButtonSpinner from "@shared/components/ButtonSpinner";
import { useTracks } from "../Settings/app/tracks/hooks/useTracks";

function SkillDetailPage() {
  const { skills } = useOutletContext();
  const { skillId } = useParams();
  const { skill, actionsMenu } = useSkillDetail(skillId, skills);
  const { modal, isSubmitting, methods } = useSkillModal();
  const activityPurge = usePurgeActivities(skillId, skill?.name);
  const { activities } = useActivitiesQuery(skillId);
  const { isGraphModalOpen, openGraphModal, closeGraphModal } = useGraphModal();

  const { data: subgraphData, isLoading: isGraphLoading } =
    useSubgraph(skillId);
  const { data: trackData } = useTracks(skill);

  return (
    <>
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

      <div className="min-h-screen bg-[#0a0e1a] text-slate-50 p-2 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* --- HEADER SECTION --- */}
          <div className="flex justify-between items-start gap-4 mb-8 md:mb-10">
            <div className="space-y-1 w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50 wrap-break-word">
                Skill: <span className="text-cyan-400">{skill?.name}</span>
              </h1>
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all group py-1"
              >
                <LuArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Back to Skills
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 w-auto">
              {/* Graph Button - Adaptive mobile */}
              <button
                type="button"
                onClick={openGraphModal}
                className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer hidden md:flex bg-[#1a2332] hover:bg-[#232d3f] border border-slate-800/50 hover:border-cyan-500/40 text-slate-200 transition-all duration-200 shadow-lg shadow-cyan-500/10 group"
                aria-label={`View knowledge graph for ${skill?.name}`}
              >
                <LuBrainCircuit
                  size={18}
                  className="text-cyan-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                  Graph
                </span>
              </button>

              <SkillActionsMenu
                actionsMenu={actionsMenu}
                openPurgeModal={activityPurge.openPurgeModal}
                openGraphModal={openGraphModal}
                skill={skill}
                activityCount={activities.length}
                methods={methods}
              />
            </div>
          </div>

          {/* --- MAIN INFO CARD --- */}
          <div className="bg-[#0f1420]/80 backdrop-blur-md rounded-xl border border-slate-800/50 p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-cyan-500/5 blur-[80px] pointer-events-none" />

            {/* Badges Row */}
            <div className="flex flex-wrap gap-3 mb-6 relative z-10">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest">
                Level {skill?.level}
              </span>
              <span className="px-3 py-1 bg-slate-800/40 border border-slate-700/50 text-slate-300 rounded-full text-xs font-bold uppercase tracking-widest">
                {skill?.category}
              </span>

              {trackData?.skillTrack ? (
                <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full text-xs font-bold uppercase tracking-widest max-w-50 truncate">
                  Track: {trackData.skillTrack.title}
                </span>
              ) : (
                <span className="px-3 py-1 bg-[#1a2332] border border-slate-800/50 text-slate-500 rounded-full text-xs font-medium italic">
                  No track
                </span>
              )}
            </div>

            {/* Description Section */}
            <div className="relative z-10 mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Overview
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl wrap-break-word">
                {skill?.description ? (
                  skill.description
                ) : (
                  <span className="text-slate-600 italic">
                    Add a description to track your progress effectively.
                  </span>
                )}
              </p>
            </div>

            {/* Tags Section */}
            {skill?.tags?.length > 0 && (
              <div
                className="pt-6 border-t border-slate-800/40"
                data-testid="skill-tags-container"
              >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Core Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a2332] border border-slate-800/50 text-slate-400 rounded-lg text-xs transition-all hover:border-cyan-500/30 hover:text-cyan-300 cursor-default"
                    >
                      <LuTag size={12} className="opacity-50" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- CONTENT GRID --- */}
          <div className="space-y-8 pb-20 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SkillLinksSection skillId={skillId} skill={skill} />
            <hr className="border-slate-800/30" />
            {skill && <SkillActivities skill={skill} skills={skills} />}
          </div>

          {/* --- MODALS --- */}
          <AnimatePresence>
            {modal.isModalOpen && (
              <SkillFormModal
                isOpened={true}
                initialData={skill}
                isSubmitting={isSubmitting}
                mode={modal.modalMode}
                onClose={methods.closeModal}
                onDelete={methods.handleDelete}
                onSubmit={methods.handleSaveSkill}
              />
            )}

            {isGraphModalOpen && (
              <GraphModal
                isOpened={true}
                onClose={closeGraphModal}
                skillName={skill?.name || "this skill"}
                size="full"
              >
                {isGraphLoading ? (
                  <div className="w-full h-full min-h-100 flex items-center justify-center">
                    <ButtonSpinner
                      color="text-cyan-500"
                      label="Syncing knowledge graph..."
                      labelColor="text-slate-400"
                    />
                  </div>
                ) : subgraphData ? (
                  <div className="w-full h-full min-h-125">
                    <GraphView
                      centerSkillId={skillId}
                      nodes={subgraphData.nodes}
                      links={subgraphData.links}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-12 text-center">
                    <div className="text-slate-500 uppercase text-xs tracking-widest font-bold">
                      No connections found in the neural network.
                    </div>
                  </div>
                )}
              </GraphModal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default SkillDetailPage;

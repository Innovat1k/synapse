import {
  useIncomingSkillLinks,
  useOutgoingSkillLinks,
} from "./hooks/useSkillLinks";
import SkillLinksSkeleton from "./components/SkillLinksSkeleton.jsx";
import { LuCornerLeftUp, LuCornerRightUp, LuPlus } from "react-icons/lu";
import { SkillLinkerModal } from "./components/SkillLinkerModal/SkillLinkerModal.jsx";
import { useSkillLinkerModal } from "./components/SkillLinkerModal/hooks/useSkillLinkerModal.js";
import { SkillLinkItem } from "./components/SkillLinkItem.jsx";
import { UnlinkConfirmModal } from "./components/UnlinkConfirmModal/UnlinkConfirmModal.jsx";
import { useSkillLinkEditor } from "./components/UnlinkConfirmModal/hooks/useSkillLinkEditor.js";
import { AnimatePresence } from "framer-motion";

export const SkillLinksSection = ({ skillId, skill }) => {
  const {
    data: incomingLinks = [],
    isLoading: inLoading,
    isError: inError,
  } = useIncomingSkillLinks(skillId);

  const {
    data: outgoingLinks = [],
    isLoading: outLoading,
    isError: outError,
  } = useOutgoingSkillLinks(skillId);

  const { linkerModal, openLinkerModal, closeLinkerModal } =
    useSkillLinkerModal();

  const { isEditing, isLoading, unlinkingLink, methods } = useSkillLinkEditor();

  const isLoadingAny = inLoading || outLoading;

  if (isLoadingAny) {
    return <SkillLinksSkeleton />;
  }

  if (inError || outError) {
    return null;
  }

  const noLinks = incomingLinks.length === 0 && outgoingLinks.length === 0;

  const containerBg = `p-4 rounded-2xl backdrop-blur-md transition-all duration-300 border
  ${
    isEditing
      ? "bg-slate-800/40 border-slate-500/50 shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-[1.01]"
      : "bg-slate-900/60 border-slate-800/50 shadow-none scale-100"
  }`;

  return (
    <section className="my-8">
      {/* Header + Edit button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-200">
          Skill Connections
        </h3>

        <button
          type="button"
          title={noLinks ? "No connections to edit" : ""}
          disabled={noLinks}
          onClick={methods.toggleEditing}
          className={`
            text-xs font-bold px-4 py-1.5 rounded-full transition-all border flex items-center justify-center min-w-[65px]
          ${
            noLinks
              ? "cursor-not-allowed opacity-30 grayscale-[0.5]"
              : "cursor-pointer active:scale-95"
          }
        ${
          isEditing
            ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:enabled:text-slate-200 hover:enabled:border-slate-600 hover:enabled:bg-slate-800"
        }`}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div
        className={`flex flex-col md:flex-row gap-6 transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
      >
        {/* Section : Required to Master */}
        <div className="flex-1 min-w-0">
          <div className={containerBg}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-1">
                <LuCornerLeftUp size={16} />
                Required to Master
              </h4>
              <button
                onClick={() => openLinkerModal("incoming")}
                disabled={isEditing}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border
                  ${
                    isEditing
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-500/40 opacity-60"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                  }`}
                aria-label={
                  isEditing
                    ? "Exit edit mode to add prerequisite links"
                    : "Add a prerequisite skill"
                }
              >
                <LuPlus size={16} />
              </button>
            </div>

            {incomingLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-2">
                {incomingLinks.map((link) => (
                  <SkillLinkItem
                    key={link.id}
                    skillName={link.skill_name}
                    linkType={link.type}
                    isEditing={isEditing}
                    to={`/skills/${link.source_skill_id}`}
                    onUnlink={() => methods.removeLink(link)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                No prerequisites defined yet.
              </p>
            )}
          </div>
        </div>

        {/* Section : Enables mastery of */}
        <div className="flex-1 min-w-0">
          <div className={containerBg}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-1">
                <LuCornerRightUp size={16} />
                Enables mastery of
              </h4>
              <button
                onClick={() => openLinkerModal("outgoing")}
                disabled={isEditing}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border
                  ${
                    isEditing
                      ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-400/40 opacity-60"
                      : "border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20"
                  }`}
                aria-label={
                  isEditing
                    ? "Exit edit mode to add outgoing skill links"
                    : "Add a skill this unlocks"
                }
              >
                <LuPlus size={16} />
              </button>
            </div>

            {outgoingLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-2">
                {outgoingLinks.map((link) => (
                  <SkillLinkItem
                    key={link.id}
                    skillName={link.skill_name}
                    linkType={link.type}
                    isEditing={isEditing}
                    to={`/skills/${link.target_skill_id}`}
                    onUnlink={() => methods.removeLink(link)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                This skill doesn't unlock anything yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SkillLinkerModal
        isOpened={linkerModal.isOpen}
        mode={linkerModal.mode}
        currentSkillId={skillId}
        currentSkillName={skill?.name}
        existingIncomingLinks={incomingLinks}
        existingOutgoingLinks={outgoingLinks}
        onClose={closeLinkerModal}
      />

      {
        <AnimatePresence>
          {unlinkingLink && (
            <UnlinkConfirmModal
              key="unlink-modal"
              isOpened={!!unlinkingLink}
              isLoading={isLoading}
              link={unlinkingLink}
              skill={skill}
              onConfirm={methods.confirmRemoval}
              onClose={methods.cancelRemoval}
            />
          )}
        </AnimatePresence>
      }
    </section>
  );
};

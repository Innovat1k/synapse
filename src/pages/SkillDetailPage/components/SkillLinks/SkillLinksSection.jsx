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
import { useIsOnline } from "@shared/components/utils/NetworkStatus/hooks/useNetworkStatus";

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

  const { isEditing, isLoading, unlinkingLink, methods } =
    useSkillLinkEditor(skillId);

  const isLoadingAny = inLoading || outLoading;

  const isOnline = useIsOnline();

  if (isLoadingAny) {
    return <SkillLinksSkeleton />;
  }
  if (inError || outError) {
    return null;
  }

  const noLinks = incomingLinks.length === 0 && outgoingLinks.length === 0;

  // Tertiary bg and border styling based on Neural theme
  const containerBg = `p-6 rounded-lg backdrop-blur-md transition-all duration-300 border ${
    isEditing
      ? "bg-[#1a2332] border-cyan-400/50 shadow-lg shadow-cyan-500/20 scale-[1.01]"
      : "bg-[#1a2332]/40 border-slate-800/50 shadow-none scale-100"
  }`;

  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-50">
          Skill Connections
        </h3>

        <button
          type="button"
          title={noLinks ? "No connections to edit" : ""}
          disabled={noLinks || !isOnline}
          onClick={methods.toggleEditing}
          className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all border flex items-center justify-center min-w-16.25 disabled:opacity-50 ${
            noLinks
              ? "cursor-not-allowed opacity-30 grayscale"
              : "cursor-pointer active:scale-95"
          } ${
            isEditing
              ? "bg-rose-500/10 border-rose-400/40 text-rose-400 shadow-lg shadow-rose-500/20"
              : "bg-[#1a2332] border-slate-800/50 text-slate-400 hover:enabled:text-slate-200 hover:enabled:border-slate-700"
          }`}
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>

      <div
        className={`flex flex-col md:flex-row gap-6 transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className={containerBg}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <LuCornerLeftUp size={16} />
                Required to Master
              </h4>
              <button
                onClick={() => openLinkerModal("incoming")}
                disabled={isEditing}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEditing
                    ? "border-amber-300/20 bg-amber-300/5 text-amber-300/40 opacity-60"
                    : "border-amber-300/30 bg-amber-300/10 text-amber-300 hover:bg-amber-300/20"
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
              <p className="text-slate-500 text-sm italic px-2">
                No prerequisites defined yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className={containerBg}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <LuCornerRightUp size={16} />
                Enables mastery of
              </h4>
              <button
                onClick={() => openLinkerModal("outgoing")}
                disabled={isEditing || !isOnline}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isEditing
                    ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-400/40"
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
              <p className="text-slate-500 text-sm italic px-2">
                This skill doesn't unlock anything yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <SkillLinkerModal
        isOpened={linkerModal.isOpen}
        mode={linkerModal.mode}
        currentSkillId={skillId}
        currentSkillName={skill?.name}
        existingIncomingLinks={incomingLinks}
        existingOutgoingLinks={outgoingLinks}
        onClose={closeLinkerModal}
      />

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
    </section>
  );
};

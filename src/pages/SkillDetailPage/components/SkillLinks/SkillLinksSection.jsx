import { Link } from "react-router-dom";
import {
  useIncomingSkillLinks,
  useOutgoingSkillLinks,
} from "./hooks/useSkillLinks";
import SkillLinksSkeleton from "./components/SkillLinksSkeleton.jsx";
import { LuCornerLeftUp, LuCornerRightUp } from "react-icons/lu";

export const SkillLinksSection = ({ skillId }) => {
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

  const isLoadingAny = inLoading || outLoading;

  if (isLoadingAny) {
    return <SkillLinksSkeleton />;
  }

  if (inError || outError) {
    return null;
  }

  return (
    <section className="my-8">
      <h3 className="text-lg font-medium text-slate-200 mb-3">
        Skill Connections
      </h3>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="p-4 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50">
            {incomingLinks.length > 0 ? (
              <>
                <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-1 mb-2">
                  <LuCornerLeftUp size={16} />
                  Required to Master
                </h4>
                <div className="flex flex-wrap gap-2 p-2">
                  {incomingLinks.map((link) => {
                    const isPrereq = link.type === "prerequisite";
                    return (
                      <Link
                        key={link.id}
                        to={`/skills/${link.source_skill_id}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-200/80 rounded-full hover:bg-white transition-colors backdrop-blur-sm border border-slate-300/30"
                        aria-label={`${link.skill_name}, ${
                          isPrereq ? "prerequisite" : "complementary"
                        }`}
                      >
                        <span className="truncate max-w-35 text-slate-800 dark:text-slate-900 font-medium">
                          {link.skill_name}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPrereq ? "bg-amber-500" : "bg-cyan-500"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">
                No prerequisites defined yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="p-4 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50">
            {outgoingLinks.length > 0 ? (
              <>
                <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-1 mb-2">
                  <LuCornerRightUp size={16} />
                  Enables mastery of
                </h4>
                <div className="flex flex-wrap gap-2 p-2">
                  {outgoingLinks.map((link) => {
                    const isPrereq = link.type === "prerequisite";
                    return (
                      <Link
                        key={link.id}
                        to={`/skills/${link.target_skill_id}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-200/80 rounded-full hover:bg-white transition-colors backdrop-blur-sm border border-slate-300/30"
                        aria-label={`${link.skill_name}, ${
                          isPrereq ? "prerequisite" : "complementary"
                        }`}
                      >
                        <span className="truncate max-w-full sm:max-w-35 text-slate-800 dark:text-slate-900 font-medium">
                          {link.skill_name}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPrereq ? "bg-amber-500" : "bg-cyan-500"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm italic">
                This skill doesn't unlock anything yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

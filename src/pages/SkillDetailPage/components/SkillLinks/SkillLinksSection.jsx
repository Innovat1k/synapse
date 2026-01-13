import { Link } from "react-router-dom";
import { useIncomingSkillLinks } from "./hooks/useSkillLinks";
import SkillLinksSkeleton from "./components/SkillLinksSkeleton.jsx";

export const SkillLinksSection = ({ skillId }) => {
  const {
    data: incomingLinks = [],
    isLoading,
    isError,
  } = useIncomingSkillLinks(skillId);

  if (isLoading) {
    return <SkillLinksSkeleton />;
  }

  if (isError || incomingLinks.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-medium text-slate-200 mb-3">
        Skill Connections
      </h3>

      {incomingLinks.length > 0 && (
        <div className="p-4 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 mb-6">
          <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v16a1 1 0 01-1.7.7l-8-4A1 1 0 012 14V6a1 1 0 011.7-.7l8 4z"
                clipRule="evenodd"
              />
            </svg>
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
                    isPrereq ? "prérequis" : "compétence complémentaire"
                  }`}
                >
                  <span className="truncate max-w-35 text-slate-800 dark:text-slate-900 font-medium">
                    {link.skill_name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPrereq ? "bg-amber-500" : "bg-blue-500"
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

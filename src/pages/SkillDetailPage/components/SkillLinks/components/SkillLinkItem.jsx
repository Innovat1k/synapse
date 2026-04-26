import { LuX } from "react-icons/lu";
import { Link } from "react-router-dom";

export const SkillLinkItem = ({
  skillName,
  linkType,
  isEditing,
  onUnlink,
  to,
}) => {
  const isPrerequisite = linkType === "prerequisite";

  // Base classes according to "Badges & Pills" standards
  const baseClasses =
    "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200";

  // Mode Edition : Style DANGER (Rose)
  if (isEditing) {
    return (
      <button
        onClick={onUnlink}
        aria-label={`Remove link to ${skillName}`}
        className={`
          ${baseClasses}
          bg-rose-600 hover:bg-rose-700 text-white font-bold
          border-rose-500/20 shadow-lg shadow-rose-500/20
          active:scale-95 cursor-pointer
        `}
        type="button"
      >
        <span className="truncate max-w-35 text-xs uppercase tracking-wide">
          {skillName}
        </span>
        <LuX size={14} strokeWidth={3} className="text-white/80 shrink-0" />
      </button>
    );
  }

  // Mode Lecture : Style NEUTRAL (Slate) avec indicateur d'accent
  return (
    <div
      className={`
        ${baseClasses} 
        relative group bg-slate-800/50 border-slate-700/50 
        hover:border-slate-700 hover:bg-slate-800
      `}
    >
      <Link
        to={to}
        aria-label={`${skillName}, ${isPrerequisite ? "prerequisite" : "complementary"}`}
        className="truncate max-w-35 text-xs font-medium text-slate-200 group-hover:text-slate-50 transition-colors"
      >
        {skillName}
      </Link>

      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Active Indicator (Dot) */}
        <span
          className={`
            absolute w-2 h-2 rounded-full transition-all duration-200
            ${
              isPrerequisite
                ? "bg-amber-400 shadow-lg shadow-amber-400/60"
                : "bg-cyan-400 shadow-lg shadow-cyan-400/60"
            }
            group-hover:opacity-0 group-hover:scale-50
          `}
        />

        {/* Quick Unlink Button on Hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUnlink();
          }}
          aria-label={`Remove link to ${skillName}`}
          className="absolute opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
        >
          <LuX size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

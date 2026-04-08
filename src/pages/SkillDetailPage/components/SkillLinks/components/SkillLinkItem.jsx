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

  // Common class for height and padding
  const baseClasses =
    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300";

  if (isEditing) {
    return (
      <button
        onClick={onUnlink}
        aria-label={`Remove link to ${skillName}`}
        className={`
           flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
         bg-red-500/10 border-red-500/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]
         hover:bg-red-500/20 hover:border-red-400 hover:text-red-100
          active:scale-[0.97] cursor-pointer
          `}
        type="button"
      >
        <span className="truncate max-w-35 font-medium text-sm">
          {skillName}
        </span>
        <LuX size={14} strokeWidth={3} className="text-red-400 shrink-0" />
      </button>
    );
  }

  return (
    <div
      className={`${baseClasses} relative group bg-slate-800/40 border border-slate-700/50 backdrop-blur-md hover:border-slate-400 hover:bg-slate-800/60`}
    >
      <Link
        to={to}
        aria-label={`${skillName}, ${isPrerequisite ? "prerequisite" : "complementary"}`}
        className="truncate max-w-35 font-medium text-sm text-slate-200 group-hover:text-white"
      >
        {skillName}
      </Link>

      <div className="relative w-5 h-5 flex items-center justify-center">
        <span
          className={`absolute w-1.5 h-1.5 rounded-full shadow-[0_0_8px] transition-opacity duration-200
            ${isPrerequisite ? "bg-amber-500 shadow-amber-500/40" : "bg-cyan-500 shadow-cyan-500/40"}
            group-hover:opacity-0
          `}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUnlink();
          }}
          aria-label={`Remove link to ${skillName}`}
          className="absolute opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
        >
          <LuX size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

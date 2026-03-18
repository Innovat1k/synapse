import { LuTag, LuLayers } from "react-icons/lu";
import { Link } from "react-router-dom";

// Renders filtered skills as interactive cards with loading/empty states; each links to its detail page.
export const SkillsGrid = ({ skills = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-slate-900/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No skills found for this track.</p>
        <p className="text-sm mt-1">Add your first skill to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {skills.map((skill) => (
        <Link
          key={skill.skill_id}
          to={`/skills/${skill.skill_id}`}
          className="block p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/40 rounded-lg transition-colors group"
          aria-label={`View details for ${skill.name}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-slate-100 group-hover:text-teal-400 transition-colors">
              {skill.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <LuLayers size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-400">
                Level {skill.level}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/40 px-1.5 py-0.5 rounded">
              <LuTag size={8} />
              {skill.category}
            </span>
            {skill.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/40 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {skill.tags?.length > 2 && (
              <span className="text-[10px] text-slate-500">
                +{skill.tags.length - 2}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

import { LuTag, LuLayers } from "react-icons/lu";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

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
      <div className="flex flex-col items-center justify-center text-center p-6">
        <div className="relative mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/50">
            <LuLayers className="text-slate-500" size={24} />
          </div>

          <motion.div
            className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full scale-150 opacity-0 group-hover:opacity-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">
          No skills found
        </h3>
        <p className="text-sm text-slate-500">
          Add your first skill to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {skills.map((skill) => (
        <Link
          key={skill.skill_id}
          to={`/skills/${skill.skill_id}`}
          className="block p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/40 rounded-lg transition-colors duration-200 group"
          aria-label={`View details for ${skill.name}`}
        >
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-slate-100 group-hover:text-cyan-400 transition-colors">
              {skill.name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <LuLayers size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-400">
                Lv {skill.level}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded">
              <LuTag size={10} />
              {skill.category}
            </span>
            {skill.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {skill.tags?.length > 2 && (
              <span className="text-xs text-slate-500">
                +{skill.tags.length - 2}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

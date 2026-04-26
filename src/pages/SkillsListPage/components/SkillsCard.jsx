import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { formatDate } from "@shared/utils/utils";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function SkillsCard({ isLoading, skills = [], methods }) {
  return (
    <div className="md:hidden space-y-4 p-6" data-testid="list-layout-mobile">
      {isLoading ? (
        <div className="text-center py-8 text-slate-400">Loading skills...</div>
      ) : (
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              key={skill.skill_id}
              className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-6 border border-slate-800/50"
              data-testid={`skill-card-${skill.skill_id}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link to={`${skill.skill_id}`}>
                    <h3 className="font-semibold text-slate-100 capitalize text-lg">
                      {skill.name}
                    </h3>
                  </Link>
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-slate-800/60 text-slate-200">
                    {skill.category}
                  </span>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    aria-label={`Edit skill ${skill.name}`}
                    onClick={() => methods.openEditModal(skill)}
                  >
                    <LuPencil size={18} />
                  </button>
                  <button
                    className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    aria-label={`Delete skill ${skill.name}`}
                    onClick={() => methods.openDeleteModal(skill)}
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Level</span>
                  <span className="font-semibold text-slate-300">
                    {skill.level}/5
                  </span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2">
                  <div
                    className="bg-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Updated: {formatDate(skill.created_at)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

export default SkillsCard;

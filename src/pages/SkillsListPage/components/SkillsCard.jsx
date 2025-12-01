import { AnimatePresence, motion } from "framer-motion";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { formatDate } from "../../../shared/utils/utils";

function SkillsCard({ isLoading, skills = [], methods }) {
  return (
    <div className="md:hidden space-y-4 p-4" data-testid="list-layout-mobile">
      {isLoading ? (
        <div className="text-center py-8 text-slate-400">Loading...</div>
      ) : (
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.div
              key={skill.skill_id}
              className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50"
              data-testid={`skill-card-${skill.skill_id}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`${skill.skill_id}`}>
                    <h3 className="font-semibold text-slate-100 capitalize">
                      {skill.name}
                    </h3>
                  </Link>
                  <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-200">
                    {skill.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-teal-400 hover:text-teal-300"
                    aria-label={`Edit skill ${skill.name}`}
                    onClick={() => methods.openEditModal(skill)}
                  >
                    <LuPencil size={16} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    aria-label={`Delete skill ${skill.name}`}
                    onClick={() => methods.openDeleteModal(skill)}
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Level</span>
                  <span>{skill.level}/5</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2">
                  <div
                    className="bg-teal-400 h-2 rounded-full"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
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

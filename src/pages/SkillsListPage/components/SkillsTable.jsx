import { AnimatePresence, motion } from "framer-motion";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import TableHead from "./TableHead";
import { formatDate } from "../../../shared/utils/utils";

function SkillsTable({
  skills = [],
  methods,
  sortStates,
  handleSort,
  isLoading,
}) {
  return (
    <div
      className="hidden md:block overflow-x-auto"
      data-testid="list-layout-desktop"
    >
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-800/50">
            <TableHead
              field={sortStates}
              fieldLabel="name"
              handleSort={handleSort}
            />
            <th className="py-3 px-4">Category</th>
            <TableHead
              field={sortStates}
              fieldLabel="level"
              handleSort={handleSort}
            />
            <th className="py-3 px-4">Last Updated</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-slate-400">
                Loading...
              </td>
            </tr>
          ) : (
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.tr
                  key={skill.skill_id}
                  className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors capitalize"
                  data-testid={`skill-row-${skill.skill_id}`}
                >
                  <td className="py-3 px-4 font-medium text-slate-100">
                    <Link to={`${skill.skill_id}`}>{skill.name}</Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-slate-800/50 text-slate-200">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800/50 rounded-full h-2">
                        <div
                          className="bg-teal-400 h-2 rounded-full"
                          style={{
                            width: `${(skill.level / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-300">
                        {skill.level}/5
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {formatDate(skill.created_at)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-teal-400 hover:text-teal-300 transition-colors"
                        aria-label={`Edit skill ${skill.name}`}
                        onClick={() => methods.openEditModal(skill)}
                      >
                        <LuPencil size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label={`Delete skill ${skill.name}`}
                        onClick={() => methods.openDeleteModal(skill)}
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SkillsTable;

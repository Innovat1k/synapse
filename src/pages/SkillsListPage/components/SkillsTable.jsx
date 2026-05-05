import { LuPencil, LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import TableHead from "./TableHead";
import { formatDate } from "@shared/utils/utils";
import { useIsOnline } from "@shared/components/utils/NetworkStatus/hooks/useNetworkStatus";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

function SkillsTable({
  skills = [],
  methods,
  sortStates,
  handleSort,
  isLoading,
}) {
  const isOnline = useIsOnline();

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
            <th className="py-3 px-6 text-xs font-bold uppercase tracking-widest">
              Category
            </th>
            <TableHead
              field={sortStates}
              fieldLabel="level"
              handleSort={handleSort}
            />
            <th className="py-3 px-6 text-xs font-bold uppercase tracking-widest">
              Last Updated
            </th>
            <th className="py-3 px-6 text-right text-xs font-bold uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-slate-400">
                Loading skills...
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
                  <td className="py-3 px-6 font-medium text-slate-100">
                    <Link to={`${skill.skill_id}`}>{skill.name}</Link>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-800/50 text-slate-200">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 bg-slate-800/50 rounded-full h-2">
                        <div
                          className="bg-cyan-400 h-2 rounded-full"
                          style={{
                            width: `${(skill.level / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-slate-300">
                        {skill.level}/5
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-slate-400 text-sm">
                    {formatDate(skill.created_at)}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Edit skill ${skill.name}`}
                        onClick={() => methods.openEditModal(skill)}
                        disabled={!isOnline}
                      >
                        <LuPencil size={18} />
                      </button>
                      <button
                        className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Delete skill ${skill.name}`}
                        onClick={() => methods.openDeleteModal(skill)}
                        disabled={!isOnline}
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

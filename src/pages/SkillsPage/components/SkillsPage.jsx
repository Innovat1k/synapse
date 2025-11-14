import { LuSearch, LuPlus, LuPencil, LuTrash2, LuFilter } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useSkills } from "../hooks/useSkills";
import { useSkillModal } from "../../../shared/components/SkillFormModal/hooks/useSkillModal/useSkillModal";
import SkillFormModal from "../../../shared/components/SkillFormModal/components/SkillFormModal";
import TableHead from "./components/TableHead";

const CATEGORIES = ["all skills", "backend", "devOps", "frontend", "others"];

const SkillsPage = () => {
  const { skillsCategory, search, sortStates, handleSort, isLoading } =
    useSkills();

  const { modal, isSubmitting, selectedSkill, methods } = useSkillModal();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <AnimatePresence>
        {modal.isModalOpen && (
          <SkillFormModal
            key={
              modal.isModalOpen
                ? modal.modalMode === "create"
                  ? "create"
                  : `edit-${selectedSkill?.id}`
                : "closed"
            }
            initialData={selectedSkill}
            isSubmitting={isSubmitting}
            mode={modal.modalMode}
            onClose={methods.closeModal}
            onDelete={methods.handleDelete}
            onSubmit={methods.handleSaveSkill}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Skill Management</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800/50 rounded-lg text-slate-100 placeholder-slate-500/70 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition backdrop-blur-sm"
                value={search.searchTerm}
                onChange={(e) => search.setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                className="pl-10 pr-8 py-2.5 bg-slate-900/60 border border-slate-800/50 rounded-lg text-slate-100 focus:outline-none capitalize backdrop-blur-sm appearance-none"
                data-testid="Skills category"
                value={skillsCategory.activeCategory}
                onChange={(e) =>
                  skillsCategory.setActiveCategory(e.target.value)
                }
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900 text-slate-100"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={methods.openCreateModal}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <LuPlus size={18} />
            <span>Add new skill</span>
          </button>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
          {search.filteredSkills.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No skills found. Try adjusting your search or filters.
            </div>
          ) : (
            <>
              {/* Version Desktop : Tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-800/50">
                      <TableHead
                        field={sortStates}
                        fieldLabel="Name"
                        handleSort={handleSort}
                      />
                      <th className="py-3 px-4">Category</th>
                      <TableHead
                        field={sortStates}
                        fieldLabel="Level"
                        handleSort={handleSort}
                      />
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-slate-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {search.filteredSkills.map((skill) => (
                          <motion.tr
                            key={skill.id}
                            className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors capitalize"
                            data-testid={`Skill-${skill.id}`}
                          >
                            <td className="py-3 px-4 font-medium text-slate-100">
                              {skill.name}
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
                                  aria-label={`Edit skill ${skill.id}`}
                                  onClick={() => methods.openEditModal(skill)}
                                >
                                  <LuPencil size={18} />
                                </button>
                                <button
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                  aria-label={`Delete skill ${skill.id}`}
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

              {/* Version Mobile : Cartes */}
              <div className="md:hidden space-y-4 p-4">
                {isLoading ? (
                  <div className="text-center py-8 text-slate-400">
                    Loading...
                  </div>
                ) : (
                  <AnimatePresence>
                    {search.filteredSkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-800/50"
                        data-testid={`Skill-${skill.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-100 capitalize">
                              {skill.name}
                            </h3>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-200">
                              {skill.category}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="text-teal-400 hover:text-teal-300"
                              aria-label={`Edit skill ${skill.id}`}
                              onClick={() => methods.openEditModal(skill)}
                            >
                              <LuPencil size={16} />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300"
                              aria-label={`Delete skill ${skill.id}`}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillsPage;

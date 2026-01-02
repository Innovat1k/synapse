import { LuSearch, LuPlus, LuFilter } from "react-icons/lu";
import { useSkillsList } from "../SkillsListPage/hooks/useSkillsList";
import { useSkillModal } from "../../shared/components/SkillFormModal/hooks/useSkillModal/useSkillModal";
import SkillFormModal from "../../shared/components/SkillFormModal/components/SkillFormModal";
import SkillsTable from "./components/SkillsTable";
import SkillsCard from "./components/SkillsCard";
import { useOutletContext } from "react-router-dom";

const CATEGORIES = ["all skills", "backend", "devOps", "frontend", "others"];

const SkillsListPage = () => {
  const { skills, isLoading } = useOutletContext();
  const { skillsCategory, search, sortStates, handleSort } =
    useSkillsList(skills);
  const { modal, isSubmitting, selectedSkill, methods } = useSkillModal();

  return (
    <>
      <SkillFormModal
        isOpened={modal.isModalOpen}
        initialData={selectedSkill}
        isSubmitting={isSubmitting}
        mode={modal.modalMode}
        onClose={methods.closeModal}
        onDelete={methods.handleDelete}
        onSubmit={methods.handleSaveSkill}
      />

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
              {/* Desktop layout table */}
              <SkillsTable
                skills={search.filteredSkills}
                isLoading={isLoading}
                methods={methods}
                sortStates={sortStates}
                handleSort={handleSort}
              />

              {/* Mobile layout card */}
              <SkillsCard
                isLoading={isLoading}
                skills={search.filteredSkills}
                methods={methods}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillsListPage;

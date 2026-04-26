import { LuSearch, LuPlus, LuFilter, LuBookOpen } from "react-icons/lu";
import { useSkillsList } from "../SkillsListPage/hooks/useSkillsList";
import { useSkillModal } from "@shared/components/SkillFormModal/hooks/useSkillModal";
import SkillFormModal from "@shared/components/SkillFormModal/SkillFormModal";
import SkillsTable from "./components/SkillsTable";
import SkillsCard from "./components/SkillsCard";
import { useOutletContext } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

const CATEGORIES = ["all skills", "backend", "devOps", "frontend", "others"];

const SkillsListPage = () => {
  const { skills, isLoading } = useOutletContext();
  const { skillsCategory, search, sortStates, handleSort } =
    useSkillsList(skills);
  const { modal, isSubmitting, selectedSkill, methods } = useSkillModal();

  return (
    <>
      <AnimatePresence>
        {modal.isModalOpen && (
          <SkillFormModal
            isOpened={true}
            initialData={selectedSkill}
            isSubmitting={isSubmitting}
            mode={modal.modalMode}
            onClose={methods.closeModal}
            onDelete={methods.handleDelete}
            onSubmit={methods.handleSaveSkill}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0a0e1a] text-slate-50 p-2 md:p-6 transition-colors duration-500">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">
            Skill Management
          </h1>

          <div
            className="flex items-center gap-2 bg-[#1a2332] px-3 py-1 rounded-full border border-slate-800/50 shadow-sm transition-all hover:border-cyan-500/30"
            data-testid="skill-count-badge"
          >
            <LuBookOpen size={14} className="text-cyan-400" />
            {isLoading ? (
              <div className="h-4 w-6 bg-slate-800 animate-pulse rounded" />
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {search.filteredSkills.length}
              </span>
            )}
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by Name..."
                className="w-full px-4 py-2.5 pl-10 bg-[#0f1420] border border-slate-800/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all"
                value={search.searchTerm}
                onChange={(e) => search.setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <select
                className="w-full sm:w-48 px-4 py-2.5 pl-10 pr-10 bg-[#0f1420] border border-slate-800/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 capitalize cursor-pointer appearance-none"
                value={skillsCategory.activeCategory}
                onChange={(e) =>
                  skillsCategory.setActiveCategory(e.target.value)
                }
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-[#0f1420] text-slate-100"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-800/50 pl-2">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[5px] border-t-slate-500" />
              </div>
            </div>
          </div>

          {/* Add Skill Button */}
          <button
            onClick={methods.openCreateModal}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs capitalize tracking-widest bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <LuPlus size={18} />
            <span>Add new skill</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-[#0f1420]/80 backdrop-blur-md rounded-xl border border-slate-800/50 overflow-hidden shadow-2xl">
          {search.filteredSkills.length === 0 && !isLoading ? (
            skills.length === 0 ? (
              // STATE 1: No skills in database yet
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="p-16 text-center flex flex-col items-center justify-center"
                role="status"
                aria-live="polite"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="inline-flex p-4 rounded-full bg-[#1a2332] border border-slate-800/50 mb-4"
                >
                  <LuPlus size={32} className="text-cyan-400" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="text-slate-300 font-medium text-lg mb-2"
                >
                  No skills registered yet
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-slate-500 text-sm mb-6 max-w-xs"
                >
                  Start by adding your first skill to see it here.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  onClick={methods.openCreateModal}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <LuPlus size={16} />
                  Add a skill
                </motion.button>
              </motion.div>
            ) : search.searchTerm ? (
              // STATE 2: Search returned no results
              <AnimatePresence mode="wait">
                <motion.div
                  key="search-empty-state"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="p-16 text-center flex flex-col items-center justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline-flex p-4 rounded-full bg-[#1a2332] border border-slate-800/50 mb-4"
                  >
                    <LuSearch size={32} className="text-slate-600" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-slate-400 font-medium mb-2"
                  >
                    No results for "{search.searchTerm}"
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-slate-500 text-sm mb-4"
                  >
                    Try adjusting your search terms.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    onClick={() => search.setSearchTerm("")}
                    className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors cursor-pointer underline underline-offset-4"
                  >
                    Clear search
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            ) : skillsCategory.activeCategory !== "all skills" ? (
              // STATE 3: Category filter returned no results
              <AnimatePresence mode="wait">
                <motion.div
                  key="filter-empty-state"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="p-16 text-center flex flex-col items-center justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline-flex p-4 rounded-full bg-[#1a2332] border border-slate-800/50 mb-4"
                  >
                    <LuFilter size={32} className="text-slate-600" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-slate-400 font-medium mb-2"
                  >
                    No skills in "{skillsCategory.activeCategory}"
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-slate-500 text-sm mb-4"
                  >
                    Try selecting a different category.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    onClick={() =>
                      skillsCategory.setActiveCategory("all skills")
                    }
                    className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors cursor-pointer underline underline-offset-4"
                  >
                    Show all skills
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            ) : (
              // STATE 4: Combined filters returned no results (fallback)
              <AnimatePresence mode="wait">
                <motion.div
                  key="combined-empty-state"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="p-16 text-center flex flex-col items-center justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline-flex p-4 rounded-full bg-[#1a2332] border border-slate-800/50 mb-4"
                  >
                    <LuFilter size={32} className="text-slate-600" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-slate-400 font-medium mb-4"
                  >
                    No results match your current filters.
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    onClick={() => {
                      search.setSearchTerm("");
                      skillsCategory.setActiveCategory("all skills");
                    }}
                    className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors cursor-pointer underline underline-offset-4"
                  >
                    Reset all filters
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            )
          ) : (
            <motion.div
              key="data-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <SkillsTable
                skills={search.filteredSkills}
                isLoading={isLoading}
                methods={methods}
                sortStates={sortStates}
                handleSort={handleSort}
              />
              <SkillsCard
                isLoading={isLoading}
                skills={search.filteredSkills}
                methods={methods}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default SkillsListPage;

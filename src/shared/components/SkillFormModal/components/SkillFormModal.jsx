import { LuX, LuPlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { useSkillForm } from "../hooks/useSkillForm/useSkillForm";
import ButtonSpinner from "../../ButtonSpinner";

const SkillFormModal = ({
  initialData,
  isSubmitting,
  mode,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const { skillFormData, newTag, methods } = useSkillForm({
    initialData,
    mode,
    onClose,
    onSubmit,
  });

  const inputClass =
    "w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/70 transition-colors duration-200";

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={methods.handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      data-testid="modal-overlay"
    >
      {/* Creation and Update skill modal */}
      {mode !== "delete" ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-800/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-teal-400/5 to-transparent pointer-events-none opacity-30"></div>

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-slate-100" id="modal-title">
                {mode === "create" ? "Add New Skill" : "Edit Skill"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in the details to {mode === "create" ? "add" : "update"}{" "}
                your skill.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <LuX size={20} />
            </button>
          </div>

          <form
            onSubmit={methods.handleSubmit}
            className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Colonne gauche */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. React Development"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                  value={skillFormData.name}
                  onChange={methods.handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                  htmlFor="category"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="e.g. Frontend"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                  value={skillFormData.category}
                  onChange={methods.handleChange}
                  required
                />
              </div>

              {/* Level */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-300 mb-3"
                  htmlFor="level"
                >
                  Level:{" "}
                  <span className="font-bold text-teal-400">
                    {skillFormData.level}
                  </span>
                  /5
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">1</span>
                  <input
                    id="level"
                    type="range"
                    min="1"
                    max="5"
                    value={skillFormData.level}
                    onChange={methods.handleChange}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-400 [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <span className="text-xs text-slate-500">5</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                  htmlFor="tags"
                >
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id="tags"
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none transition"
                    value={newTag}
                    onChange={methods.handleChangeTag}
                    onKeyUp={(e) => e.key === "Enter" && methods.handleAddTag()}
                  />
                  <button
                    type="button"
                    onClick={methods.handleAddTag}
                    className="px-3 py-2.5 bg-teal-400 hover:bg-teal-500 text-black rounded-lg flex items-center justify-center transition-colors"
                    aria-label="Add tag"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" data-testid="skill tags">
                  {skillFormData.tags.length > 0 &&
                    skillFormData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 bg-slate-800/50 rounded-full text-xs text-slate-200 gap-1 border border-slate-700/50"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => methods.handleRemoveTag(tag)}
                          className="text-slate-400 hover:text-red-400 transition-colors"
                          aria-label={`Remove tag ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Left collumn */}
            <div className="space-y-5">
              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your skill..."
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                  rows={8}
                  value={skillFormData.description}
                  onChange={methods.handleChange}
                ></textarea>
              </div>
            </div>

            {/* Action buttons */}
            <div className="lg:col-span-2 flex justify-end gap-3 pt-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <ButtonSpinner
                    label={mode === "create" ? "Creating..." : "Saving..."}
                  />
                ) : mode === "create" ? (
                  "Save Skill"
                ) : (
                  "Update Skill"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-delete"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl border border-red-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-lg"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-red-500/5 to-transparent pointer-events-none opacity-40"></div>

          <div className="flex items-start justify-between gap-2 mb-4">
            <h2
              className="text-lg sm:text-xl font-bold text-slate-100 truncate"
              id="modal-title-delete"
            >
              Confirm Deletion
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 flex-shrink-0 transition-colors"
              aria-label="Close modal"
            >
              <LuX size={20} />
            </button>
          </div>

          <p className="text-slate-300 mb-6 text-sm sm:text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-100 capitalize break-words">
              "{initialData.name}"
            </span>
            ?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {isSubmitting ? (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/80 text-white rounded-lg text-sm sm:text-base w-full sm:flex-1 cursor-not-allowed"
              >
                <ButtonSpinner
                  color="border-white"
                  label="Deleting skill..."
                  labelColor="text-white"
                  inline={true}
                />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(initialData)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                >
                  Delete permanently
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SkillFormModal;

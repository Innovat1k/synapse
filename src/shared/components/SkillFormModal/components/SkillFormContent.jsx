import { LuPlus, LuTriangleAlert } from "react-icons/lu";
import SelectInput from "../../ActivityFormModal/components/SelectInput";
import ButtonSpinner from "../../ButtonSpinner";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

// Sub-component: Skill Form Content (Create/Edit)
const SkillFormContent = ({
  skillFormData,
  newTag,
  tracks,
  isLoadingTracks,
  hasAssociatedData,
  initialTrackId,
  mode,
  isSubmitting,
  methods,
  createForm,
  onClose,
}) => {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-transparent via-cyan-400/5 to-transparent pointer-events-none opacity-30" />

      <form
        onSubmit={methods.handleSubmit}
        className="p-2 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left column */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="e.g. React Development"
              className="w-full px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200"
              value={skillFormData.name}
              onChange={methods.handleChange}
              required
              ref={methods.skillNameRef}
            />
          </div>

          {/* Learning Track */}
          <div className="flex flex-col">
            {isLoadingTracks ? (
              <div className="flex items-center gap-3 w-full px-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <span className="text-sm text-slate-500 italic">
                  Loading tracks...
                </span>
              </div>
            ) : tracks.length === 0 ? (
              <>
                <span className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  Learning Track
                </span>
                <div className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg group">
                  <span className="text-sm text-slate-500">
                    No tracks available
                  </span>
                  <button
                    type="button"
                    onClick={createForm.open}
                    className="text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/40">
                      + Create
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <SelectInput
                  label="Learning Track"
                  id="track_id"
                  value={skillFormData.track_id}
                  onChange={methods.handleChangeTrack}
                  options={tracks.map((t) => ({
                    value: t.track_id,
                    label: t.title,
                  }))}
                  placeholder="Select a track..."
                  disabled={isSubmitting}
                />

                <AnimatePresence mode="wait">
                  {mode === "edit" &&
                    hasAssociatedData &&
                    skillFormData.track_id !== initialTrackId && (
                      <motion.div
                        className="mt-3 p-3 bg-cyan-500/10 border-l-2 border-cyan-400 rounded-r-lg flex items-center gap-3 shadow-lg shadow-cyan-500/10"
                        initial={{ opacity: 0, height: 0, x: -10 }}
                        animate={{ opacity: 1, height: "auto", x: 0 }}
                        exit={{ opacity: 0, height: 0, x: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <LuTriangleAlert
                          size={16}
                          className="text-cyan-400 shrink-0"
                        />
                        <p className="text-xs text-slate-300 leading-tight">
                          <span className="font-bold text-cyan-400 uppercase tracking-widest mr-1">
                            Structural Change:
                          </span>
                          This will re-map all associated activities and links
                          within the{" "}
                          <span className="text-cyan-300 font-medium">
                            knowledge graph
                          </span>
                          .
                        </p>
                      </motion.div>
                    )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              placeholder="e.g. Frontend"
              className="w-full px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200"
              value={skillFormData.category}
              onChange={methods.handleChange}
              required
              data-testid="category-input"
            />
          </div>

          {/* Level */}
          <div>
            <label
              className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest"
              htmlFor="level"
            >
              Level:{" "}
              <span className="font-black text-cyan-400 text-base">
                {skillFormData.level}
              </span>
              /5
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 font-medium w-4">1</span>
              <input
                id="level"
                type="range"
                min="1"
                max="5"
                value={skillFormData.level}
                onChange={methods.handleChange}
                className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-300 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-cyan-300 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
              />
              <span className="text-xs text-slate-500 font-medium w-4">5</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Tags */}
          <div>
            <label
              className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
              htmlFor="tags"
            >
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                id="tags"
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200"
                value={newTag}
                onChange={methods.handleChangeTag}
                onKeyUp={(e) => e.key === "Enter" && methods.handleAddTag()}
              />
              <button
                type="button"
                onClick={methods.handleAddTag}
                className="px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-200 font-bold cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20"
                aria-label="Add tag"
              >
                <LuPlus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2" data-testid="skill-tags">
              {skillFormData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs font-medium text-slate-200 gap-2 border border-slate-700/50 hover:border-slate-700 transition-all duration-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => methods.handleRemoveTag(tag)}
                    className="text-slate-500 hover:text-rose-400 transition-colors duration-200 font-bold"
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your skill..."
              className="w-full px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200 resize-none"
              rows={8}
              value={skillFormData.description}
              onChange={methods.handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-slate-800/50 order-2 md:order-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-bold shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 order-1 md:order-2"
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
    </div>
  );
};

export default SkillFormContent;

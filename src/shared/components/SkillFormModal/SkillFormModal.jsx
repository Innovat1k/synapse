import { LuPlus, LuTriangleAlert } from "react-icons/lu";
import { useSkillForm } from "./hooks/useSkillForm";
import ButtonSpinner from "../ButtonSpinner";
import { useRef } from "react";
import { TrackFormModal } from "../TrackFormModal/TrackFormModal";
import { useTracks } from "../../../pages/Settings/app/tracks/hooks/useTracks";
import SelectInput from "../ActivityFormModal/components/SelectInput";
import { Modal } from "@shared/components/Modal/Modal";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

const SkillFormModal = ({
  isOpened,
  initialData,
  isSubmitting,
  mode,
  onClose,
  onDelete,
  onSubmit,
}) => {
  const {
    skillFormData,
    newTag,
    tracks,
    initialTrackId,
    hasAssociatedData,
    isLoadingTracks,
    methods,
  } = useSkillForm({
    initialData,
    mode,
    onClose,
    onSubmit,
    isOpened,
  });

  const { status, createForm, actions } = useTracks();
  const skillNameRef = useRef(null);

  const isDeleteMode = mode === "delete";

  return (
    <>
      <Modal
        isOpened={isOpened}
        onClose={onClose}
        title={
          isDeleteMode
            ? "Confirm Deletion"
            : mode === "create"
              ? "Add New Skill"
              : "Edit Skill"
        }
        description={
          isDeleteMode
            ? ""
            : `Fill in the details to ${mode === "create" ? "add" : "update"} your skill.`
        }
        size={isDeleteMode ? "sm" : "xl"}
        initialFocusRef={skillNameRef}
        dataTestId="skill-modal"
      >
        {isDeleteMode ? (
          /* --- STYLE INITIAL : DELETE --- */
          <div className="relative">
            <p className="text-slate-300 mb-6 text-sm sm:text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-100 capitalize">
                "{initialData?.name}"
              </span>
              ?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
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
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base shadow-[0_0_12px_rgba(239,68,68,0.2)]"
              >
                {isSubmitting ? (
                  <ButtonSpinner label="Deleting..." inline />
                ) : (
                  "Delete permanently"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* --- STYLE INITIAL : FORMULAIRE --- */
          <form
            onSubmit={methods.handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left column */}
            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  ref={skillNameRef}
                  type="text"
                  id="name"
                  placeholder="e.g. React Development"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition"
                  value={skillFormData.name}
                  onChange={methods.handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                {tracks.length === 0 && (
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Learning Track
                  </label>
                )}
                {isLoadingTracks ? (
                  <div className="flex items-center gap-3 w-full px-4 py-2.5 bg-slate-800/30 border border-slate-700/50 rounded-lg animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                    <span className="text-sm text-slate-500/60 italic">
                      Loading tracks...
                    </span>
                  </div>
                ) : tracks.length === 0 ? (
                  <div className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg group">
                    <span className="text-sm text-slate-400">
                      No tracks available
                    </span>
                    <button
                      type="button"
                      onClick={createForm.open}
                      className="text-[10px] font-bold uppercase tracking-wider text-teal-400 hover:text-teal-300 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 group-hover:border-teal-500/40">
                        + Create
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <SelectInput
                      id="track_id"
                      value={skillFormData.track_id}
                      onChange={methods.handleChangeTrack}
                      options={tracks.map((t) => ({
                        value: t.track_id,
                        label: t.title,
                      }))}
                      placeholder="Select a track..."
                      disabled={isSubmitting}
                      label="Learning Track"
                    />
                    <AnimatePresence>
                      {mode === "edit" &&
                        hasAssociatedData &&
                        skillFormData.track_id !== initialTrackId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-2.5 bg-slate-900/60 border-l-2 border-teal-500 rounded-r-md flex items-center gap-3 shadow-lg"
                          >
                            <LuTriangleAlert
                              size={14}
                              className="text-teal-400 shrink-0"
                            />
                            <p className="text-[11px] text-slate-300 leading-tight">
                              <span className="font-bold text-teal-400 uppercase tracking-tight mr-1">
                                Structural Change:
                              </span>
                              This will re-map all associated activities and
                              links within the knowledge graph.
                            </p>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </>
                )}
              </div>

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
                  data-testid="category-input"
                />
              </div>

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
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <span className="text-xs text-slate-500">5</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
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
                    aria-label="Add tag"
                    onClick={methods.handleAddTag}
                    className="px-3 py-2.5 bg-teal-400 hover:bg-teal-500 text-black rounded-lg flex items-center justify-center transition-colors"
                  >
                    <LuPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" data-testid="skill-tags">
                  {skillFormData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 bg-slate-800/50 rounded-full text-xs text-slate-200 gap-1 border border-slate-700/50"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => methods.handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

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
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition resize-none custom-scrollbar"
                  rows={8}
                  value={skillFormData.description}
                  onChange={methods.handleChange}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800/50">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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
        )}
      </Modal>

      <AnimatePresence>
        {createForm.isOpen && (
          <TrackFormModal
            isOpened={true}
            key="track"
            mode="create"
            onSubmit={actions.create}
            onClose={createForm.close}
            isLoading={status.isCreating}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillFormModal;

import { ResourceForm } from "../../components/ResourceForm/ResourceForm";
import { TrackList } from "./components/TrackList";
import {
  LuPlus,
  LuX,
  LuLayers,
  LuCircleAlert,
  LuArrowLeft,
} from "react-icons/lu";
import ButtonSpinner from "@shared/components/ButtonSpinner";
import { useTracks } from "./hooks/useTracks";
import { useResourceForm } from "../../components/ResourceForm/hooks/useResourceForm";
import { ConfirmDeleteTrack } from "./components/ConfirmDeleteTrack";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export const TracksPage = () => {
  const { data, status, createForm, deleteModal, actions } = useTracks();

  const { state, methods, categories } = useResourceForm({
    onSubmit: actions.create,
  });

  if (status.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <ButtonSpinner
          color="border-cyan-500"
          label="Loading your ecosystem..."
          labelColor="text-slate-500"
          inline={false}
        />
      </div>
    );
  }

  if (data.isError) {
    return (
      <div className="m-4 p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-rose-400">
        <LuCircleAlert className="shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-white">Connection Error</h3>
          <p className="text-sm opacity-80">{data.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          {/* Back Button */}
          <Link
            to="/settings"
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-400 
                   hover:text-cyan-400 hover:bg-slate-800/50 
                   rounded-lg border border-transparent hover:border-slate-700/50 
                   transition-all group w-fit shrink-0"
            aria-label="Go back to Settings"
          >
            <LuArrowLeft
              className="group-hover:-translate-x-0.5 transition-transform"
              size={18}
            />
            <span className="font-medium hidden sm:inline">Back</span>
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50 capitalize tracking-tight">
              Learning Tracks
            </h1>
            <p className="text-sm text-slate-400 mt-1 sm:mt-2 max-w-2xl">
              Organize your skill ecosystem into structured thematic paths.
            </p>
          </div>
        </div>

        {!createForm.isOpen && (
          <button
            onClick={createForm.open}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer"
            type="button"
          >
            <LuPlus size={20} />
            <span>New Track</span>
          </button>
        )}
      </header>

      <AnimatePresence>
        {createForm.isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden bg-slate-900/60 border border-slate-800/50 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-900/40">
              <h2 className="font-bold text-slate-100 text-base">
                Configure New Track
              </h2>
              <button
                onClick={createForm.close}
                className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all duration-200 cursor-pointer"
                aria-label="Close track form"
              >
                <LuX size={18} />
              </button>
            </div>
            <div className="p-8">
              <ResourceForm
                title={state.title}
                category={state.category}
                generatedId={state.generatedId}
                categories={categories}
                onTitleChange={methods.setTitle}
                onCategoryChange={methods.setCategory}
                onSubmit={methods.handleSubmit}
                isSubmitting={status.isCreating}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        {data.tracks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800/50 rounded-xl px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-slate-800/40 text-slate-600 mb-4 ring-1 ring-slate-700/50">
              <LuLayers size={28} />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">
              No tracks established
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-60 mx-auto leading-relaxed">
              Your learning ecosystem is currently empty. Start by creating a
              thematic track.
            </p>
            <button
              onClick={createForm.open}
              className="mt-6 text-cyan-400 hover:text-cyan-300 font-bold text-sm underline underline-offset-2 decoration-cyan-500/30 hover:decoration-cyan-500/50 transition-all duration-200 cursor-pointer"
              type="button"
            >
              Initialize first track
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden sm:flex items-center justify-between px-4 text-xs uppercase font-bold tracking-widest text-slate-600">
              <span>Active Infrastructure ({data.tracks.length})</span>
              <span>Completion Status</span>
            </div>
            <TrackList tracks={data.tracks} onDelete={deleteModal.open} />
          </div>
        )}

        <AnimatePresence>
          {deleteModal.isOpen && (
            <ConfirmDeleteTrack
              isOpen={deleteModal.isOpen}
              onClose={deleteModal.close}
              onConfirm={actions.delete}
              trackTitle={deleteModal.context.trackTitle}
              isLoading={status.isDeleting}
              confirmLabel="Delete Track"
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

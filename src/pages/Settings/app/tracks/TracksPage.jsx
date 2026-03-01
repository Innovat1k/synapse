import { ResourceForm } from "../../components/ResourceForm/ResourceForm";
import { TrackList } from "./components/TrackList";
import { LuPlus, LuX, LuLayers, LuCircleAlert } from "react-icons/lu";
import ButtonSpinner from "@shared/components/ButtonSpinner";
import { useTracksPage } from "./hooks/useTracks";
import { useResourceForm } from "../../components/ResourceForm/hooks/useResourceForm";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const TracksPage = () => {
  const { config, loader, form, handleCreate } = useTracksPage();
  const { state, methods, categories } = useResourceForm({
    onSubmit: handleCreate,
  });

  if (loader.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <ButtonSpinner
          color="border-teal-500"
          label="Loading your ecosystem..."
          labelColor="text-slate-500"
          inline={false}
        />
      </div>
    );
  }

  if (config.isError) {
    return (
      <div className="m-4 p-4 md:p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-red-400">
        <LuCircleAlert className="shrink-0" size={24} />
        <div>
          <h3 className="font-bold text-white">Connection Error</h3>
          <p className="text-sm opacity-80">{config.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-24">
      {/* HEADER : Adaptatif */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-500/80">
            <LuLayers size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Architecture
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-50">
            Learning Tracks
          </h1>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Organize your skill ecosystem into structured thematic paths.
          </p>
        </div>

        {/* Button : Pleine largeur sur mobile, auto sur desktop */}
        {!form.isFormOpen && (
          <button
            onClick={form.openForm}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all active:scale-[0.97] shadow-lg shadow-teal-500/10 cursor-pointer"
            type="button"
          >
            <LuPlus size={20} />
            <span>New Track</span>
          </button>
        )}
      </header>

      {/* ZONE FORMULAIRE : Full screen-ish sur mobile */}
      <AnimatePresence>
        {form.isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800/50 bg-slate-900/40">
              <h2 className="font-bold text-slate-100 text-sm md:text-base">
                Configure New Track
              </h2>
              <button
                onClick={form.closeForm}
                className="p-2 text-slate-500 hover:text-white bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
                aria-label="Close track form"
              >
                <LuX size={18} />
              </button>
            </div>
            <div className="p-4 md:p-8">
              <ResourceForm
                title={state.title}
                category={state.category}
                generatedId={state.generatedId}
                categories={categories}
                onTitleChange={methods.setTitle}
                onCategoryChange={methods.setCategory}
                onSubmit={methods.handleSubmit}
                isSubmitting={loader.isCreating}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LISTE OU EMPTY STATE */}
      <section>
        {config.tracks.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-slate-700 mb-4">
              <LuLayers size={28} />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-300">
              No tracks established
            </h3>
            <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-[240px] mx-auto leading-relaxed">
              Your learning ecosystem is currently empty. Start by creating a
              thematic track.
            </p>
            <button
              onClick={form.openForm}
              className="mt-6 text-teal-400 hover:text-teal-300 font-bold text-sm underline underline-offset-8 decoration-teal-500/30 transition-all cursor-pointer"
              type="button"
            >
              Initialize first track
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden sm:flex items-center justify-between px-4 text-[10px] uppercase font-bold tracking-widest text-slate-600">
              <span>Active Infrastructure ({config.tracks.length})</span>
              <span>Completion Status</span>
            </div>
            <TrackList tracks={config.tracks} />
          </div>
        )}
      </section>
    </div>
  );
};

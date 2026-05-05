import {
  LuArrowLeft,
  LuDownload,
  LuTrash2,
  LuTriangleAlert,
} from "react-icons/lu";
import { Modal } from "@shared/components/ui/Modal/Modal";
import { useDataExport } from "./hooks/useDataExport";
import { useDataPurge } from "./hooks/useDataPurge";
import ButtonSpinner from "@shared/components/ui/ButtonSpinner";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery";
import { useAllActivitiesQuery } from "@shared/hooks/useActivitiesQuery";
import { useTracksQuery } from "@shared/hooks/useTracksQuery";
import { useIsOnline } from "@shared/components/utils/NetworkStatus/hooks/useNetworkStatus";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const DataPrivacyPage = () => {
  const { isExporting, handleExport } = useDataExport();
  const { isResetModalOpen, isDeleting, setIsResetModalOpen, handleReset } =
    useDataPurge();

  const { skills, isLoading: isLoadingSkills } = useSkillsQuery();
  const { activities, isLoading: isLoadingActivities } =
    useAllActivitiesQuery();
  const { tracks, isLoading: isLoadingTracks } = useTracksQuery();

  const isLoading = isLoadingSkills || isLoadingActivities || isLoadingTracks;

  const isDataEmpty =
    !isLoading &&
    skills.length === 0 &&
    activities.length === 0 &&
    tracks.length === 0;

  const isOnline = useIsOnline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <header className="mb-12 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          {/* Back Button – Desktop only (mobile has it in header) */}
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

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-50 capitalize tracking-tight">
              Data & Privacy
            </h1>
            <p className="text-sm text-slate-400 mt-1 sm:mt-2 max-w-2xl">
              Manage your data, export or delete your account information.
            </p>
          </div>
        </div>
      </header>

      {/* Export Data */}
      <div className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-lg ring-1 ring-cyan-500/20">
            <LuDownload className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Export Your Data
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Download all your skills, activities, tracks, and progress as a
              JSON file. This includes all your learning data and analytics.
            </p>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm cursor-pointer active:scale-95"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <LuDownload size={18} />
                  <span>Download My Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Data */}
      <div className="p-6 bg-slate-900/50 border border-rose-900/30 rounded-xl hover:border-rose-900/50 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 rounded-lg ring-1 ring-rose-500/20">
            <LuTrash2 className="w-6 h-6 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-rose-400 mb-2">
              Delete All Data
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Permanently delete all your skills, activities, tracks, and
              progress. This action cannot be undone and will reset your entire
              learning history.
            </p>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              disabled={isDataEmpty || !isOnline}
              className={`flex items-center gap-2 text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isDataEmpty
                  ? "bg-slate-800/50 text-slate-500"
                  : "bg-rose-600 hover:bg-rose-700 active:scale-95"
              }`}
            >
              <LuTrash2 size={18} />
              <span>Delete All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warning Card */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <LuTriangleAlert className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-1 uppercase tracking-widest">
              Important
            </h4>
            <p className="text-amber-200/80 text-sm">
              Deleting your data will permanently delete everything. Make sure
              to export your data first if you want to keep a backup.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <Modal
            isOpened={isResetModalOpen}
            onClose={() => setIsResetModalOpen(false)}
            title="Delete All Data?"
          >
            <div className="relative space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed">
                This will permanently delete all your skills, activities,
                tracks, and progress. This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 px-6 py-2.5 order-2 md:order-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 rounded-lg transition-colors duration-200 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 sm:flex-none order-1 md:order-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 font-bold text-sm cursor-pointer active:scale-95"
                >
                  {isDeleting ? (
                    <ButtonSpinner label="Deleting data..." />
                  ) : (
                    "Yes, Delete Everything"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DataPrivacyPage;

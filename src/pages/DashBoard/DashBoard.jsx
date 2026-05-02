import React, { Suspense, useState } from "react";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import {
  LuCirclePlus,
  LuBookOpen,
  LuMaximize2,
  LuLayoutDashboard,
  LuNetwork,
} from "react-icons/lu";
import { Link } from "react-router-dom";

import { Modal } from "@shared/components/ui/Modal/Modal";
import ButtonSpinner from "@shared/components/ui/ButtonSpinner";

import Card from "./components/Card";
import CurrentFocus from "./components/CurrentFocus/CurrentFocus";
import KeyMetrics from "./components/KeyMetrics/KeyMetrics";
import WeeklyProgress from "./components/WeeklyProgress/WeeklyProgress";
import ActivityTimeline from "./components/ActivityTimeline/ActivityTimeline";
import DailyActivity from "./components/DailyActivity/DailyActivity";
import { SkillsGrid } from "./components/SkillsGrid";
import { TrackSelector } from "./components/TrackSelector";
import { CategorySelector } from "./components/CategorySelector";
import { DashboardGraph } from "./components/DashboardGraph/DashboardGraph";

import { useActivityModal } from "@shared/components/ui/ActivityFormModal/hooks/useActivityModal";
import { useSkillModal } from "@shared/components/ui/SkillFormModal/hooks/useSkillModal";

import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWeeklyProgress } from "./components/WeeklyProgress/hooks/useWeeklyProgress";
import { useRecentActivities } from "./components/ActivityTimeline/hooks/useRecentActivities";
import { useCurrentFocus } from "./components/CurrentFocus/hooks/useCurrentFocus";
import { useKeyMetrics } from "./components/KeyMetrics/hooks/useKeyMetrics";
import { useDailyActivity } from "./components/DailyActivity/hooks/useDailyActivity";

import ActivityFormModal from "@shared/components/ui/ActivityFormModal/ActivityFormModal";
import SkillFormModal from "@shared/components/ui/SkillFormModal/SkillFormModal";
import { containerVariants, itemVariants } from "@shared/utils/animations";

const Dashboard = () => {
  const [isFullscreenGraph, setIsFullscreenGraph] = useState(false);

  const { data, filtered, view, actions, isLoading } = useDashboardData();
  const activityModal = useActivityModal();
  const skillModal = useSkillModal();

  const FIXED_LIMIT = 5;
  const displayedSkills = filtered.skills.slice(0, FIXED_LIMIT);

  const { user, loader } = useAuth();

  const currentFocus = useCurrentFocus(user?.id, { daysBack: 7 });
  const recentActivities = useRecentActivities(user?.id, { limit: 5 });
  const keyMetrics = useKeyMetrics(user?.id);
  const dailyActivity = useDailyActivity(user?.id, { daysBack: 7 });
  const weeklyProgress = useWeeklyProgress(user?.id, {
    trackId: view.selectedTrackId !== "all" ? view.selectedTrackId : null,
  });

  if (loader.isInitialLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-[#0a0e1a]"
      >
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto relative z-10" />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {activityModal.modal.isOpened && (
          <ActivityFormModal
            mode={activityModal.modal.mode}
            isOpened={true}
            allSkills={data.skills}
            onSubmit={activityModal.methods.handleSaveActivity}
            closeModal={activityModal.methods.closeModal}
            isSubmitting={activityModal.isSubmitting}
            closeByOverlay={activityModal.methods.handleCloseOverlay}
            openSkillModal={skillModal.methods.openCreateModal}
            skill={activityModal.preselectedSkill}
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-[#0a0e1a] text-slate-100 p-4 md:p-0"
      >
        {/* Header */}
        <motion.header
          variants={itemVariants}
          className="flex justify-between items-center mb-10 px-1"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <LuLayoutDashboard className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-50">
                Dashboard
              </h1>
              <p className="text-sm font-bold text-slate-500 tracking-widest first-letter:capitalize">
                Your learning activity overview
              </p>
            </div>
          </div>
        </motion.header>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Column 1: Focus & Metrics */}
          <motion.div variants={itemVariants} className="space-y-8">
            <Card
              dataTestId="current-focus"
              className="relative overflow-hidden bg-[#0f1420]/80 border-slate-800/50 shadow-xl group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
              <CurrentFocus
                data={currentFocus.data}
                isLoading={currentFocus.isLoading}
                error={currentFocus.error}
                onLogActivity={(focusData) => {
                  const skillForModal = focusData
                    ? {
                        skill_id: focusData.skill_id,
                        name: focusData.skill_name,
                        track_title: focusData.track_title,
                      }
                    : null;
                  activityModal.methods.openCreateModal(skillForModal);
                }}
              />
            </Card>

            <Card
              className="bg-[#0f1420]/80 border-slate-800/50"
              title="Metrics"
            >
              <KeyMetrics
                data={keyMetrics.data}
                isLoading={keyMetrics.isLoading}
                error={keyMetrics.error}
              />
            </Card>
          </motion.div>

          {/* Column 2: Skills & Progress */}
          <motion.div
            variants={itemVariants}
            className="space-y-8 lg:col-span-1"
          >
            <Card
              className="flex flex-col bg-[#0f1420]/90 border-slate-800/50 shadow-2xl relative overflow-hidden group"
              title={view.currentTrack?.title || "All Skills"}
              dataTestId="skills"
              action={
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-[#1a2332] px-2.5 py-1 rounded-lg">
                    <LuBookOpen size={14} className="text-cyan-400" />
                    <span
                      className="text-sm font-bold text-slate-200"
                      data-testid="skills-count-badge"
                    >
                      {filtered.skills.length.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <button
                    onClick={skillModal.methods.openCreateModal}
                    className="flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-lg 
                   text-sm font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuCirclePlus size={18} />
                    <span className="hidden md:block">Add Skill</span>
                  </button>
                </div>
              }
            >
              {filtered.skills.length > 0 && (
                <div className="flex flex-col gap-5 mb-8 items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TrackSelector
                      tracks={data.tracks}
                      selectedTrackId={view.selectedTrackId}
                      onSelect={actions.selectTrack}
                      isLoading={isLoading}
                    />
                    <CategorySelector
                      categories={data.categories}
                      selectedCategory={view.selectedCategory}
                      onSelect={actions.selectCategory}
                    />
                  </div>

                  {(view.selectedTrackId !== "all" ||
                    view.selectedCategory !== "") && (
                    <button
                      onClick={() => {
                        actions.selectTrack("all");
                        actions.selectCategory("");
                      }}
                      className="text-xs text-slate-500 hover:text-cyan-400 font-bold uppercase tracking-widest transition-colors w-fit px-1 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}

              <div className="flex-1">
                <SkillsGrid skills={displayedSkills} isLoading={isLoading} />
              </div>
            </Card>

            <Card
              className="bg-[#0f1420]/80 border-slate-800/50 group"
              title="Weekly Progress"
            >
              <WeeklyProgress
                data={weeklyProgress.data || []}
                isLoading={weeklyProgress.isLoading}
                error={weeklyProgress.error}
              />
            </Card>

            <Card
              className="bg-[#0f1420]/80 border-slate-800/50 group"
              title="Daily Activity"
            >
              <DailyActivity
                data={dailyActivity.data}
                isLoading={dailyActivity.isLoading}
                error={dailyActivity.error}
              />
            </Card>
          </motion.div>

          {/* Column 3: Graph & Timeline */}
          <motion.div variants={itemVariants} className="space-y-8">
            <Card
              className="group bg-[#0f1420]/90 border-slate-800/50 shadow-2xl relative overflow-hidden"
              title="Knowledge Graph"
              dataTestId="knowledge-graph"
              action={
                <button
                  onClick={() => setIsFullscreenGraph(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold capitalize tracking-widest 
                  text-slate-300 hover:text-cyan-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30
                  rounded-lg transition-all duration-200 active:scale-95 group/btn cursor-pointer disabled:text-slate-600 disabled:bg-slate-900/40 disabled:border-slate-800 disabled:cursor-not-allowed disabled:active:scale-100"
                  disabled={filtered?.skills.length === 0}
                >
                  <span className="hidden sm:inline-block">Expand graph</span>
                  <LuMaximize2
                    size={16}
                    className="group-hover/btn:scale-110 group-hover/btn:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] 
                    transition-transform duration-200 disabled:opacity-50 disabled:group-hover/btn:scale-100 disabled:group-hover/btn:drop-shadow-none"
                  />
                </button>
              }
            >
              {/* CONDITIONAL – Empty State OR Graph */}
              {filtered?.skills.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-center p-6 relative rounded-lg overflow-hidden bg-[#0a0e1a]/60 border border-slate-800/50 shadow-inner">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/50">
                      <LuNetwork className="text-slate-500" size={24} />
                    </div>

                    <motion.div
                      className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full scale-150 opacity-0 group-hover:opacity-100"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  <h3 className="text-base font-semibold text-slate-300 mb-1">
                    No skills to visualize
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add skills to see your knowledge network
                  </p>
                </div>
              ) : (
                <div className="h-80 relative rounded-lg overflow-hidden bg-[#0a0e1a]/60 border border-slate-800/50 shadow-inner group-hover:border-cyan-500/20 transition-all duration-300">
                  <DashboardGraph skills={data.skills} isCompact={true} />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </Card>

            <Card
              className="bg-[#0f1420]/80 border-slate-800/50 group"
              title="Activity Timeline"
            >
              <ActivityTimeline
                data={recentActivities.data || []}
                isLoading={recentActivities.isLoading}
                error={recentActivities.error}
              />
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {skillModal.modal.isModalOpen && (
          <SkillFormModal
            isOpened={true}
            mode={skillModal.modal.modalMode}
            isSubmitting={skillModal.isSubmitting}
            onClose={skillModal.methods.closeModal}
            onSubmit={skillModal.methods.handleSaveSkill}
          />
        )}

        {isFullscreenGraph && (
          <Modal
            isOpened={isFullscreenGraph}
            onClose={() => setIsFullscreenGraph(false)}
            title="Knowledge Network"
            description="Visualize the connections between your skills and tracks."
            size="full"
            dataTestId="knowledge-graph-modal"
          >
            <div className="flex flex-col h-full overflow-hidden bg-[#0a0e1a]">
              <div className="flex-1 relative">
                <DashboardGraph
                  isOpened={isFullscreenGraph}
                  onClose={() => setIsFullscreenGraph(false)}
                  skills={filtered.skills}
                  isCompact={false}
                  selectors={
                    <div className="flex items-center gap-4">
                      <TrackSelector
                        tracks={data.tracks}
                        selectedTrackId={view.selectedTrackId}
                        onSelect={actions.selectTrack}
                        size="sm"
                      />
                      <div className="w-px h-4 bg-slate-800" />
                      <CategorySelector
                        categories={data.categories}
                        selectedCategory={view.selectedCategory}
                        onSelect={actions.selectCategory}
                        size="md"
                      />
                      <div className="hidden md:block px-3 py-1 text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded uppercase tracking-widest">
                        {view.mode}
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;

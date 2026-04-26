import React, { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuCirclePlus,
  LuBookOpen,
  LuMaximize2,
  LuLayoutDashboard,
} from "react-icons/lu";
import { Link } from "react-router-dom";

import { Modal } from "@shared/components/Modal/Modal";
import ButtonSpinner from "@shared/components/ButtonSpinner";

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

import { useActivityModal } from "@shared/components/ActivityFormModal/hooks/useActivityModal";
import { useSkillModal } from "@shared/components/SkillFormModal/hooks/useSkillModal";

import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import { useWeeklyProgress } from "./components/WeeklyProgress/hooks/useWeeklyProgress";
import { useRecentActivities } from "./components/ActivityTimeline/hooks/useRecentActivities";
import { useCurrentFocus } from "./components/CurrentFocus/hooks/useCurrentFocus";
import { useKeyMetrics } from "./components/KeyMetrics/hooks/useKeyMetrics";
import { useDailyActivity } from "./components/DailyActivity/hooks/useDailyActivity";

import ActivityFormModal from "@shared/components/ActivityFormModal/ActivityFormModal";
import SkillFormModal from "@shared/components/SkillFormModal/SkillFormModal";
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

  // Loading state avec animation
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
      {/* Modals */}
      <ActivityFormModal
        mode={activityModal.modal.mode}
        isOpened={activityModal.modal.isOpened}
        allSkills={data.skills}
        onSubmit={activityModal.methods.handleSaveActivity}
        closeModal={activityModal.methods.closeModal}
        isSubmitting={activityModal.isSubmitting}
        closeByOverlay={activityModal.methods.handleCloseOverlay}
        openSkillModal={skillModal.methods.openCreateModal}
        skill={activityModal.preselectedSkill}
      />

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-[#0a0e1a] text-slate-100 p-2 md:p-6"
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
              <h1 className="text-2xl font-black tracking-tight text-slate-50 uppercase">
                Dashboard
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Neural Network Overview
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
              className="relative overflow-hidden bg-[#0f1420]/80 border-slate-800/50 shadow-xl"
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

            <Card className="bg-[#0f1420]/80 border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Key
                Metrics
              </h2>
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
            {/* Skills Card */}
            <Card
              className="flex flex-col bg-[#0f1420]/90 border-slate-800/50 shadow-2xl relative overflow-hidden"
              dataTestId="skills"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-4">
                  <h2 className="text-base font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
                    {view.currentTrack?.title || "All Skills"}
                  </h2>
                  <div
                    data-testid="skills-count-badge"
                    className="flex items-center gap-1.5 bg-[#1a2332] px-2.5 py-1 rounded-lg border border-slate-700/30 shadow-inner"
                  >
                    <LuBookOpen size={14} className="text-cyan-400 shrink-0" />
                    <span className="text-sm font-bold text-slate-200 tabular-nums">
                      {filtered.skills.length.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <button
                  className="flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={skillModal.methods.openCreateModal}
                >
                  <LuCirclePlus size={18} />
                  <span className="hidden md:block">Add Skill</span>
                </button>
              </div>

              {/* Skills Toolbar */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
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

              <div className="flex-1">
                <SkillsGrid skills={displayedSkills} isLoading={isLoading} />
              </div>
            </Card>

            {/* Weekly Progress */}
            <Card className="bg-[#0f1420]/80 border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
                Weekly Progress
              </h2>
              <WeeklyProgress
                data={weeklyProgress.data || []}
                isLoading={weeklyProgress.isLoading}
                error={weeklyProgress.error}
              />
            </Card>

            {/* Daily Activity */}
            <Card className="bg-[#0f1420]/80 border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
                Daily Activity
              </h2>
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
              dataTestId="knowledge-graph"
              className="group bg-[#0f1420]/90 border-slate-800/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/5 blur-[60px] pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 tracking-tight">
                  Knowledge Graph
                </h2>
                <button
                  onClick={() => setIsFullscreenGraph(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest 
                     text-slate-400 hover:text-cyan-400 
                     bg-slate-800/50 hover:bg-slate-800 
                     border border-slate-700/50 
                     rounded-lg transition-all active:scale-90 group/btn cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-slate-800/50 disabled:active:scale-100"
                  disabled={filtered?.skills.length === 0}
                >
                  <span className="hidden sm:inline-block">Expand graph</span>
                  <LuMaximize2
                    size={16}
                    className="group-hover/btn:scale-110 group-hover/btn:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-transform duration-200 disabled:group-hover/btn:scale-100 disabled:group-hover/btn:drop-shadow-none"
                  />
                </button>
              </div>

              <div className="h-80 relative rounded-lg overflow-hidden bg-[#0a0e1a]/60 border border-slate-800/50 shadow-inner group-hover:border-cyan-500/20 transition-all duration-300">
                <DashboardGraph skills={data.skills} isCompact={true} />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1a]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </Card>

            <Card className="bg-[#0f1420]/80 border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
                Activity Timeline
              </h2>
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

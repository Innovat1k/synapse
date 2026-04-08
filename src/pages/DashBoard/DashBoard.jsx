// /**
//  * Dashboard for rendering all widgets.
//  *
//  * Note: Widgets and charts are currently mocked with placeholder data.
//  * Implementation will be rolled out incrementally per development phase.
//  */

import {
  LuCirclePlus,
  LuCircleCheck,
  LuClock,
  LuArrowUpRight,
  LuBookOpen,
  LuMaximize2,
} from "react-icons/lu";
import CircularProgressChart from "@shared/components/CircularProgressChart/CircularProgressChart";
import Card from "./components/Card";
import ActivityItem from "./components/ActivityItem";
import MetricCard from "./components/MetricCard";
import SkillBadge from "./components/SkillBadge";
import WeeklyProgressChart from "./components/WeeklyProgressChart";
import { useActivityModal } from "@shared/components/ActivityFormModal/hooks/useActivityModal";
import { useSkillModal } from "@shared/components/SkillFormModal/hooks/useSkillModal";
import { useDashboardData } from "./hooks/useDashboardData";
import { TrackSelector } from "./components/TrackSelector";
import { SkillsGrid } from "./components/SkillsGrid";
import React, { Suspense, useState } from "react";
import { Modal } from "@shared/components/Modal/Modal";
import { CategorySelector } from "./components/CategorySelector";
import { AnimatePresence } from "framer-motion";
import { useInView } from "../../shared/hooks/useInView ";
import ButtonSpinner from "../../shared/components/ButtonSpinner";

const ActivityFormModal = React.lazy(
  () => import("@shared/components/ActivityFormModal/ActivityFormModal"),
);

const SkillFormModal = React.lazy(
  () => import("@shared/components/SkillFormModal/SkillFormModal"),
);

const DashboardGraph = React.lazy(() =>
  import("./components/DashboardGraph/DashboardGraph").then((module) => ({
    default: module.DashboardGraph,
  })),
);

const Dashboard = () => {
  const goals = [
    "Complete 'React Native' course",
    "Learn Supabase Auth",
    "Build portfolio website",
  ];

  const activityTimeline = [
    { text: "Logged 7 hours on React", time: "2h ago" },
    { text: "Increased SOL to React", time: "4h ago" },
    { text: "Increased SOL to level 3", time: "Yesterday" },
    { text: "Created 'Typoophy' skill", time: "Last week" },
  ];

  const [isFullscreenGraph, setIsFullscreenGraph] = useState(false);

  const { data, filtered, view, actions, isLoading } = useDashboardData();
  const activityModal = useActivityModal();
  const skillModal = useSkillModal();

  // Limit displayed skills - Full feature planned for Phase 5
  const FIXED_LIMIT = 5;
  const displayedSkills = filtered.skills.slice(0, FIXED_LIMIT);

  // Load on scroll
  const { ref, isInView } = useInView({
    rootMargin: "200px",
  });

  return (
    <>
      <Suspense>
        <ActivityFormModal
          mode={activityModal.modal.mode}
          isOpened={activityModal.modal.isOpened}
          allSkills={data.skills}
          onSubmit={activityModal.methods.handleSaveActivity}
          closeModal={activityModal.methods.closeModal}
          isSubmitting={activityModal.isSubmitting}
          closeByOverlay={activityModal.methods.handleCloseOverlay}
          openSkillModal={skillModal.methods.openCreateModal}
        />
      </Suspense>

      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            <Card dataTestId="current-focus">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Current Focus
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  {view.currentTrack?.title || "Select a track"}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <LuClock /> 2h ago
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <CircularProgressChart value={85} strokeWidth={5} />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Level 4/5</div>
                  <button
                    type="button"
                    className="mt-2 bg-teal-400 hover:bg-teal-500 text-slate-900 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
                    onClick={activityModal.methods.openCreateModal}
                  >
                    Log Activity
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-slate-100 mb-2">My Goals</h3>
              <ul className="space-y-2">
                {goals.map((goal, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <LuCircleCheck className="text-emerald-400 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Related Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {filtered.skills.slice(0, 8).map((skill) => (
                  <SkillBadge
                    key={skill.skill_id}
                    name={skill.name}
                    level={skill.level}
                    color="bg-slate-800/50 text-slate-200"
                  />
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Key Metrics
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard
                  title="Hours"
                  value="25"
                  subtitle="This week"
                  icon={<LuClock />}
                  color="text-teal-400"
                />
                <MetricCard
                  title="Projects Completed"
                  value="380"
                  subtitle="Total"
                  icon={<LuCircleCheck />}
                  color="text-emerald-400"
                />
                <MetricCard
                  title="SOL Level"
                  value="5"
                  subtitle="Out of 10"
                  icon={<LuArrowUpRight />}
                  color="text-amber-400"
                />
              </div>
            </Card>
          </div>

          {/* 🔥 Column 2 */}
          <div className="space-y-6">
            <Card
              className="flex flex-col border-slate-800/60 shadow-lg"
              dataTestId="skills"
            >
              {/* --- Header --- */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  {view.currentTrack?.title || "All Skills"}
                </h2>
                <div
                  data-testid="skills-count-badge"
                  className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800/40"
                >
                  <LuBookOpen
                    size={14}
                    className="text-slate-500 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm font-medium text-slate-200 tabular-nums"
                    data-testid="skill-count-badge"
                  >
                    {filtered.skills.length < 10
                      ? `0${filtered.skills.length}`
                      : filtered.skills.length}
                  </span>
                </div>

                <button
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-md"
                  onClick={skillModal.methods.openCreateModal}
                >
                  <LuCirclePlus size={18} />
                  Add Skill
                </button>
              </div>

              {/* --- Filter Toolbar --- */}
              <div className="flex flex-col gap-4 my-6">
                <div className="flex flex-wrap. items-center gap-3">
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

                {/* Quick Reset */}
                {(view.selectedTrackId !== "all" ||
                  view.selectedCategory !== "") && (
                  <button
                    onClick={() => {
                      actions.selectTrack("all");
                      actions.selectCategory("");
                    }}
                    className="text-xs text-slate-500 hover:text-teal-400 font-bold uppercase tracking-wider transition-colors ml-2 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* --- Grid Section --- */}
              <div className="flex-1">
                <SkillsGrid skills={displayedSkills} isLoading={isLoading} />
              </div>
            </Card>

            <Card>
              <WeeklyProgressChart />
            </Card>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Activity Timeline
              </h2>
              <div className="text-xs text-slate-500 mb-2">
                Planned for Phase 5
              </div>
              <div className="space-y-4">
                {activityTimeline.map((item, i) => (
                  <ActivityItem key={i} text={item.text} time={item.time} />
                ))}
              </div>
            </Card>

            <Card
              className="group transition-colors duration-500"
              dataTestId="knowledge-graph"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
                    Knowledge Graph
                  </h2>
                </div>
                <button
                  onClick={() => setIsFullscreenGraph(true)}
                  className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-tighter sm:tracking-[0.2em]
                text-slate-500 hover:text-teal-400 bg-transparent hover:bg-teal-500/5 backdrop-blur-sm rounded-md transition-all duration-300 ease-in-out group/btn cursor-pointer active:scale-90
                `}
                  aria-label="Expand graph to full screen"
                >
                  <span className="hidden sm:inline-block">Expand</span>

                  <LuMaximize2
                    className={`
                  transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:drop-shadow-[0_0_5px_rgba(20,184,166,0.8)]`}
                    size={13}
                  />
                </button>
              </div>

              <div
                ref={ref}
                className="h-75 relative rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800/50 shadow-inner"
              >
                {isInView && (
                  <Suspense
                    fallback={
                      <div className="flex w-full h-full items-center justify-center">
                        <ButtonSpinner
                          label="Loading graph"
                          labelColor="text-slate-400"
                          color="text-teal-600"
                        />
                      </div>
                    }
                  >
                    <DashboardGraph skills={data.skills} isCompact={true} />
                  </Suspense>
                )}

                {/*Discreet overlay to invite action on hover */}
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <Suspense>
          {skillModal.modal.isModalOpen && (
            <SkillFormModal
              isOpened={true}
              mode={skillModal.modal.modalMode}
              isSubmitting={skillModal.isSubmitting}
              onClose={skillModal.methods.closeModal}
              onSubmit={skillModal.methods.handleSaveSkill}
            />
          )}
        </Suspense>

        {isFullscreenGraph && (
          <Modal
            isOpened={isFullscreenGraph}
            onClose={() => setIsFullscreenGraph(false)}
            title="Knowledge Network"
            description="Visualize the connections between your skills and tracks."
            size="full"
            dataTestId="knowledge-graph-modal"
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 relative bg-slate-950/20">
                <DashboardGraph
                  isOpened={isFullscreenGraph}
                  onClose={() => setIsFullscreenGraph(false)}
                  skills={filtered.skills}
                  isCompact={false}
                  selectors={
                    <div className="flex items-center gap-6 sm:gap-2">
                      <TrackSelector
                        tracks={data.tracks}
                        selectedTrackId={view.selectedTrackId}
                        onSelect={actions.selectTrack}
                        size="sm"
                      />

                      {/*Separator hidden on mobile */}
                      <div className="hidden xs:block w-px h-4 bg-slate-800 mx-0.5" />

                      <CategorySelector
                        categories={data.categories}
                        selectedCategory={view.selectedCategory}
                        onSelect={actions.selectCategory}
                        size="md"
                      />

                      {/*Hidden mode on mobile to save space */}
                      <div className="hidden md:block px-2 py-1 text-[9px] font-black text-teal-500 border-l border-slate-800 ml-1">
                        {view.mode.toUpperCase()}
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

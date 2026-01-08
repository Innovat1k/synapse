/**
 * Dashboard for rendering all widgets.
 *
 * Note: Widgets and charts are currently mocked with placeholder data.
 * Implementation will be rolled out incrementally per development phase.
 */

import {
  LuCirclePlus,
  LuCircleCheck,
  LuClock,
  LuArrowUpRight,
  LuBookOpen,
} from "react-icons/lu";
import CircularProgressChart from "../../shared/components/CircularProgressChart/CircularProgressChart";
import Card from "../DashBoard/components/Card";
import ActivityItem from "../DashBoard/components/ActivityItem";
import MetricCard from "../DashBoard/components/MetricCard";
import SkillBadge from "../DashBoard/components/SkillBadge";
import WeeklyProgressChart from "./components/WeeklyProgressChart";
import ActivityFormModal from "../../shared/components/ActivityFormModal/ActivityFormModal";
import { useActivityModal } from "../../shared/components/ActivityFormModal/hooks/useActivityModal";
import { useSkillsQuery } from "../../shared/hooks/useSkillsQuery/useSkillsQuery";
import SkillFormModal from "../../shared/components/SkillFormModal/SkillFormModal";
import { useSkillModal } from "../../shared/components/SkillFormModal/hooks/useSkillModal";
import { AnimatePresence } from "framer-motion";

SkillFormModal;

const Dashboard = () => {
  const goals = [
    "Complete 'React Native' course",
    "Learn Supabase Auth",
    "Build portfolio website",
  ];

  // TODO: Replace mocked activity with real data in Phase 3
  const activityTimeline = [
    { text: "Logged 7 hours on React", time: "2h ago" },
    { text: "Increased SOL to React", time: "4h ago" },
    { text: "Increased SOL to level 3", time: "Yesterday" },
    { text: "Created 'Typoophy' skill", time: "Last week" },
  ];

  const { skills, isLoading } = useSkillsQuery();
  const activityModal = useActivityModal();
  const skillModal = useSkillModal();

  return (
    <>
      <ActivityFormModal
        mode={activityModal.modal.mode}
        isOpened={activityModal.modal.isOpened}
        allSkills={skills}
        onSubmit={activityModal.methods.handleSaveActivity}
        closeModal={activityModal.methods.closeModal}
        isSubmitting={activityModal.isSubmitting}
        closeByOverlay={activityModal.methods.handleCloseOverlay}
        openSkillModal={skillModal.methods.openCreateModal}
      />

      <SkillFormModal
        isOpened={skillModal.modal.isModalOpen}
        mode={skillModal.modal.modalMode}
        isSubmitting={skillModal.isSubmitting}
        onClose={skillModal.methods.closeModal}
        onSubmit={skillModal.methods.handleSaveSkill}
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colomn 1 : Current Focus + Skill List */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Current Focus
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  React Development
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
                {skills.slice(0, 8).map((skill) => (
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

          {/* Column 2 : Weekly Progress + Skill List */}
          <div className="space-y-6">
            <Card>
              <WeeklyProgressChart />
            </Card>

            <Card>
              <div className="flex justify-between items-start gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-100">
                  Skill List
                </h2>

                <div
                  className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800/40"
                  data-testid="skill-count-badge"
                >
                  <LuBookOpen
                    size={14}
                    className="text-slate-500 flex-shrink-0"
                  />

                  {isLoading ? (
                    <div className="h-4 w-4 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    <span className="text-sm font-medium text-slate-200">
                      {skills.length}
                    </span>
                  )}
                </div>

                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                  type="button"
                >
                  <LuCirclePlus /> Add Skill
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800/50">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Level</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr
                        key={skill.skill_id}
                        className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-2">{skill.name}</td>
                        <td className="py-2">{skill.category}</td>
                        <td className="py-2">{skill.level}</td>
                        <td className="py-2">{skill.actions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Column 3 : Activity Timeline + Skill Links */}
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

            <Card>
              <h2 className="text-lg font-semibold text-slate-100 mb-4">
                Skill Links
              </h2>
              <div className="h-40 bg-slate-900/50 rounded flex items-center justify-center border border-slate-800/50">
                <div className="text-center text-slate-400 text-sm">
                  <div className="mb-2">📈 Skill Network Visualization</div>
                  <div className="text-xs">Planned for Phase 4</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

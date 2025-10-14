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
} from "react-icons/lu";
import CircularProgressChart from "../../shared/components/CircularProgressChart/CircularProgressChart";
import Card from "../DashBoard/components/Card";
import ActivityItem from "../DashBoard/components/ActivityItem";
import MetricCard from "../DashBoard/components/MetricCard";
import SkillBadge from "../DashBoard/components/SkillBadge";
import WeeklyProgressChart from "./components/WeeklyProgressChart";

const Dashboard = () => {
  // TODO: Replace mocked skills and goals with real data in Phase 3
  const skills = [
    { id: 1, name: "JavaScript", category: "Frontend", level: 5, actions: 5 },
    { id: 2, name: "Python", category: "Backend", level: 6, actions: 3 },
    { id: 3, name: "React", category: "Frontend", level: 7, actions: 12 },
    { id: 4, name: "Node.js", category: "Backend", level: 5, actions: 8 },
  ];

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

  return (
    <div className="min-h-screen bg-gray-950. text-white. p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colomn 1 : Current Focus + Skill List */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Current Focus</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">React Development</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <LuClock /> 2h ago
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <CircularProgressChart value={85} strokeWidth={5} />
              <div className="text-right">
                <div className="text-xs text-gray-400">Level 4/5</div>
                <button className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-black px-2 py-1 rounded text-xs">
                  Log Activity
                </button>
              </div>
            </div>

            <h3 className="font-medium mb-2">My Goals</h3>
            <ul className="space-y-2">
              {goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <LuCircleCheck className="text-green-400 mt-0.5" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Related Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map((skill) => (
                <SkillBadge
                  key={skill.id}
                  name={skill.name}
                  level={skill.level}
                  color={
                    skill.category === "Frontend"
                      ? "bg-purple-600"
                      : "bg-blue-600"
                  }
                />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                title="Hours"
                value="25"
                subtitle="This week"
                icon={<LuClock />}
                color="text-cyan-400"
              />
              <MetricCard
                title="Projects Completed"
                value="380"
                subtitle="Total"
                icon={<LuCircleCheck />}
                color="text-green-400"
              />
              <MetricCard
                title="SOL Level"
                value="5"
                subtitle="Out of 10"
                icon={<LuArrowUpRight />}
                color="text-yellow-400"
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Skill List</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                <LuCirclePlus /> Add Skill
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Level</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr key={skill.id} className="border-b border-gray-800">
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
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            <div className="text-xs text-gray-500 mb-2">
              Planned for Phase 5
            </div>
            <div className="space-y-4">
              {activityTimeline.map((item, i) => (
                <ActivityItem key={i} text={item.text} time={item.time} />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Skill Links</h2>
            <div className="h-40 bg-gray-900. rounded flex items-center justify-center">
              <div className="text-center text-gray-400 text-sm">
                <div className="mb-2">📈 Skill Network Visualization</div>
                <div className="text-xs">Planned for Phase 4</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

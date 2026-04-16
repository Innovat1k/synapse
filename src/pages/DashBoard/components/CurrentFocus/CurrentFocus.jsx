import {
  LuClock,
  LuTarget,
  LuCircleAlert,
  LuPlus,
  LuFlame,
  LuArrowRight,
} from "react-icons/lu";
import ProgressCircle from "../ProgressCircle";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const FocusSkeleton = () => (
  <div
    className="p-5 space-y-6 animate-pulse"
    data-testid="current-focus-skeleton"
  >
    <div className="flex justify-between items-center">
      <div className="h-5 w-32 bg-slate-800 rounded" />
      <div className="h-4 w-16 bg-slate-800/50 rounded" />
    </div>

    <div className="flex flex-col items-center gap-4">
      <div className="h-24 w-24 rounded-full bg-slate-800" />
      <div className="h-4 w-20 bg-slate-800 rounded" />
    </div>

    <div className="flex justify-center gap-6">
      <div className="h-10 w-16 bg-slate-800 rounded" />
      <div className="h-10 w-16 bg-slate-800 rounded" />
    </div>

    <div className="h-10 w-full bg-slate-800 rounded-xl" />
  </div>
);

const LEVEL_MESSAGES = {
  1: {
    notComplete: "Building foundations",
    complete: "Foundations complete!",
  },
  2: {
    notComplete: "Making progress",
    complete: "Learning complete!",
  },
  3: {
    notComplete: "Halfway there",
    complete: "Intermediate mastered!",
  },
  4: {
    notComplete: "Almost expert",
    complete: "Advanced complete!",
  },
  5: {
    notComplete: "Final stretch",
    complete: "🎉 Master level reached!",
  },
};

const CurrentFocus = ({ data, isLoading, error, onLogActivity }) => {
  const progressPercent = Math.min((data?.skill_level / 5) * 100, 100);
  const duration = Math.round((data?.total_minutes / 60) * 10) / 10;

  if (isLoading) {
    return <FocusSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 min-h-45">
        <LuCircleAlert size={18} />
        <p className="text-sm">Unable to load current focus.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 min-h-70">
        {/* Icon Container */}
        <div className="p-3 bg-slate-900 rounded-full mb-3 ring-1 ring-slate-800">
          <LuTarget size={24} className="opacity-40" />
        </div>

        {/* Text */}
        <p className="text-sm font-medium text-slate-400">No focus yet</p>
        <p className="text-xs mt-1 opacity-60 max-w-50">
          Start tracking an activity to see your progress
        </p>

        <button
          onClick={() => {
            onLogActivity(null);
          }}
          className="group mt-4 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800
          border border-slate-700/50 hover:border-teal-500/50 rounded-lg text-xs font-medium
          text-slate-400 hover:text-teal-400 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <LuPlus
            size={14}
            className="transition-transform group-hover:rotate-90"
          />
          <span>Log your first activity</span>
          <LuArrowRight
            size={14}
            className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
          />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 flex flex-col h-full rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800/60"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 group relative">
        <div className="flex items-center gap-2">
          <LuFlame className="text-teal-400" size={16} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-100">
            Current Focus
          </h2>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 bg-slate-800/70 rounded-md text-[10px] text-slate-400">
          <LuClock size={12} />
          Last 7 days
        </div>

        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl">
          🔥 Your most practiced skill this week
        </div>
      </div>

      {/* SKILL */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white capitalize">
          {data.skill_name}
        </h3>

        {data.track_title && data.track_title !== "No Track" && (
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
            {data.track_title}
          </span>
        )}
      </div>

      {/* PROGRESS */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <ProgressCircle
          value={progressPercent}
          level={data.skill_level}
          size={150}
          strokeWidth={7}
        />

        {/* LEVEL BELOW */}
        <div className="px-3 py-1 bg-slate-800/60 border border-slate-700/40 rounded-full">
          <span className="text-xs text-slate-400 uppercase">Level</span>
          <span className="ml-1 text-sm font-bold text-teal-400">
            {data.skill_level}/5
          </span>
        </div>

        {/* PROGRESS CONTEXT */}
        <span className="text-xs text-slate-500 text-center mt-2 block">
          {(() => {
            const level = data.skill_level;
            const percent = Math.round(progressPercent);
            const isMax = level === 5 && percent >= 100;
            const config = LEVEL_MESSAGES[level] || LEVEL_MESSAGES[1];

            if (isMax) {
              return config.complete;
            }

            const textFn =
              typeof config.notComplete === "function"
                ? config.notComplete
                : () => config.notComplete;

            return textFn(percent);
          })()}
        </span>

        {/* STATS */}
        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-white">{duration}h</p>
            <span className="text-[10px] text-slate-500 uppercase">logged</span>
          </div>

          <div>
            <p className="text-lg font-bold text-white">
              {data.activities_count}
            </p>
            <span className="text-[10px] text-slate-500 uppercase">
              sessions
            </span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {onLogActivity && (
        <div className="mt-auto">
          {/* Primary button: Log for Current focus */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onLogActivity(data)}
            className="w-full flex items-center justify-center gap-2 
                 bg-linear-to-r from-teal-500 to-emerald-400 
                 text-slate-900 px-4 py-3 rounded-xl 
                 text-sm font-bold shadow-md shadow-teal-500/20 
                 hover:shadow-lg transition-all cursor-pointer"
          >
            <LuPlus size={16} />
            Log for {data?.skill_name}
          </motion.button>

          {/* Secondary button: Log for another */}
          <button
            onClick={() => onLogActivity(null)}
            className="w-full text-xs text-slate-500 hover:text-teal-400 
                 font-medium text-center py-2 mt-2 transition-colors cursor-pointer"
          >
            Log other activity →
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CurrentFocus;

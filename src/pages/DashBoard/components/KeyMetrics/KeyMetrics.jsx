import { LuClock, LuLayers, LuZap } from "react-icons/lu";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MetricCardSkeleton = () => (
  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 animate-pulse">
    <div className="h-5 w-5 bg-slate-800 rounded mb-3" />
    <div className="h-8 w-16 bg-slate-800 rounded mb-1" />
    <div className="h-3 w-20 bg-slate-800/50 rounded" />
  </div>
);

const MetricCard = ({
  icon,
  label,
  value,
  sublabel,
  color = "text-teal-400",
  delay = 0,
  testid,
}) => {
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      whileHover={{ y: -2 }}
      className="
      p-4 rounded-xl bg-slate-900/50 border border-slate-800/50
      hover:border-slate-700/50 hover:bg-slate-900/70
      transition-all
    "
      data-testid={testid}
    >
      <Icon className={`text-xl ${color} mb-2`} />

      <div className="text-xl font-black text-slate-100 leading-tight">
        {value}
      </div>

      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </div>

      {sublabel && (
        <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>
      )}
    </motion.div>
  );
};

const KeyMetrics = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Failed to load metrics
      </div>
    );
  }

  if (!data || data.hours_this_week === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No activity this week
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <MetricCard
        icon={LuClock}
        label="Hours"
        value={data.hours_this_week || 0}
        sublabel="This week"
        color="text-teal-400"
        testid="this-week-metric"
      />
      <MetricCard
        icon={LuLayers}
        label="Skills"
        value={data.skills_practiced}
        sublabel="Practiced"
        color="text-blue-400"
        testid="practiced-metric"
      />
      <MetricCard
        icon={LuZap}
        label="Sessions"
        value={data.total_sessions}
        sublabel="Completed"
        color="text-amber-400"
        testid="completed-metric"
      />
    </div>
  );
};

export default KeyMetrics;

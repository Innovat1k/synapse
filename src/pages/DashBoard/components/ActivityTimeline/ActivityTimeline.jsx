import { AnimatePresence, motion } from "framer-motion";
import { LuClock, LuCircleAlert } from "react-icons/lu";
import TimelineItem from "./components/TimelineItem";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toLocalDay = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const getDayDiff = (date, now = new Date()) => {
  const d1 = toLocalDay(now);
  const d2 = toLocalDay(date);
  return Math.round((d1 - d2) / MS_PER_DAY);
};

const groupActivities = (activities, now = new Date()) => {
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  for (const activity of activities) {
    const days = getDayDiff(activity.logged_at, now);
    if (days === 0) groups.Today.push(activity);
    else if (days === 1) groups.Yesterday.push(activity);
    else groups.Earlier.push(activity);
  }
  return groups;
};

const limitActivities = (grouped, max = 7) => {
  let count = 0;
  const result = {};
  for (const [group, activities] of Object.entries(grouped)) {
    if (count >= max) break;
    const slice = activities.slice(0, max - count);
    if (slice.length) {
      result[group] = slice;
      count += slice.length;
    }
  }
  return result;
};

// Skeleton amélioré avec effet de pulse Neural
const TimelineSkeleton = () => (
  <div className="p-4 space-y-6" data-testid="timeline-skeleton">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex gap-4 relative">
        <div className="w-10 h-10 rounded-xl bg-[#1a2332] border border-slate-800 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-3 w-1/3 bg-[#1a2332] rounded-full animate-pulse" />
          <div className="h-4 w-5/6 bg-[#1a2332]/60 rounded-lg animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ActivityTimeline = ({ data = [], isLoading, error, onActivityClick }) => {
  if (isLoading) return <TimelineSkeleton />;

  if (error) {
    return (
      <div
        className="flex items-center gap-3 p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-400"
        role="alert"
      >
        <LuCircleAlert size={18} className="shrink-0" />
        <p className="text-xs font-bold uppercase tracking-wider">
          Sync interrupted
        </p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center py-12 text-slate-600">
        <div className="relative mb-4">
          <LuClock size={32} className="opacity-20" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-cyan-500/10 rounded-full scale-150"
          />
        </div>
        <p className="text-sm font-medium tracking-tight">
          No activity recorded.
        </p>
      </div>
    );
  }

  const grouped = groupActivities(data);
  const limitedGroups = limitActivities(grouped);

  return (
    <div className="relative px-1">
      {/* Ligne verticale Neural : dégradé subtil */}
      <div className="absolute left-5.25 top-2 bottom-0 w-0.5 bg-linear-to-b from-cyan-500/40 via-slate-800 to-transparent" />

      <div className="space-y-8">
        {Object.entries(limitedGroups).map(([group, activities]) => {
          if (!activities.length) return null;

          return (
            <div key={group} className="relative">
              {/* Titre de groupe : typographie plus forte */}
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-5 pl-10 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                {group}
              </h3>

              <ul className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {activities.map((activity) => (
                    <TimelineItem
                      key={activity.id}
                      activity={activity}
                      onActivityClick={onActivityClick}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;

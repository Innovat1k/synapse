import { AnimatePresence } from "framer-motion";
import { LuClock, LuCircleAlert } from "react-icons/lu";
import TimelineItem from "./components/TimelineItem";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Normalizes a date to LOCAL day (browser timezone)
const toLocalDay = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Difference in calendar days (robust timezone)
const getDayDiff = (date, now = new Date()) => {
  const d1 = toLocalDay(now);
  const d2 = toLocalDay(date);

  return Math.round((d1 - d2) / MS_PER_DAY);
};

const groupActivities = (activities, now = new Date()) => {
  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  for (const activity of activities) {
    const days = getDayDiff(activity.logged_at, now);

    if (days === 0) {groups.Today.push(activity);}
    else if (days === 1) {groups.Yesterday.push(activity);}
    else {groups.Earlier.push(activity);}
  }

  return groups;
};

const limitActivities = (grouped, max = 7) => {
  let count = 0;
  const result = {};

  for (const [group, activities] of Object.entries(grouped)) {
    if (count >= max) {break;}

    const slice = activities.slice(0, max - count);
    if (slice.length) {
      result[group] = slice;
      count += slice.length;
    }
  }

  return result;
};

const TimelineSkeleton = () => (
  <div className="p-4 space-y-4" data-testid="timeline-skeleton">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-800/50 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ActivityTimeline = ({ data = [], isLoading, error, onActivityClick }) => {
  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 text-red-400" role="alert">
        <LuCircleAlert size={18} className="shrink-0" />
        <p>Unable to load timeline</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center py-10 text-slate-500">
        <LuClock size={28} className="opacity-40 mb-2" />
        <p>No activities yet</p>
      </div>
    );
  }

  const grouped = groupActivities(data);
  const limitedGroups = limitActivities(grouped);

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-800" />

      <div className="space-y-6">
        {Object.entries(limitedGroups).map(([group, activities]) => {
          if (!activities.length) {return null;}

          return (
            <div key={group}>
              {/* Group title */}
              <h3 className="text-xs uppercase text-slate-500 mb-3 pl-8">
                {group}
              </h3>

              <ul className="space-y-3">
                <AnimatePresence>
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

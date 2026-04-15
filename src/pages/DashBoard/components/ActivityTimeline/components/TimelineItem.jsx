import { motion } from "framer-motion";
import { formatDuration } from "../../../utils/dashboardUtils";
import { useRelativeTime } from "../hooks/useRelativeTime";

const ACTIVITY_CONFIG = {
  learning: { icon: "🎓", color: "text-blue-400", bg: "bg-blue-500/10" },
  practice: { icon: "💻", color: "text-teal-400", bg: "bg-teal-500/10" },
  "project work": {
    icon: "🚀",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  research: { icon: "🔍", color: "text-amber-400", bg: "bg-amber-500/10" },
  "teaching/mentoring": {
    icon: "👥",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  "administration/setup": {
    icon: "⚙️",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
  },
  other: { icon: "⋯", color: "text-slate-500", bg: "bg-slate-500/5" },
};

const DEFAULT_CONFIG = {
  icon: "🕐",
  color: "text-slate-400",
  bg: "bg-slate-500/10",
};

const TimelineItem = ({ activity, onActivityClick }) => {
  const relativeTime = useRelativeTime(activity.logged_at);

  const typeKey = activity.activity_type?.toLowerCase();
  const config = ACTIVITY_CONFIG[typeKey] || DEFAULT_CONFIG;
  const clickable = !!onActivityClick;
  const isRecent =
    new Date() - new Date(activity.logged_at) < 1000 * 60 * 60 * 6;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => clickable && onActivityClick(activity)}
      className={`group flex gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-900/50`}
    >
      {/* Dot + Icon */}
      <div className="relative flex flex-col items-center">
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full
            ${isRecent ? "bg-teal-400 shadow-[0_0_8px_#14b8a6]" : "bg-slate-600"}
          `}
        />
        <div
          className={`
            w-9 h-9 flex items-center justify-center rounded-xl
            ${config.bg} ${config.color}
            ring-1 ring-white/5
          `}
        >
          {config.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Skill name + Duration */}
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-semibold text-slate-100 truncate">
            {activity.skill_name}
          </h4>
          {/* Badge de durée */}
          <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded shrink-0">
            {formatDuration(activity.duration_minutes)}
          </span>
        </div>

        {/* Metadata: Type • Timestamp */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
          <span className="capitalize">{activity.activity_type}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 first-letter:capitalize">
            {relativeTime}
          </span>
        </div>

        {/* Notes */}
        {activity.notes?.trim() && (
          <p className="mt-1.5 text-xs text-slate-400/80 italic line-clamp-2 leading-relaxed">
            "{activity.notes}"
          </p>
        )}
      </div>
    </motion.li>
  );
};

export default TimelineItem;

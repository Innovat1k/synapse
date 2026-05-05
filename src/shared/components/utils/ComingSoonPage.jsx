import { LuClock, LuSettings, LuFolder, LuTarget } from "react-icons/lu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Map feature names to icons (extensible)
const ICONS = {
  settings: LuSettings,
  projects: LuFolder,
  goals: LuTarget,
  default: LuClock,
};

const ComingSoonPage = ({
  title = "Coming Soon",
  description,
  feature,
  roadmapLink = "https://github.com/Innovat1k/synapse/blob/main/ROADMAP.md",
  ctaText = "Back to Dashboard",
  ctaLink = "/dashboard",
}) => {
  // Get icon based on feature, fallback to default
  const Icon = ICONS[feature] || ICONS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Dynamic Icon */}
      <div className="p-4 bg-slate-800/40 rounded-xl mb-4 ring-1 ring-slate-700/50">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-slate-500 text-sm max-w-sm mb-6">
        {description || "This feature is planned for a future release."}
      </p>

      {/* Link to Roadmap */}
      <Link
        to={roadmapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-cyan-400 hover:text-cyan-300 underline transition-colors"
      >
        View Roadmap →
      </Link>

      {/* CTA Button */}
      <Link
        to={ctaLink}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
      >
        {ctaText}
      </Link>
    </motion.div>
  );
};

export default ComingSoonPage;

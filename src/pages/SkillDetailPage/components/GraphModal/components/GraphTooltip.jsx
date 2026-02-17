// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * Simple static tooltip for GraphView MVP.
 * - Desktop: top-right corner
 * - Mobile: bottom center with "Complete" button
 */
export const GraphTooltip = ({
  node,
  isMobile,
  mutualSkills,
  incoming,
  config,
  onComplete,
}) => {
  // Determine contextual message
  const getMessage = () => {
    if (mutualSkills.has(node.id)) return "Mutual dependency with core";
    if (incoming.has(node.id)) return "Required to reach core skill";
    return "Unlocked after mastering core";
  };

  return (
    <motion.div
      data-testid="graph-tooltip"
      initial={{ opacity: 0, scale: 0.9, y: isMobile ? 10 : -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15, ease: "easeIn" },
      }}
      className="absolute px-4 py-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl min-w-[220px] max-w-[85%] z-50"
      style={{
        bottom: isMobile ? config?.tooltipBottom || "20px" : "auto",
        top: isMobile ? "auto" : "20px",
        right: isMobile ? "auto" : "20px",
        left: isMobile ? "50%" : "auto",
        x: isMobile ? "-50%" : "0%",
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
          Status: {node.status || "Available"}
        </span>
      </div>

      <p className="text-base font-bold text-white leading-tight">
        {node.label}
      </p>

      <p className="text-[11px] text-slate-400 italic mt-2 border-t border-slate-800 pt-2">
        {getMessage()}
      </p>

      {/* "Complete" button displayed only on mobile */}
      {isMobile && node.status === "available" && onComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(node.id);
          }}
          className="mt-3 w-full py-1.5 bg-teal-600 hover:bg-teal-500 rounded text-white text-sm font-medium transition-colors cursor-pointer"
          type="button"
        >
          Mark as Completed
        </button>
      )}
    </motion.div>
  );
};

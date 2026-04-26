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
  onComplete,
  mousePos = { x: 0, y: 0 },
}) => {
  const getMessage = () => {
    if (mutualSkills.has(node.id)) {
      return "Mutual dependency with core";
    }
    if (incoming.has(node.id)) {
      return "Required to reach core skill";
    }
    return "Unlocked after mastering core";
  };

  const getDynamicStyles = () => {
    if (isMobile) {
      return {
        bottom: "1.25rem",
        left: "1rem",
        right: "5.5rem",
        position: "absolute",
        pointerEvents: "auto",
        width: "calc(100% - 7rem)",
        maxWidth: "240px",
        zIndex: 50,
      };
    }

    // Flip to the opposite side when the cursor is near the right edge (300px threshold)
    const shouldFlip =
      typeof window !== "undefined" && mousePos.x > window.innerWidth - 300;

    return {
      left: shouldFlip ? mousePos.x - 240 : mousePos.x + 20,
      top: mousePos.y + 20,
      position: "fixed",
      pointerEvents: "none",
    };
  };

  return (
    <motion.div
      layout
      data-testid="graph-tooltip"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="z-100 px-4 py-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-55 max-w-70"
      style={getDynamicStyles()}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-xs font-bold uppercase tracking-widest ${
            node.status === "completed" ? "text-cyan-400" : "text-slate-500"
          }`}
        >
          Status: {node.status || "Available"}
        </span>
      </div>

      <p className="text-base font-bold text-slate-50 leading-tight">
        {node.label}
      </p>

      <p className="text-xs text-slate-400 italic mt-2 border-t border-slate-800/50 pt-2">
        {getMessage()}
      </p>

      {isMobile && node.status === "available" && onComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(node.id);
          }}
          className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95"
          type="button"
        >
          Mark as Completed
        </button>
      )}
    </motion.div>
  );
};

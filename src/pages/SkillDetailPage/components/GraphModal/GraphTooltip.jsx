// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const GraphTooltip = ({ node, isMobile, mutualSkills, incoming, config }) => {
  return (
    <motion.div
      data-testid="graph-tooltip"
      initial={{ opacity: 0, scale: 0.9, y: isMobile ? 10 : -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        scale: 0.95, 
        transition: { duration: 0.15, ease: "easeIn" } 
      }}
      className="absolute px-4 py-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl pointer-events-none min-w-[220px] z-50"
      style={{
        bottom: isMobile ? (config?.tooltipBottom || "20px") : "auto",
        top: isMobile ? "auto" : "20px",
        right: isMobile ? "auto" : "20px",
        left: isMobile ? "50%" : "auto",
        x: isMobile ? "-50%" : "0%",
      }}
    >
      {/* Contents (Status, Label, Message...) */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
          Status: {node.status || "Available"}
        </span>
      </div>
      <p className="text-base font-bold text-white leading-tight">{node.label}</p>
      <p className="text-[11px] text-slate-400 italic mt-2 border-t border-slate-800 pt-2">
        {mutualSkills.has(node.id) ? "Mutual dependency with core" : 
         incoming.has(node.id) ? "Required to reach core skill" : 
         "Unlocked after mastering core"}
      </p>
    </motion.div>
  );
};
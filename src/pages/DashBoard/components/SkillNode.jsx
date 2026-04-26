import { Handle, Position } from "@xyflow/react";
import { memo } from "react";

export const SkillNode = memo(({ data }) => {
  const { label, level, category, status } = data;
  const isLocked = status === "locked";

  const getIntensityStyles = (lvl) => {
    if (isLocked) {
      return "border-slate-800 bg-slate-900/40 text-slate-600 grayscale";
    }
    if (lvl >= 5) {
      return "border-cyan-400 bg-cyan-950/80 shadow-[inset_0_0_15px_rgba(34,211,238,0.5)] text-white ring-1 ring-cyan-400/20";
    }
    if (lvl >= 4) {
      return "border-cyan-500/60 bg-slate-900/90 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)] text-cyan-50";
    }
    if (lvl >= 3) {
      return "border-sky-500/50 bg-slate-900/80 shadow-[inset_0_0_8px_rgba(56,189,248,0.2)] text-sky-100";
    }
    return "border-slate-700 bg-slate-950/60 text-slate-500";
  };

  return (
    <div className="group relative">
      {/* MULTIPLE HANDLES: Allows curves to choose the smoothest path */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="opacity-0!"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="opacity-0!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="opacity-0!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="opacity-0!"
      />

      {/* LE NEURONE */}
      <div
        className={`
          w-28 h-20
          rounded-[45%_45%_40%_40%/55%_55%_45%_45%]
          border backdrop-blur-md
          transition-all duration-700 ease-in-out
          flex flex-col items-center justify-center
          ${!isLocked ? "animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" : ""}
          hover:scale-110 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
          hover:animate-none cursor-pointer
          ${getIntensityStyles(level)}
        `}
      >
        <div className="flex flex-col items-center px-3 pointer-events-none">
          <h3 className="text-xs font-extrabold uppercase tracking-tight text-center leading-tight mb-1.5 drop-shadow-sm">
            {label}
          </h3>

          {/* Micro-dots de niveau */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full transition-all duration-1000 ${
                  i < level
                    ? "bg-current shadow-[0_0_5px_currentColor]"
                    : "bg-white/5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ÉTIQUETTE DE CATÉGORIE */}
      {category && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 group-hover:opacity-100 transition-all duration-500">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-cyan-400">
            {category}
          </span>
        </div>
      )}

      {/* GLOW AU SURVOL */}
      {!isLocked && (
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping bg-cyan-400 pointer-events-none -z-10" />
      )}
    </div>
  );
});

SkillNode.displayName = "SkillNode";

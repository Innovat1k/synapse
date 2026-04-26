import { LuPlus, LuMinus, LuMaximize } from "react-icons/lu";
import { useReactFlow } from "@xyflow/react";

export const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const btnClass =
    "p-2.5 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/50 text-slate-500 hover:text-cyan-400 transition-all duration-200 cursor-pointer active:scale-90";

  return (
    <div className="flex flex-col shadow-lg gap-0">
      <button
        onClick={zoomIn}
        aria-label="Zoom in"
        className={`${btnClass} rounded-t-lg border-b-0`}
      >
        <LuPlus size={18} />
      </button>
      <button
        onClick={zoomOut}
        aria-label="Zoom out"
        className={`${btnClass} border-b-0`}
      >
        <LuMinus size={18} />
      </button>
      <button
        onClick={() => fitView({ duration: 800 })}
        aria-label="Fit view"
        className={`${btnClass} rounded-b-lg`}
      >
        <LuMaximize size={18} />
      </button>
    </div>
  );
};

import { LuPlus, LuMinus, LuMaximize } from "react-icons/lu";
import { useReactFlow } from "@xyflow/react";

export const CustomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const btnClass =
    "p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-400 transition-all active:scale-90";

  return (
    <div className="absolute bottom-6 left-6 z-50 flex flex-col shadow-2xl">
      <button
        onClick={zoomIn}
        aria-label="Zoom in"
        className={`${btnClass} rounded-t-xl border-b-0 cursor-pointer`}
      >
        <LuPlus size={18} />
      </button>
      <button
        onClick={zoomOut}
        aria-label="Zoom out"
        className={`${btnClass} border-b-0 cursor-pointer`}
      >
        <LuMinus size={18} />
      </button>
      <button
        onClick={() => fitView({ duration: 800 })}
        aria-label="Fit view"
        className={`${btnClass} rounded-b-xl cursor-pointer`}
      >
        <LuMaximize size={18} />
      </button>
    </div>
  );
};

import { LuPlus, LuMinus, LuRotateCcw } from "react-icons/lu";

// Generic button for graph controls
const ControlButton = ({
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${isMobile ? "w-9 h-9" : "w-10 h-10"}
        rounded-lg flex items-center justify-center 
        transition-all duration-200 cursor-pointer active:scale-90 select-none
        border backdrop-blur-md shadow-lg
        ${
          disabled
            ? "bg-slate-900/40 text-slate-700 border-slate-800/30 cursor-not-allowed shadow-none opacity-50"
            : `bg-slate-950/90 text-slate-400 border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]`
        }
      `}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <div
        className={
          disabled
            ? "opacity-50"
            : "drop-shadow-[0_0_3px_rgba(255,255,255,0.1)]"
        }
      >
        {children}
      </div>
    </button>
  );
};

// Container for zoom and reset controls
export const GraphControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  isMobile = false,
  isZoomInDisabled = false,
  isZoomOutDisabled = false,
  isResetDisabled = false,
}) => {
  return (
    <div
      className={`absolute z-30 flex ${
        isMobile
          ? "right-3 bottom-6 flex-col gap-2 scale-90"
          : "right-8 top-6 flex-col gap-3"
      }`}
      role="group"
      aria-label="Zoom controls"
    >
      <ControlButton
        onClick={onZoomIn}
        disabled={isZoomInDisabled}
        aria-label="Zoom in"
      >
        <LuPlus size={18} />
      </ControlButton>

      <ControlButton
        onClick={onZoomOut}
        disabled={isZoomOutDisabled}
        aria-label="Zoom out"
      >
        <LuMinus size={18} />
      </ControlButton>

      <ControlButton
        onClick={onReset}
        disabled={isResetDisabled}
        aria-label="Reset view"
      >
        <LuRotateCcw size={18} />
      </ControlButton>
    </div>
  );
};

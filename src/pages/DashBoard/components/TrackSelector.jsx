import { LuChevronDown, LuLayers } from "react-icons/lu";

export const TrackSelector = ({
  tracks = [],
  selectedTrackId,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div
        className="flex items-center gap-2"
        data-testid="track-selector-skeleton"
      >
        <div className="h-10 w-32 bg-slate-900/50 border border-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  const options = [
    { value: "all", label: "All Tracks" },
    ...tracks.map((track) => ({
      value: track.track_id,
      label: track.title,
    })),
  ];

  return (
    <div className="group relative min-w-40">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
        <LuLayers size={14} />
      </div>

      <label className="sr-only" htmlFor="track">
        track
      </label>

      <select
        value={selectedTrackId}
        id="track"
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-100 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200 cursor-pointer"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-900 text-slate-100 capitalize"
          >
            {option.label}
          </option>
        ))}
      </select>

      <LuChevronDown
        size={16}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 pointer-events-none transition-colors"
      />
    </div>
  );
};

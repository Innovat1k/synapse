import { LuTrash2, LuExternalLink } from "react-icons/lu";

const CATEGORIES = {
  frontend: {
    label: "Frontend",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  backend: {
    label: "Backend",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  devops: {
    label: "DevOps",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  data: {
    label: "Data",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  design: {
    label: "Design",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  other: {
    label: "Other",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

export const TrackList = ({ tracks = [], onDelete }) => {
  return (
    <div className="grid gap-3">
      {tracks.map((track) => {
        const cat = CATEGORIES[track.category] || CATEGORIES.other;

        return (
          <div
            key={track.track_id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all duration-300 gap-4"
            data-testid={`track-item-${track.track_id}`}
          >
            {/*---SECTION INFOS ---*/}
            <div className="flex items-center gap-4">
              {/*Dynamic avatar with category color */}
              <div
                className={`shrink-0 w-12 h-12 rounded-xl bg-slate-950 border ${cat.color.split(" ")[2]} flex items-center justify-center shadow-inner`}
              >
                <span
                  className={`text-lg font-bold ${cat.color.split(" ")[1]}`}
                >
                  {track.title[0].toUpperCase()}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-slate-100 truncate">
                    {track.title}
                  </h3>
                  <span
                    className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md border font-medium ${cat.color}`}
                    data-testid="desktop-track-category"
                  >
                    {cat.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono tracking-tight truncate">
                  ID: {track.track_id}
                </p>
              </div>
            </div>

            {/*---SECTION STATS & ACTIONS ---*/}
            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-800/50 pt-3 sm:pt-0">
              {/*Category badge (only visible on mobile here) */}
              <span
                className={`sm:hidden text-[10px] px-2 py-1 rounded-md border font-medium ${cat.color}`}
                data-testid="mobile-track-category"
              >
                {cat.label}
              </span>

              <div className="flex items-center gap-2">
                {/*View button (Placeholder for future navigation) */}
                <button
                  className="p-2 text-slate-500 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"
                  title="View Network"
                >
                  <LuExternalLink size={18} />
                </button>

                {/*Delete button */}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(track.track_id, track.title);
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all cursor-pointer"
                    aria-label={`Delete track ${track.title}`}
                  >
                    <LuTrash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

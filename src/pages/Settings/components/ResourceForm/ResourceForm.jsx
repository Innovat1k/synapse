import { LuCheck, LuLayoutGrid, LuTag, LuChevronDown } from "react-icons/lu";
import ButtonSpinner from "@shared/components/ui/ButtonSpinner";

export const ResourceForm = ({
  title = "",
  category,
  generatedId,
  categories = [],
  onTitleChange,
  onCategoryChange,
  onSubmit,
  isSubmitting = false,
  children,
  ref,
}) => {
  const inputBaseStyles =
    "w-full px-4 py-2 bg-slate-950/60 border border-slate-800/50 rounded-lg text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent transition-all appearance-none group-hover:border-slate-700/50";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="group space-y-2">
          <label
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"
            htmlFor="track-title"
          >
            <LuLayoutGrid size={12} />
            Track Title
          </label>
          <input
            type="text"
            id="track-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
            autoFocus
            placeholder="React Architecture"
            className={inputBaseStyles}
            ref={ref}
          />
        </div>

        {/* Category */}
        <div className="group space-y-2">
          <label
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500"
            htmlFor="track-category"
          >
            <LuTag size={12} />
            Category
          </label>
          <div className="relative">
            <select
              id="track-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              required
              className={inputBaseStyles}
            >
              {categories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  className="bg-slate-900 italic"
                >
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-focus-within:text-cyan-400 transition-colors">
              <LuChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800/50">
        <div className="flex flex-col items-center sm:items-start order-3 sm:order-1">
          <span className="text-xs text-slate-600 uppercase font-bold tracking-widest">
            Auto-generated ID
          </span>
          <span className="text-sm text-cyan-400/70 font-mono mt-1">
            {generatedId || "no-title-yet"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 disabled:bg-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <ButtonSpinner
                color="border-slate-100"
                label={null}
                inline={true}
              />
            ) : (
              <LuCheck size={16} />
            )}
            <span>{isSubmitting ? "Creating..." : "Create Track"}</span>
          </button>

          <div className="w-full sm:w-auto">{children}</div>
        </div>
      </div>
    </form>
  );
};

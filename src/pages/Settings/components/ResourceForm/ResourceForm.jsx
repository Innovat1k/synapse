import { LuCheck, LuLayoutGrid, LuTag, LuChevronDown } from "react-icons/lu";
import ButtonSpinner from "@shared/components/ButtonSpinner";

export const ResourceForm = ({
  title,
  category,
  generatedId,
  categories,
  onTitleChange,
  onCategoryChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const inputBaseStyles =
    "w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all appearance-none group-hover:border-slate-700";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="group space-y-1.5">
          <label
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-0.5"
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
          />
        </div>

        {/* Category */}
        <div className="group space-y-1.5">
          <label
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-0.5"
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-focus-within:text-teal-500 transition-colors">
              <LuChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-900/50">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-tight">
            Auto-generated ID
          </span>
          <span className="text-[11px] text-teal-500/70 font-mono leading-none">
            {generatedId || "no-title-yet"}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 text-sm font-bold rounded-lg transition-all active:scale-[0.98] disabled:text-slate-500"
        >
          {isSubmitting ? (
            <ButtonSpinner
              color="border-slate-950"
              label={null}
              inline={true}
            />
          ) : (
            <LuCheck size={16} />
          )}
          <span>{isSubmitting ? "Creating..." : "Create Track"}</span>
        </button>
      </div>
    </form>
  );
};

import { LuChevronDown, LuTag } from "react-icons/lu";

export const CategorySelector = ({
  categories = [],
  selectedCategory,
  onSelect,
  size = "md",
}) => {
  const isSmall = size === "sm";

  return (
    <div className="group relative min-w-35">
      <div
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500/70 group-focus-within:text-teal-400 transition-colors pointer-events-none`}
      >
        <LuTag size={isSmall ? 12 : 14} />
      </div>

      <label className="sr-only" htmlFor="category">
        category
      </label>

      <select
        id="category"
        value={selectedCategory || ""}
        onChange={(e) => onSelect(e.target.value)}
        className={`
          w-full bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/30 rounded-lg 
          ${isSmall ? "pl-8 pr-7 py-1.5 text-xs" : "pl-9 pr-8 py-2 text-sm"}
          text-slate-100 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer
        `}
      >
        <option value="" className="bg-slate-900 text-slate-100 italic">
          All Categories
        </option>
        {categories.map((cat) => (
          <option
            key={cat.value}
            value={cat.value}
            className="bg-slate-900 text-slate-100 capitalize"
          >
            {cat.label}
          </option>
        ))}
      </select>

      <LuChevronDown
        size={isSmall ? 14 : 16}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-slate-300 pointer-events-none transition-colors"
      />
    </div>
  );
};

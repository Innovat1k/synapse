import { LuChevronDown, LuChevronsUpDown, LuChevronUp } from "react-icons/lu";

function TableHead({ field, fieldLabel, handleSort }) {
  return (
    <th className="py-3 px-4 flex items-center gap-2">
      <span className="capitalize">{fieldLabel}</span>
      <button
        aria-label={`Sort by ${fieldLabel}${
          field.sortBy === fieldLabel
            ? field.isAscendant
              ? " (descendant)"
              : " (ascendant)"
            : ""
        }`}
        className="cursor-pointer text-gray-400 hover:text-white"
        onClick={() => handleSort(fieldLabel)}
      >
        {field.sortBy === fieldLabel ? (
          field.isAscendant ? (
            <LuChevronUp className="h-4 w-4" />
          ) : (
            <LuChevronDown className="h-4 w-4" />
          )
        ) : (
          <LuChevronsUpDown className="h-4 w-4" />
        )}
      </button>
    </th>
  );
}

export default TableHead;

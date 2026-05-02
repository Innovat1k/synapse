import {
  Select,
  Button,
  Label,
  Popover,
  ListBox,
  ListBoxItem,
} from "react-aria-components";
import { LuChevronDown } from "react-icons/lu";

export const SelectInput = ({
  id,
  value,
  inputRef,
  onChange,
  options = [],
  placeholder = "Select an option",
  label,
  disabled = false,
}) => {
  const items = options.map((opt) =>
    typeof opt === "string"
      ? { id: opt, name: opt }
      : { id: opt.value, name: opt.label },
  );

  const normalizedValue = value && value !== "" ? value : null;
  const hasSelection = normalizedValue !== null;
  const selectedItem = items.find((item) => item.id === value);
  const displayText = selectedItem ? selectedItem.name : placeholder;

  return (
    <Select
      name={id}
      selectedKey={normalizedValue}
      onSelectionChange={(key) => onChange(key || "")}
      isDisabled={disabled}
      className="w-full"
      aria-label={label}
    >
      {label && (
        <Label
          className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest"
          htmlFor={id}
        >
          {label}
        </Label>
      )}

      <Button
        id={id}
        ref={inputRef}
        className={`
          w-full px-4 py-2.5 pr-10
          bg-slate-900/40 border border-slate-700/50 rounded-lg
          text-slate-100 placeholder-slate-600
          focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-transparent
          transition-all duration-200
          flex items-center justify-between
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-800/40"
              : "hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer"
          }
        `}
      >
        <span
          className={`
            truncate text-left first-letter:capitalize font-medium
            ${hasSelection ? "text-slate-100" : "text-slate-500 italic"}
          `}
        >
          {displayText}
        </span>
        <LuChevronDown
          size={18}
          className="text-slate-500 transition-transform duration-200 shrink-0"
        />
      </Button>

      <Popover
        className={`
          z-50 overflow-hidden rounded-lg
          border border-slate-700/50
          bg-slate-900/95 backdrop-blur-sm
          shadow-xl shadow-slate-950/50
        `}
      >
        <ListBox
          items={items}
          className="p-1.5 max-h-64 overflow-y-auto outline-none"
        >
          {(item) => (
            <ListBoxItem
              key={item.id}
              id={item.id}
              className={`
                px-3 py-2.5 text-sm font-medium text-slate-300 rounded-lg
                outline-none cursor-pointer capitalize
                transition-all duration-200
                data-focused:bg-cyan-500/15 data-focused:text-cyan-300
                data-selected:bg-cyan-500/20 data-selected:text-cyan-200
                data-selected:border-l-2 data-selected:border-l-cyan-400
              `}
            >
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
};

export default SelectInput;

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
  placeholder = "Sélectionner un élément",
  label,
  disabled = false,
}) => {
  const items = options.map((opt) =>
    typeof opt === "string"
      ? { id: opt, name: opt }
      : { id: opt.value, name: opt.label }
  );

  const hasSelection = value != null && value !== "";
  const selectedItem = items.find((item) => item.id === value);
  const displayText = selectedItem ? selectedItem.name : placeholder;

  return (
    <Select
      name={id}
      selectedKey={value || undefined}
      onSelectionChange={onChange}
      isDisabled={disabled}
      className="w-full"
      // domRef={inputRef}
    >
      {label && (
        <Label
          className="block text-sm font-medium text-slate-400 mb-1.5"
          htmlFor={id}
        >
          {label}
        </Label>
      )}

      <Button
        id={id}
        ref={inputRef}
        className={`
          w-full px-4 py-3 pr-10
          bg-slate-800/50 border border-slate-700 rounded-lg
          text-slate-100
          focus:outline-none focus:ring-2 focus:ring-teal-400/50
          transition-all duration-150
          flex items-center justify-between
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-slate-800 cursor-pointer"
          }
        `}
      >
        <span
          className={`
            truncate text-left first-letter:capitalize
            ${hasSelection ? "text-slate-100" : "text-slate-500/60 italic"}
          `}
        >
          {displayText}
        </span>
        <LuChevronDown
          size={16}
          className="text-slate-400 transition-transform duration-150"
        />
      </Button>

      <Popover
        className={`
          z-50 overflow-hidden rounded-xl
          border border-slate-700/60
          bg-slate-900/95
          shadow-2xl
        `}
      >
        <ListBox
          items={items}
          className="p-1 max-h-60 overflow-y-auto outline-none scrollbar-hide"
        >
          {(item) => (
            <ListBoxItem
              key={item.id}
              id={item.id}
              className={`
                px-3 py-2.5 text-slate-200 rounded-lg
                outline-none cursor-default capitalize
                transition-colors duration-100
                data-[focused]:bg-slate-800/70
                data-[selected]:bg-teal-900/40
                data-[selected]:text-teal-100
                data-[selected]:font-medium
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

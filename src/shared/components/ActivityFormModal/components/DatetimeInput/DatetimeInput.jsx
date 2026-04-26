import { forwardRef } from "react";
import { useDatetimeInput } from "./hooks/useDatetimeInput";

const DatetimeInput = forwardRef(
  ({ value, onChange, id, disabled = false, className = "" }, ref) => {
    const { dateValue, setDateValue, timeValue, setTimeValue } =
      useDatetimeInput(value, onChange);

    const inputStyle =
      "w-full px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-lg " +
      "text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 " +
      "focus:ring-cyan-400/40 focus:border-transparent transition-all duration-200 " +
      (disabled ? "cursor-not-allowed opacity-60 bg-slate-800/40" : "");

    const labelStyle =
      "block text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest";

    return (
      <div className={`flex gap-4 ${className}`}>
        <div className="flex-1">
          <label htmlFor={`${id}-date`} className={labelStyle}>
            Date
          </label>
          <input
            id={`${id}-date`}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            disabled={disabled}
            className={inputStyle}
            ref={ref}
          />
        </div>
        <div className="flex-1">
          <label htmlFor={`${id}-time`} className={labelStyle}>
            Time
          </label>
          <input
            id={`${id}-time`}
            type="time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            disabled={disabled}
            className={inputStyle}
          />
        </div>
      </div>
    );
  },
);

DatetimeInput.displayName = "DatetimeInput";

export default DatetimeInput;

// shared/components/DatetimeInput/DatetimeInput.jsx
import { forwardRef } from "react";
import { useDatetimeInput } from "./useDatetimeInput";

const DatetimeInput = forwardRef(
  ({ value, onChange, id, disabled = false, className = "" }, ref) => {
    const { dateValue, setDateValue, timeValue, setTimeValue } =
      useDatetimeInput(value, onChange);

    const inputStyle =
      "w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg " +
      "text-slate-100 placeholder-slate-500/60 focus:outline-none focus:ring-2 " +
      "focus:ring-teal-400/50 transition " +
      (disabled ? "cursor-not-allowed opacity-70" : "");

    const labelStyle = "block text-sm font-medium text-slate-400 mb-1.5";

    return (
      <div className={`flex gap-2 ${className}`} ref={ref}>
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
  }
);

DatetimeInput.displayName = "DatetimeInput";

export default DatetimeInput;

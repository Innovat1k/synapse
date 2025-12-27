// shared/components/DatetimeInput/useDatetimeInput.js
import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to manage the logic of a datetime input field.
 * Handles synchronization between an ISO 8601 datetime string and separate date/time inputs.
 */

export const useDatetimeInput = (value, onChange) => {
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const lastEmittedIso = useRef(null);

  //  Synchronize internal state from the ISO value provided by the parent
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDateValue(date.toISOString().split("T")[0]);
        setTimeValue(date.toTimeString().slice(0, 5));
      }
    }
  }, [value]);

  // Notify parent with a valid ISO string whenever date or time changes
  useEffect(() => {
    if (!dateValue || !timeValue) return;

    const combined = `${dateValue}T${timeValue}`;
    const newIso = new Date(combined).toISOString();

    //  Avoid redondant calls
    if (lastEmittedIso.current !== newIso) {
      lastEmittedIso.current = newIso;
      onChange?.(newIso);
    }
  }, [dateValue, timeValue, onChange]);

  return {
    dateValue,
    timeValue,
    setDateValue,
    setTimeValue,
  };
};

// Auto-updating relative time (e.g., "2h ago") that refreshes on tab focus and every 5 minutes
import { useState, useEffect } from "react";
import { formatRelativeTime } from "../../../utils/dashboardUtils";

export const useRelativeTime = (dateString) => {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(dateString),
  );

  useEffect(() => {
    const updateRelativeTime = () => {
      if (document.visibilityState === "visible") {
        setRelativeTime(formatRelativeTime(dateString));
      }
    };

    // Visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateRelativeTime();
      }
    };

    // 5 minute interval
    const intervalId = setInterval(updateRelativeTime, 5 * 60 * 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    updateRelativeTime();

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dateString]);

  return relativeTime;
};

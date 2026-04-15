// Fetches weekly progress data (hours per week) with optional track/skill filters and 5-minute cache
import { useQuery } from "@tanstack/react-query";
import { fetchWeeklyProgress } from "@services/weeklyProgressService";

export const useWeeklyProgress = (userId, options = {}) => {
  const { weeksBack, trackId, skillId, enabled = true } = options;

  return useQuery({
    queryKey: [
      "dashboard",
      "weeklyProgress",
      userId,
      weeksBack,
      trackId,
      skillId,
    ],
    queryFn: () => fetchWeeklyProgress(userId, { weeksBack, trackId, skillId }),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

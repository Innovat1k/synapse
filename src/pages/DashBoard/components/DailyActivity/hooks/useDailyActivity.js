// Fetches daily activity summary (last N days) with 1-minute cache for real-time dashboard updates
import { useQuery } from "@tanstack/react-query";
import { fetchDailyActivity } from "@services/dailyActivityService";

export const useDailyActivity = (userId, options = {}) => {
  const { daysBack = 7, enabled = true } = options;

  return useQuery({
    queryKey: ["dashboard", "dailyActivity", userId, { daysBack }],
    queryFn: () => fetchDailyActivity(userId, { daysBack }),
    enabled: !!userId && enabled,
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

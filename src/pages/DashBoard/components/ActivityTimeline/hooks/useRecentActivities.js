// Fetches recent user activities for dashboard with short cache (2min) and configurable limit
import { useQuery } from "@tanstack/react-query";
import { fetchRecentActivities } from "@services/recentActivitiesService";

export const useRecentActivities = (userId, options) => {
  const { limit = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: ["dashboard", "recentActivities", userId, { limit }],
    queryFn: () => fetchRecentActivities(userId, limit),
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

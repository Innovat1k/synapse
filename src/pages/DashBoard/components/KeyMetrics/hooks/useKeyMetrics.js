// Fetches dashboard key metrics (hours, projects, SOL level) with 5-minute cache
import { useQuery } from "@tanstack/react-query";
import { fetchKeyMetrics } from "@services/keyMetricsService";

export const useKeyMetrics = (userId, options = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["dashboard", "keyMetrics", userId],
    queryFn: () => fetchKeyMetrics(userId),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

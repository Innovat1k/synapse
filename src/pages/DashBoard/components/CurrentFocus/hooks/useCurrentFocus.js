// Fetches user's current focus (top skills/activities) over last N days with 5-minute cache
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentFocus } from "@services/currentFocusService";

export const useCurrentFocus = (userId, options = {}) => {
  const { daysBack = 7, enabled = true } = options;

  return useQuery({
    queryKey: ["dashboard", "currentFocus", userId, { daysBack }],
    queryFn: () => fetchCurrentFocus(userId, { daysBack }),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

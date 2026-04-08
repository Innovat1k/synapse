import { useQuery } from "@tanstack/react-query";
import { fetchActivitiesBySkill } from "@services/activityService";

// Fetches skill activities with 5-minute cache (staleTime) to reduce unnecessary refetches
export const useActivitiesQuery = (skillId) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["skill-activities", skillId],
    queryFn: () => fetchActivitiesBySkill(skillId),
    staleTime: 5 * 60 * 1000,
  });

  return { activities, isLoading };
};

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import {
  fetchActivitiesBySkill,
  fetchActivities,
} from "@services/activityService";

// Fetches skill activities with 5-minute cache (staleTime) to reduce unnecessary refetches
export const useActivitiesQuery = (skillId) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["skill-activities", skillId],
    queryFn: () => fetchActivitiesBySkill(skillId),
    enabled: !!skillId,
    staleTime: 5 * 60 * 1000,
  });

  return { activities, isLoading };
};

// Fetches all user activities with 5-minute cache, scoped to current authenticated user
export const useAllActivitiesQuery = () => {
  const { user } = useAuth();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["skill-activities", user?.id],
    queryFn: () => fetchActivities(user?.id),
    staleTime: 5 * 60 * 1000,
  });

  return { activities, isLoading };
};

import { useQuery } from "@tanstack/react-query";
import { fetchActivitiesBySkill } from "@services/activityService";

export const useActivitiesQuery = (skillId) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["skill-activities", skillId],
    queryFn: () => fetchActivitiesBySkill(skillId),
  });

  return { activities, isLoading };
};

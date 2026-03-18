import { fetchSkills } from "@services/skillService";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching the skills.
 * It gives the different fetching states.
 */

export const useSkillsQuery = () => {
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  });

  return { skills, isLoading };
};

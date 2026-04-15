import { fetchSkills } from "@services/skillService";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { user_atom } from "@atoms/atoms";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";

/**
 * Custom hook for fetching the skills.
 * It gives the different fetching states.
 */

export const useSkillsQuery = () => {
  // const user = useAtomValue(user_atom);
  const { user } = useAuth();
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills", user?.id],
    enabled: !!user?.id,
    queryFn: () => fetchSkills(user?.id),
    staleTime: 5 * 60 * 1000,
  });

  return { skills, isLoading };
};

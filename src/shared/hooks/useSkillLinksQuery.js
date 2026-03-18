import { useQuery } from "@tanstack/react-query";
import { fetchAllSkillLinks } from "@services/skillLinksService";

export const useSkillLinksQuery = () => {
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["skill-links", "all"],
    queryFn: fetchAllSkillLinks,
    staleTime: 5 * 60 * 1000,
  });

  return { links, isLoading };
};

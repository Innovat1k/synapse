import { useQuery } from "@tanstack/react-query";
import { fetchSubgraph } from "../../../../../services/subgraphService";

// Fetches a skill dependency subgraph centered on a given skill ID.
// Caches for 5 minutes, skips refetch on focus, and retries only on 5xx server errors.
export const useSubgraph = (centerSkillId = 1) => {
  return useQuery({
    queryKey: ["subgraph", centerSkillId],
    queryFn: () => fetchSubgraph(centerSkillId),
    enabled: !!centerSkillId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry only on server errors (5xx)
      return error?.status >= 500 && failureCount < 2;
    },
    select: (data) => ({
      nodes: data?.nodes ?? [],
      links: data?.links ?? [],
    }),
  });
};

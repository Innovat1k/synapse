import { useQuery } from "@tanstack/react-query";
import { fetchTracks } from "@services/tracksService";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";

// Fetches user tracks with 10-minute cache, scoped to current authenticated user
export const useTracksQuery = () => {
  const { user } = useAuth();

  const {
    data: tracks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => fetchTracks(user?.id),
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return { tracks, isLoading, isError, error };
};

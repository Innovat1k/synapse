import { useQuery } from "@tanstack/react-query";
import { fetchTracks } from "@services/tracksService";

export const useTracksQuery = () => {
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    staleTime: 10 * 60 * 1000,
  });

  return { tracks, isLoading };
};

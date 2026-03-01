import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTrack,
  fetchTracks,
} from "../../../../../services/tracksService";
import { useToast } from "../../../../../shared/components/Toast/hooks/useToast";

// Manages tracks list data, creation flow, and UI state (form open/close, loading, errors).
// Includes caching, toast feedback, and optional pagination prefetching.

export const useTracksPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Manage success and error toast
  const { showNotif } = useToast();

  //Data
  const {
    data: tracks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
    staleTime: 5 * 60 * 1000, // ← AJOUTÉ: 5 minutes
    cacheTime: 10 * 60 * 1000, // ← AJOUTÉ: 10 minutes
  });

  // 4-A: Pagination probable → prefetch next page
  const prefetchNextPage = (page) => {
    queryClient.prefetchQuery({
      queryKey: ["tracks", { page: page + 1 }],
      queryFn: () => fetchTracks({ page: page + 1 }),
      staleTime: 5 * 60 * 1000,
    });
  };

  const { mutateAsync: createTrackAsync, isPending: isCreating } = useMutation({
    mutationFn: createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });

  const handleCreate = async (data) => {
    try {
      const newTrack = await createTrackAsync(data);
      setIsFormOpen(false);
      showNotif(`Track "${newTrack.title}" created successfully!`, "success");
    } catch (err) {
      let message = "Unknown error";
      if (err?.code === "23505") {
        message = `A track with ID "${data.track_id}" already exists.`;
      } else if (err?.message) {
        message = err.message;
      }
      showNotif(`Failed to create track: ${message}`, "error", 6000);
      throw err;
    }
  };

  return {
    handleCreate,
    config: { tracks, isError, error },
    loader: { isCreating, isLoading },
    form: {
      isFormOpen,
      openForm: () => setIsFormOpen(true),
      closeForm: () => setIsFormOpen(false),
    },
    prefetchNextPage,
  };
};

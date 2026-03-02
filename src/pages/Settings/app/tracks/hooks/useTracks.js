import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack, fetchTracks, deleteTrack } from "@services/tracksService";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { useModal } from "@shared/components/Modal/hooks/useModal";

// Manages tracks list data, creation flow, and UI state (form open/close, loading, errors).
// Includes caching, toast feedback, and optional pagination prefetching.

export const useTracks = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState({
    trackId: null,
    trackTitle: null,
  });

  const queryClient = useQueryClient();

  const confirmModal = useModal();

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
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const prefetchNextPage = (page) => {
    queryClient.prefetchQuery({
      queryKey: ["tracks", { page: page + 1 }],
      queryFn: () => fetchTracks({ page: page + 1 }),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Creation
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

  // Deletion
  const { mutateAsync: deleteTrackAsync, isPending: isDeleting } = useMutation({
    mutationFn: (trackId) => deleteTrack(trackId),
  });

  const handleDelete = async (trackId) => {
    const previousTracks = queryClient.getQueryData(["tracks"]);

    queryClient.setQueryData(["tracks"], (old) =>
      old?.filter((track) => track.track_id !== trackId),
    );

    try {
      await deleteTrackAsync(trackId);
      showNotif(`Track deleted successfully!`, "success");
    } catch (err) {
      queryClient.setQueryData(["tracks"], previousTracks);
      showNotif(`Failed to delete track: ${err.message}`, "error", 5000);
    }
  };

  const openDeleteConfirm = (trackId, trackTitle) => {
    setDeleteContext({ trackId, trackTitle });
    confirmModal.openModal();
  };

  const handleConfirmDelete = async () => {
    if (deleteContext.trackId) {
      await handleDelete(deleteContext.trackId);
      confirmModal.closeModal();
    }
  };

  return {
    //🔹 Global data & status
    data: {
      tracks,
      isError,
      error,
    },

    //🔹 Loading states (React Query + mutations)
    status: {
      isLoading,
      isCreating,
      isDeleting,
    },

    //🔹 UI -Creation form
    createForm: {
      isOpen: isFormOpen,
      open: () => setIsFormOpen(true),
      close: () => setIsFormOpen(false),
    },

    //🔹 UI -Modal de suppression
    deleteModal: {
      isOpen: confirmModal.isOpen,
      context: deleteContext, // { trackId, trackTitle }
      open: openDeleteConfirm,
      close: confirmModal.closeModal,
    },

    //🔹 Business actions
    actions: {
      create: handleCreate,
      delete: handleConfirmDelete,
    },

    //🔹 Optimization (optional)
    utils: {
      prefetchNextPage,
    },
  };
};

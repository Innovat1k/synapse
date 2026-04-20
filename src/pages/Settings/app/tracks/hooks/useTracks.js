import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack, fetchTracks, deleteTrack } from "@services/tracksService";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { useModal } from "@shared/components/Modal/hooks/useModal";
import { TOAST_MESSAGES } from "@shared/components/Toast/toastMessages";
import { useTracksQuery } from "@shared/hooks/useTracksQuery";

// Manages tracks list data, creation flow, and UI state (form open/close, loading, errors).
// Includes caching, toast feedback, and optional pagination prefetching.

export const useTracks = (skill = {}) => {
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
  const { tracks = [], isLoading, isError, error } = useTracksQuery();

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
      const _newTrack = await createTrackAsync(data);

      setIsFormOpen(false);
      showNotif(TOAST_MESSAGES.TRACK.CREATE_SUCCESS, "success");
    } catch (err) {
      let message = "Unknown error";
      if (err?.code === "23505") {
        message = `A track with ID "${data.track_id}" already exists.`;
      } else if (err?.message) {
        message = err.message;
      }
      showNotif(message, "error");
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
      showNotif(TOAST_MESSAGES.TRACK.DELETE_SUCCESS, "success");
    } catch {
      queryClient.setQueryData(["tracks"], previousTracks);
      showNotif(TOAST_MESSAGES.TRACK.DELETE_ERROR, "error");
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

  // Filter tracks by skill
  const skillTrack = useMemo(() => {
    if (!skill?.track_id || !tracks.length) {
      return null;
    }
    return tracks.find((track) => track.track_id === skill.track_id);
  }, [skill, tracks]);

  return {
    data: {
      tracks,
      isError,
      error,
      skillTrack,
    },
    status: {
      isLoading,
      isCreating,
      isDeleting,
    },
    createForm: {
      isOpen: isFormOpen,
      open: () => setIsFormOpen(true),
      close: () => setIsFormOpen(false),
    },
    deleteModal: {
      isOpen: confirmModal.isOpen,
      context: deleteContext,
      open: openDeleteConfirm,
      close: confirmModal.closeModal,
    },
    actions: {
      create: handleCreate,
      delete: handleConfirmDelete,
    },
    utils: {
      prefetchNextPage,
    },
  };
};

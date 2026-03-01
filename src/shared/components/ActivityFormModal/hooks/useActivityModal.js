import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@services/activityService";

/**
 * Custom hook that encapsulates modal state and CRUD operations for activity management.
 *
 * Manages:
 * - Modal visibility and mode ("create", "edit", "delete")
 * - Selected activity context for edit/delete actions
 * - Submission state (loading/error handling)
 * - Background scroll locking when modal is open
 * - Automatic cache invalidation via React Query after mutations
 *
 * Integrates with Supabase-backed service functions (`createActivity`, `updateActivity`, `deleteActivity`).
 *
 * @param {string} skillId - ID of the parent skill (used for query invalidation)
 *
 * @returns {Object}
 * - `modal`: { isOpened: boolean, mode: string }
 * - `selectedActivity`: the activity being edited or deleted (or null)
 * - `isSubmitting`: boolean indicating if a mutation is in progress
 * - `methods`: object containing all modal and CRUD handlers
 */

export const useActivityModal = (skillId) => {
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpened: false, mode: "" });

  // Handle background scroll
  useEffect(() => {
    if (modal.isOpened) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "unset";
    }

    return () => {
      document.body.style.overflowX = "unset";
    };
  }, [modal.isOpened]);

  // Methods
  const openCreateModal = () => {
    setModal({ isOpened: true, mode: "create" });
    setSelectedActivity(null);
  };

  const openEditModal = (activity) => {
    setModal({ isOpened: true, mode: "edit" });
    setSelectedActivity(activity);
  };

  const openDeleteModal = (activity) => {
    setModal({ isOpened: true, mode: "delete" });
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setModal({ isOpened: false, mode: "" });
  };

  const handleCloseOverlay = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSaveActivity = async (activityData) => {
    setIsSubmitting(true);
    try {
      if (modal.mode === "create") {
        await createActivity(activityData);
      } else {
        await updateActivity(activityData.id, activityData);
      }

      await queryClient.invalidateQueries({
        queryKey: ["skill-activities", skillId],
      });
      closeModal();
    } catch {
      // TODO: show user-facing error (e.g., toast) in Phase 4
      // For now, log in dev (will be replaced by toast)
      // if (import.meta.env.DEV) {
      //   console.error("Activity form error:", error);
      // }
      // Do NOT rethrow — handle gracefully in UI layer
    } finally {
      setIsSubmitting(false);
      setModal({ mode: "" });
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteActivity(selectedActivity.id);
      await queryClient.invalidateQueries({
        queryKey: ["skill-activities", skillId],
      });
    } catch {
      // TODO: show user-facing error (e.g., toast)
    } finally {
      setSelectedActivity(null);
      setIsSubmitting(false);
      setModal({ isOpened: false, mode: "" });
    }
  };

  return {
    isSubmitting,
    modal,
    selectedActivity,
    methods: {
      openCreateModal,
      openEditModal,
      openDeleteModal,
      closeModal,
      handleCloseOverlay,
      handleSaveActivity,
      handleDelete,
    },
  };
};

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@services/activityService";
import { useToast } from "../../Toast/hooks/useToast";
import { TOAST_MESSAGES } from "../../Toast/toastMessages";

// Manages activity modal state and CRUD operations (create/edit/delete) with toast feedback.
// Locks background scroll when open and invalidates activity queries after mutations.

export const useActivityModal = (skillId) => {
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpened: false, mode: "" });

  const { showNotif } = useToast();

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

      showNotif(
        modal.mode === "create"
          ? TOAST_MESSAGES.ACTIVITY.CREATE_SUCCESS
          : TOAST_MESSAGES.ACTIVITY.UPDATE_SUCCESS, "success"
      );
      closeModal();
    } catch {
      showNotif(
        modal.mode === "create"
          ? TOAST_MESSAGES.ACTIVITY.CREATE_ERROR
          : TOAST_MESSAGES.ACTIVITY.UPDATE_ERROR, "error"
      );
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

      showNotif(TOAST_MESSAGES.ACTIVITY.DELETE_SUCCESS, "success");
    } catch {
      showNotif(TOAST_MESSAGES.ACTIVITY.DELETE_ERROR, "error");
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

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "../../../../services/activityService";

export const useActivityModal = () => {
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
    setModal({ isOpened: false });
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

      await queryClient.invalidateQueries({ queryKey: ["skill-activities"] });
      closeModal();
    } catch (error) {
      console.error("Failed to save activity:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
      setModal({ mode: "" });
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteActivity(selectedActivity.id);
      await queryClient.invalidateQueries({ queryKey: ["skill-activities"] });
    } catch (error) {
      console.error("Failed to delete activity:", error);
      throw error;
    } finally {
      setSelectedActivity(null);
      setIsSubmitting(false);
      setModal({ isOpened: false });
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

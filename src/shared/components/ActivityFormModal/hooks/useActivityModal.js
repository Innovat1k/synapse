import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@services/activityService";
import { useToast } from "../../Toast/hooks/useToast";
import { TOAST_MESSAGES } from "../../Toast/toastMessages";
import { useAtomValue } from "jotai";
import { user_atom } from "@atoms/atoms";
import invalidateDashboardQueries from "@pages/DashBoard/utils/invalidateDashboardQueries";

// Manages activity modal state and CRUD operations (create/edit/delete) with toast feedback.
// Locks background scroll when open and invalidates activity queries after mutations.

export const useActivityModal = (skillId) => {
  const user = useAtomValue(user_atom);
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpened: false, mode: "" });
  const [preselectedSkill, setPreselectedSkill] = useState(null);

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
  const openCreateModal = (skill = null) => {
    setPreselectedSkill(skill);
    setModal({ isOpened: true, mode: "create" });
    setSelectedActivity(null);
  };

  const openEditModal = (activity) => {
    setPreselectedSkill(null);
    setModal({ isOpened: true, mode: "edit" });
    setSelectedActivity(activity);
  };

  const openDeleteModal = (activity) => {
    setPreselectedSkill(null);
    setModal({ isOpened: true, mode: "delete" });
    setSelectedActivity(activity);
  };

  const closeModal = () => {
    setPreselectedSkill(null);
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
      await invalidateDashboardQueries(queryClient, user.id);

      showNotif(
        modal.mode === "create"
          ? TOAST_MESSAGES.ACTIVITY.CREATE_SUCCESS
          : TOAST_MESSAGES.ACTIVITY.UPDATE_SUCCESS,
        "success",
      );
      closeModal();
    } catch {
      showNotif(
        modal.mode === "create"
          ? TOAST_MESSAGES.ACTIVITY.CREATE_ERROR
          : TOAST_MESSAGES.ACTIVITY.UPDATE_ERROR,
        "error",
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
      await invalidateDashboardQueries(queryClient, user.id);

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
    preselectedSkill,
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

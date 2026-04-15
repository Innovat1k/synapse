import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSkill, deleteSkill, updateSkill } from "@services/skillService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Toast/hooks/useToast";
import { TOAST_MESSAGES } from "../../Toast/toastMessages";
import invalidateDashboardQueries from "@pages/DashBoard/utils/invalidateDashboardQueries";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";

/**
 * Custom hook for managing modal.
 * It ensures that modal is opened according to mode : create, update and delete
 * and loads correct values to each mode.
 */

export const useSkillModal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { showNotif } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setModalMode("edit");
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const openDeleteModal = (skill) => {
    setModalMode("delete");
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSkill = async (skillData) => {
    console.log(skillData);

    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await createSkill(skillData);
      } else {
        await updateSkill(skillData.skill_id, skillData);
      }

      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      await invalidateDashboardQueries(queryClient, user.id);

      closeModal();
      showNotif(
        modalMode === "create"
          ? TOAST_MESSAGES.SKILL.CREATE_SUCCESS
          : TOAST_MESSAGES.SKILL.UPDATE_SUCCESS,
        "success",
      );
    } catch {
      showNotif(
        modalMode === "create"
          ? TOAST_MESSAGES.SKILL.CREATE_ERROR
          : TOAST_MESSAGES.SKILL.UPDATE_ERROR,
        "error",
      );
    } finally {
      setIsSubmitting(false);
      setModalMode("");
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteSkill(selectedSkill.skill_id);
      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      await invalidateDashboardQueries(queryClient, user.id);

      navigate("/skills");
      showNotif(TOAST_MESSAGES.SKILL.DELETE_SUCCESS, "success");
    } catch {
      showNotif(TOAST_MESSAGES.SKILL.DELETE_ERROR, "error");
    } finally {
      setSelectedSkill(null);
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return {
    modal: { isModalOpen, modalMode },
    isSubmitting,
    selectedSkill,
    methods: {
      openCreateModal,
      openEditModal,
      closeModal,
      openDeleteModal,
      handleSaveSkill,
      handleDelete,
    },
  };
};

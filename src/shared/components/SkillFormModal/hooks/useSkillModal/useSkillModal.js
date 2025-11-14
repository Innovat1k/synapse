import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  deleteSkill,
  updateSkill,
} from "../../../../../services/skillService";

/**
 * Custom hook for managing modal.
 * It ensures that modal is opened according to mode : create, update and delete
 * and loads correct values to each mode.
 */

export const useSkillModal = () => {
  const queryClient = useQueryClient();

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
    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        await createSkill(skillData);
      } else {
        await updateSkill(skillData.id, skillData);
      }

      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      closeModal();
    } catch (error) {
      console.error("Failed to save skill:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
      setModalMode("");
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteSkill(selectedSkill.id);
      await queryClient.invalidateQueries({ queryKey: ["skills"] });
    } catch (error) {
      console.error("Failed to delete skill:", error);
      throw error;
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

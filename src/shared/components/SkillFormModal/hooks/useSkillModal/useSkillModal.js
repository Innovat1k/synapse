import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  deleteSkill,
  updateSkill,
} from "../../../../../services/skillService";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for managing modal.
 * It ensures that modal is opened according to mode : create, update and delete
 * and loads correct values to each mode.
 */

export const useSkillModal = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        await updateSkill(skillData.skill_id, skillData);
      }

      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      closeModal();
    } catch {
      // TODO: show user-facing error (e.g., toast)
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

      navigate("/skills");
    } catch  {
// TODO: show user-facing error (e.g., toast)
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

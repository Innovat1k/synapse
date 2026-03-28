import { useState } from "react";
import { purgeActivitiesBySkill } from "@services/activityService";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { TOAST_MESSAGES } from "@shared/components/Toast/toastMessages";

export const usePurgeActivities = (skillId, skillName = "") => {
  const [modal, setModal] = useState({
    isOpened: false,
    context: "confirm-step",
  });

  const [typedSkillName, setTypedSkillName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const queryClient = useQueryClient();

  const { showNotif } = useToast();

  // Toogle the modal
  const openPurgeModal = () => {
    setModal((prev) => ({ ...prev, isOpened: true }));
  };

  // Close modal
  const closePurgeModal = () => {
    setModal({ isOpened: false, context: "confirm-step" });
    setHasError(false);
    setTypedSkillName("");
  };

  // Move to verification modal context
  const openFinalVerification = () => {
    setModal((prev) => ({ ...prev, context: "verification-step" }));
  };

  // Change confirmation value
  const handleChange = (e) => {
    const value = e.target.value;
    setTypedSkillName(value);
    if (hasError) {
      setHasError(false);
    }
  };

  const confirmPurge = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typedSkillName !== skillName) {
      setHasError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await purgeActivitiesBySkill(skillId);
      await queryClient.invalidateQueries({
        queryKey: ["skill-activities", skillId],
      });

      showNotif(TOAST_MESSAGES.ACTIVITY.PURGE_SUCCESS, "success");
      setHasError(false);
      setModal({ isOpened: false, context: "confirm-step" });
      setTypedSkillName("");
    } catch {
      showNotif(TOAST_MESSAGES.ACTIVITY.PURGE_ERROR, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    modal,
    isSubmitting,
    hasError,
    typedSkillName,
    handleChange,
    openPurgeModal,
    closePurgeModal,
    confirmPurge,
    openFinalVerification,
  };
};

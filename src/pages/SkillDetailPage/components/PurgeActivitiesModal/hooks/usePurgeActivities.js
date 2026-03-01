import { useState } from "react";
import { purgeActivitiesBySkill } from "@services/activityService";
import { useQueryClient } from "@tanstack/react-query";

export const usePurgeActivities = (skillId, skillName = "") => {
  const [modal, setModal] = useState({
    isOpened: false,
    context: "confirm-step",
  });

  const [typedSkillName, setTypedSkillName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const queryClient = useQueryClient();

  // Toogle the modal
  const openPurgeModal = () => {
    setModal((prev) => ({ ...prev, isOpened: true }));
  };

  // Close modal
  const closePurgeModal = () => {
    setModal({ isOpened: false, context: "confirm-step" });
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

  // Delete all activities from the current skill
  const confirmPurge = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Verify if inputed name matches the skill name
      if (typedSkillName === skillName) {
        await purgeActivitiesBySkill(skillId);
        await queryClient.invalidateQueries({
          queryKey: ["skill-activities", skillId],
        });

        setHasError(false);
      } else {
        setHasError(true);
        throw new Error("The skill name does not match. Please try again.");
      }
    } catch {
      // TODO: show user-facing error (e.g., toast)
    } finally {
      setIsSubmitting(false);
      if (typedSkillName === skillName) {
        setModal({ isOpened: false, context: "confirm-step" });
        setTypedSkillName("");
      }
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

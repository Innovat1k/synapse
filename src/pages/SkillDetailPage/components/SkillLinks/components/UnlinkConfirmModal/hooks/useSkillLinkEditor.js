import { useState } from "react";
import { useDeleteSkillLink } from "../../../hooks/useSkillLinks";
import { useToast } from "@shared/components/ui/Toast/hooks/useToast";
import { TOAST_MESSAGES } from "@shared/components/ui/Toast/toastMessages";

// Manages skill link editing mode and deletion confirmation flow with toast feedback

export const useSkillLinkEditor = (skillId) => {
  const deleteLinkMutation = useDeleteSkillLink(skillId);

  const [isEditing, setIsEditing] = useState(false);
  const [unlinkingLink, setUnlinkingLink] = useState(null);

  const { showNotif } = useToast();

  const removeLink = (link) => {
    setUnlinkingLink(link);
  };

  const cancelRemoval = () => {
    setUnlinkingLink(null);
  };

  // Set or unset Editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const confirmRemoval = () => {
    if (!unlinkingLink) {
      return;
    }

    deleteLinkMutation.mutate(
      {
        linkId: unlinkingLink.id,
        sourceSkillId: unlinkingLink.source_skill_id,
        targetSkillId: unlinkingLink.target_skill_id,
      },
      {
        onSuccess: () => {
          showNotif(TOAST_MESSAGES.LINK.DELETE_SUCCESS, "success");
          cancelRemoval();
        },
        onError: () => {
          showNotif(TOAST_MESSAGES.LINK.DELETE_ERROR, "error");
        },
      },
    );
  };

  return {
    isEditing,
    isLoading: deleteLinkMutation.isPending,
    unlinkingLink,
    methods: {
      removeLink,
      cancelRemoval,
      toggleEditing,
      confirmRemoval,
    },
  };
};

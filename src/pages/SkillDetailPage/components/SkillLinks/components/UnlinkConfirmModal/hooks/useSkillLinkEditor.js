import { useState } from "react";
import { useDeleteSkillLink } from "../../../hooks/useSkillLinks";

export const useSkillLinkEditor = () => {
  const deleteLinkMutation = useDeleteSkillLink();

  const [isEditing, setIsEditing] = useState(false);
  const [unlinkingLink, setUnlinkingLink] = useState(null);

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
    if (!unlinkingLink) return;

    deleteLinkMutation.mutate(
      {
        linkId: unlinkingLink.id,
        sourceSkillId: unlinkingLink.source_skill_id,
        targetSkillId: unlinkingLink.target_skill_id,
      },
      {
        onSuccess: () => {
          cancelRemoval();
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

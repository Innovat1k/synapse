import { useState } from "react";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery/useSkillsQuery";
import { useCreateSkillLink } from "../../../hooks/useSkillLinks";
import { checkExistingLinks } from "@services/skillLinksService";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { TOAST_MESSAGES } from "@shared/components/Toast/toastMessages";

// Manages skill linking form with real-time validation (prevents self-links and duplicates).
// Supports "incoming" (prerequisite) and "outgoing" modes with skill search and selection.

export const useSkillLinkerForm = ({ currentSkillId, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [linkType, setLinkType] = useState("prerequisite");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  // Persisting validation states
  const [hasDirectLink, setHasDirectLink] = useState(false);
  const [hasReverseLink, setHasReverseLink] = useState(false);

  const { showNotif } = useToast();

  const { skills } = useSkillsQuery();
  const createLinkMutation = useCreateSkillLink(currentSkillId);

  // Filter searchTerm
  const filteredSkills = (skills ?? []).filter(
    (skill) =>
      skill.skill_id !== currentSkillId &&
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Complete verificationg while selecting skill to link
  const checkLinks = async (sourceId, targetId) => {
    setIsChecking(true);
    setError("");
    setHasDirectLink(false);
    setHasReverseLink(false);

    try {
      const { hasDirectLink, hasReverseLink } = await checkExistingLinks(
        sourceId,
        targetId,
      );

      setHasDirectLink(hasDirectLink);
      setHasReverseLink(hasReverseLink);
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setError("");
  };

  const handleSelectSkill = (skill) => {
    const newSelected = { id: skill.skill_id, name: skill.name };
    setSelectedSkill(newSelected);
    setError("");

    const isPrerequisiteMode = mode === "incoming";
    const sourceId = isPrerequisiteMode ? newSelected.id : currentSkillId;
    const targetId = isPrerequisiteMode ? currentSkillId : newSelected.id;

    checkLinks(sourceId, targetId);
  };

  const handleChangeLinkType = (type) => {
    setLinkType(type);
    setError("");
  };

  const clearForm = () => {
    setSearchTerm("");
    setSelectedSkill(null);
    setLinkType("prerequisite");
    setError("");
    setHasDirectLink(false);
    setHasReverseLink(false);
  };

  const handleCreateLink = async ({ onClose }) => {
    if (!selectedSkill) {
      return;
    }

    const isPrerequisiteMode = mode === "incoming";
    const sourceId = isPrerequisiteMode ? selectedSkill.id : currentSkillId;
    const targetId = isPrerequisiteMode ? currentSkillId : selectedSkill.id;

    // Self-link
    if (sourceId === targetId) {
      setError("A skill cannot link to itself.");
      return;
    }

    // Client side duplicate
    if (hasDirectLink) {
      setError("This connection already exists between these two skills.");
      return;
    }

    try {
      await createLinkMutation.mutateAsync({
        sourceSkillId: sourceId,
        targetSkillId: targetId,
        type: linkType,
      });
      clearForm();
      onClose();
      showNotif(TOAST_MESSAGES.LINK.CREATE_SUCCESS, "success");
    } catch (error) {
      showNotif(TOAST_MESSAGES.LINK.CREATE_SUCCESS, "success");
      if (error.code === "23505") {
        setError("This connection already exists between these two skills.");
      } else {
        setError("Failed to create link. Please try again.");
      }
    }
  };

  return {
    searchTerm,
    selectedSkill,
    skills: filteredSkills,
    error,
    link: { linkType, hasDirectLink, hasReverseLink },
    loader: { isCreating: createLinkMutation.isPending, isChecking },
    methods: {
      handleChange,
      handleCreateLink,
      handleSelectSkill,
      handleChangeLinkType,
      clearForm,
    },
  };
};

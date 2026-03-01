import { useState } from "react";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery/useSkillsQuery";
import { useCreateSkillLink } from "../../../hooks/useSkillLinks";
import { checkExistingLinks } from "@services/skillLinksService";

/**
 * Manages the form logic for creating a directional skill-to-skill link.
 *
 * Supports two modes:
 * - "incoming": creates a link FROM another skill TO the current skill (e.g., prerequisite)
 * - "outgoing": creates a link FROM the current skill TO another skill
 *
 * Provides real-time validation to prevent:
 * - Self-links (skill → itself)
 * - Duplicate links (same direction already exists)
 * - Conflicting reverse links (optional UX warning)
 *
 * Also handles skill search, selection, and link type (e.g., "prerequisite").
 *
 * @param {Object} options
 * @param {string} options.currentSkillId - ID of the skill being edited
 * @param {'incoming' | 'outgoing'} options.mode - Direction of the new link
 *
 * @returns {{
 *   searchTerm: string,
 *   selectedSkill: { id: string; name: string } | null,
 *   skills: Array<{ skill_id: string; name: string }>,
 *   error: string,
 *   link: { linkType: string; hasDirectLink: boolean; hasReverseLink: boolean },
 *   loader: { isCreating: boolean; isChecking: boolean },
 *   methods: {
 *     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *     handleSelectSkill: (skill: { skill_id: string; name: string }) => Promise<void>,
 *     handleChangeLinkType: (type: string) => void,
 *     handleCreateLink: ({ onClose: () => void }) => Promise<void>,
 *     clearForm: () => void
 *   }
 * }} Form state, validation flags, loading states, and action handlers.
 */

export const useSkillLinkerForm = ({ currentSkillId, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [linkType, setLinkType] = useState("prerequisite");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  // Persisting validation states
  const [hasDirectLink, setHasDirectLink] = useState(false);
  const [hasReverseLink, setHasReverseLink] = useState(false);

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
    if (!selectedSkill) {return;}

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
    } catch (error) {
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

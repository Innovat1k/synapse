import { useState } from "react";

/**
 * Custom hook that resolves the current skill from route parameters and manages
 * the visibility state of its actions submenu (e.g., edit/delete options).
 *
 * @param {string} skillParams - Skill ID from route params (e.g., URL segment)
 * @param {Array} skills - List of available skills to match against
 *
 * @returns {Object}
 * - `skill`: the matched skill object (or undefined if not found)
 * - `actionsMenu`: { isOpened: boolean, handleToggle: Function }
 */

export const useSkillDetail = (skillParams, skills = []) => {
  const [isOpened, setIsOpened] = useState(false);

  // Match skill for the current params
  const skill = skills.find((skill) => skill.skill_id === skillParams);

  // Toggle actions submenu
  const handleToggle = () => {
    setIsOpened(!isOpened);
  };

  return {
    skill,
    actionsMenu: { isOpened, handleToggle },
  };
};

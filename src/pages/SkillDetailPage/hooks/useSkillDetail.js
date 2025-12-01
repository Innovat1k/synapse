import { useState } from "react";

/**
 * Custom ook for managing skill parameter for the unique skill route for details about it.
 * And to handle the opening and closing of submenu and displayed skill infos.
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

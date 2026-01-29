import { useState } from "react";

/**
 * Manages the state of a modal used to create or view skill-to-skill links.
 *
 * Supports two modes:
 * - "incoming": add/view links pointing TO the current skill
 * - "outgoing": add/view links pointing FROM the current skill
 *
 * @param {void} — This hook takes no parameters.
 * @returns {{
 *   linkerModal: { isOpen: boolean; mode: 'incoming' | 'outgoing' | null },
 *   openLinkerModal: (mode: 'incoming' | 'outgoing') => void,
 *   closeLinkerModal: () => void
 * }} Modal state and control functions.
 */

export const useSkillLinkerModal = () => {
  const [linkerModal, setLinkerModal] = useState({
    isOpen: false,
    mode: null,
  });

  const openLinkerModal = (mode) => {
    setLinkerModal({ isOpen: true, mode });
  };

  const closeLinkerModal = () => {
    setLinkerModal({ isOpen: false, mode: null });
  };

  return { linkerModal, openLinkerModal, closeLinkerModal };
};

import { useState } from "react";

// Manages modal state for creating/viewing skill-to-skill links (incoming/outgoing modes)

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

import { useState } from "react";

// Manages open/close state for the skill dependency graph modal
export const useGraphModal = () => {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  const openGraphModal = () => {
    setIsGraphModalOpen(true);
  };

  const closeGraphModal = () => {
    setIsGraphModalOpen(false);
  };

  return { isGraphModalOpen, openGraphModal, closeGraphModal };
};

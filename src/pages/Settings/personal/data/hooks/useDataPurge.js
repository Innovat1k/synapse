import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import invalidateDashboardQueries from "@pages/DashBoard/utils/invalidateDashboardQueries";

import { deleteUserSkills } from "@services/skillService";
import { deleteUserActivities } from "@services/activityService";
import { deleteUserTracks } from "@services/tracksService";

// Purges all user data (skills, activities, tracks) and invalidates dashboard queries
export const useDataPurge = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotif } = useToast();

  const queryClient = useQueryClient();

  const handleReset = async () => {
    setIsDeleting(true);
    try {
      await deleteUserSkills(user?.id);
      await deleteUserActivities(user?.id);
      await deleteUserTracks(user?.id);

      await queryClient.invalidateQueries({ queryKey: ["skills"] });
      await invalidateDashboardQueries(queryClient, user.id);
      await queryClient.invalidateQueries({ queryKey: ["tracks"] });
    } catch (error) {
      showNotif("Failed to delete data", "error");
    } finally {
      setIsDeleting(false);
      setIsResetModalOpen(false);
      showNotif("All data has been deleted", "success");
      navigate("/dashboard");
    }
  };

  return { isResetModalOpen, isDeleting, setIsResetModalOpen, handleReset };
};

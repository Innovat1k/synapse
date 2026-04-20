import { useState } from "react";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery/useSkillsQuery";
import { useAllActivitiesQuery } from "@shared/hooks/useActivitiesQuery/useActivitiesQuery";
import { useTracksQuery } from "@shared/hooks/useTracksQuery";

// Exports user data (skills, activities, tracks) as JSON file with timestamped filename
export const useDataExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const { user } = useAuth();
  const { showNotif } = useToast();

  // Data
  const { skills } = useSkillsQuery();
  const { activities } = useAllActivitiesQuery();
  const { tracks } = useTracksQuery();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = {
        user_id: user?.id,
        exported_at: new Date().toISOString(),
        skills: skills,
        activities: activities,
        tracks: tracks,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `synapse-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotif("Data exported successfully", "success");
    } catch (error) {
      console.error("Export error:", error);
      showNotif("Failed to export data", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, handleExport };
};

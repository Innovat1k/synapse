import { useMemo, useState } from "react";
import { useSkillsQuery } from "../../../shared/hooks/useSkillsQuery/useSkillsQuery";
import { useTracksQuery } from "../../../shared/hooks/useTracksQuery";
import { useSkillLinksQuery } from "../../../shared/hooks/useSkillLinksQuery";

// Orchestrates dashboard data: skills, tracks, and links with dynamic filtering by track/category.
// Computes view mode (global/track/category) and exposes actions to update selections.

export const useDashboardData = () => {
  const [selectedTrackId, setSelectedTrackId] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { skills = [], isLoading: isLoadingSkills } = useSkillsQuery();
  const { tracks = [], isLoading: isLoadingTracks } = useTracksQuery();
  const { links = [], isLoading: isLoadingLinks } = useSkillLinksQuery();

  // Determines current view mode based on active filters
  const mode = useMemo(() => {
    if (selectedCategory) {return "category";}
    if (selectedTrackId !== "all") {return "track";}
    return "global";
  }, [selectedTrackId, selectedCategory]);

  // Filters skills matching both selected track and category (if any)
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesTrack =
        selectedTrackId === "all" || skill.track_id === selectedTrackId;
      const matchesCategory =
        !selectedCategory || skill.category === selectedCategory;
      return matchesTrack && matchesCategory;
    });
  }, [skills, selectedTrackId, selectedCategory]);

  // Extracts unique categories from skills for filter options
  const categories = useMemo(() => {
    const unique = [...new Set(skills.map((s) => s.category).filter(Boolean))];
    return unique.map((cat) => ({ value: cat, label: cat }));
  }, [skills]);

  const currentTrack = useMemo(
    () => tracks.find((t) => t.track_id === selectedTrackId),
    [tracks, selectedTrackId],
  );

  return {
    data: { skills, tracks, links, categories },
    filtered: { skills: filteredSkills, links },
    view: {
      selectedTrackId,
      selectedCategory,
      currentTrack,
      mode,
    },
    actions: {
      selectTrack: setSelectedTrackId,
      selectCategory: setSelectedCategory,
    },
    isLoading: isLoadingSkills || isLoadingTracks || isLoadingLinks,
  };
};

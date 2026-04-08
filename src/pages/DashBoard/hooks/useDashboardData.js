import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchSkills } from "@services/skillService";
import { fetchTracks } from "@services/tracksService";

// Orchestrates dashboard data: skills, tracks, and links with dynamic filtering by track/category.
// Computes view mode (global/track/category) and exposes actions to update selections.

export const useDashboardData = () => {
  const [selectedTrackId, setSelectedTrackId] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [
    { data: skills = [], isLoading: isLoadingSkills },
    { data: tracks = [], isLoading: isLoadingTracks },
  ] = useQueries({
    queries: [
      {
        queryKey: ["skills"],
        queryFn: fetchSkills,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
      },
      {
        queryKey: ["tracks"],
        queryFn: fetchTracks,
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
      },
    ],
  });

  // Determines current view mode based on active filters
  const mode = useMemo(() => {
    if (selectedCategory) {
      return "category";
    }
    if (selectedTrackId !== "all") {
      return "track";
    }
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
    data: { skills, tracks, categories },
    filtered: { skills: filteredSkills },
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
    isLoading: isLoadingSkills || isLoadingTracks,
  };
};

import { useMemo, useState } from "react";

/**
 * Custom hook for managing the fetched skills.
 * It ensures that users can see, search and sort skills.
 */

export const useSkillsList = (skillsData) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all skills");
  const [sortBy, setSortBy] = useState("name");
  const [isAscendant, setIsAscendant] = useState(true);

  const filteredSkills = useMemo(() => {
    let result = [...skillsData];

    // Filter by category
    if (activeCategory === "others") {
      const excluded = ["backend", "devops", "frontend"];
      result = result.filter(
        (skill) => !excluded.includes(skill.category.toLowerCase())
      );
    } else if (activeCategory !== "all skills") {
      result = result.filter(
        (skill) => skill.category.toLowerCase() === activeCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (skill) => skill.name.toLowerCase().includes(term)
        // ||
        // skill.description.toLowerCase().includes(term) ||
        // (skill.tags || []).some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Sort by Ascending / Descending
    if (sortBy === "name") {
      result.sort((a, b) =>
        isAscendant
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (sortBy === "level") {
      result.sort((a, b) =>
        isAscendant ? a.level - b.level : b.level - a.level
      );
    }

    return result;
  }, [skillsData, activeCategory, searchTerm, sortBy, isAscendant]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setIsAscendant(!isAscendant);
    } else {
      setSortBy(field);
      setIsAscendant(true);
    }
  };

  return {
    sortStates: { sortBy, isAscendant },
    handleSort,
    search: { searchTerm, setSearchTerm, filteredSkills },
    skillsCategory: { activeCategory, setActiveCategory },
  };
};

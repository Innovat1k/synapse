import { useMemo } from "react";
import { transformSkillsToGraphData } from "../../../utils/graphHelpers";

// Converts skills and links to graph visualization format (memoized)
export const useGraphData = (skills, links) => {
  return useMemo(
    () => transformSkillsToGraphData(skills, links),
    [skills, links],
  );
};

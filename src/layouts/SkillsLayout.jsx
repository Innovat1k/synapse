import { Outlet } from "react-router-dom";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery";

function SkillsLayout() {
  const { skills, isLoading } = useSkillsQuery();

  return (
    <Outlet
      context={{
        skills,
        isLoading,
      }}
    />
  );
}

export default SkillsLayout;

import { render } from "@testing-library/react";
import SkillDetailPage from "../SkillDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export const MOCK_SKILL_IDS = {
  REACT: "skill-react",
  JAVA: "skill-java",
  PROJECT_MGMT: "skill-project-mgmt",
};

export const mockSkills = [
  {
    name: "React JS",
    skill_id: MOCK_SKILL_IDS.REACT,
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: MOCK_SKILL_IDS.JAVA,
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Project Management",
    skill_id: MOCK_SKILL_IDS.PROJECT_MGMT,
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

export const renderSkillDetailPage = (skillId) => {
  let queryClient;
  let QueryWrapper;

  queryClient = new QueryClient();
  QueryWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/skills/${skillId}`]}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );

  return render(<SkillDetailPage />, { wrapper: QueryWrapper });
};

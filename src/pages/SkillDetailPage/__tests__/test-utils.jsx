import { render } from "@testing-library/react";
import SkillDetailPage from "../SkillDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export const mockSkills = [
  {
    name: "React JS",
    skill_id: "550e8400-e29b-41d4-a716-446655440001",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: "550e8400-e29b-41d4-a716-446655440002",
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Project Management",
    skill_id: "123e4567-e89b-12d3-a456-426614174000",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

export const renderSkillDetailPage = () => {
  let queryClient;
  let QueryWrapper;

  queryClient = new QueryClient();
  QueryWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(<SkillDetailPage />, { wrapper: QueryWrapper });
};

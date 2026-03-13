import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useOutletContext } from "react-router-dom";

export const mockSkills = [
  {
    name: "React JS",
    skill_id: "a3c4e2f1-1234-4f8d-95f3-4f0b9c12e7d2",
    category: "frontend",
    level: 4,
    description:
      "Completed an online React JS course leading to certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Java",
    skill_id: "b7d8e1b9-5fe2-4f6a-951a-d6ecfcfdb6bb",
    category: "backend",
    level: 1,
    description: "Exploring the fundamentals of Java development.",
    tags: ["programming"],
  },
  {
    name: "Digital Painting",
    skill_id: "f3e3c1b1-0b4a-41d5-97e4-9d1f7cfd3834",
    category: "art",
    level: 3,
    description: "Practicing digital illustration using drawing tablets.",
    tags: ["visual", "creativity"],
  },
  {
    name: "Project Management",
    skill_id: "8c4c6f4f-9b77-40b9-9d22-d38c2a423d9d",
    category: "others",
    level: 3,
    description: "Managing small agile projects and coordinating tasks.",
    tags: ["organization"],
  },
];

const sharedQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export const renderComponent = (ui, { skills = [] } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  useOutletContext.mockReturnValue({ skills });

  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      ),
    }),
    queryClient: sharedQueryClient,
  };
};

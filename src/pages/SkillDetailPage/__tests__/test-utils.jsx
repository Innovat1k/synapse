// Test utilities for SkillDetailPage: provider setup, route mocking, and context injection

/* eslint-disable react-refresh/only-export-components */
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import * as routerDom from "react-router-dom";
import SkillDetailPage from "@/pages/SkillDetailPage/SkillDetailPage";
import { mockSkills } from "./mockData";

// Mocks useOutletContext from React Router for testing nested route contexts
export const mockOutletContext = (contextValue) => {
  routerDom.useOutletContext.mockImplementation(() => contextValue);
};

// Renders SkillDetailPage with React Query and routing providers preconfigured for tests.
// Accepts optional skillId to simulate different route params.
export const renderSkillDetailPage = (skillId = "skill-react") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

  mockOutletContext({ skills: mockSkills, isLoading: false });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/skills/${skillId}`]}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );

  return render(<SkillDetailPage />, { wrapper });
};

export { MOCK_SKILL_IDS, mockSkills, mockActivities } from "./mockData";

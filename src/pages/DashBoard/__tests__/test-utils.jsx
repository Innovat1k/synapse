import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { Provider } from "jotai";
import { user_atom, session_atom } from "@atoms/atoms";

const TEST_USER_ID = "025af00a-1837-44e0-b03d-6150e1da4611";

// Factory : fresh client par test → isolation garantie
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Pas de garbage collection retardée
        staleTime: 0, // Données toujours "fraîches" en test
      },
    },
  });

// Provider Jotai avec initialValues → pattern officiel
const JotaiTestProvider = ({ children }) => (
  <Provider
    initialValues={[
      [user_atom, { id: TEST_USER_ID, email: "test@example.com" }],
      [session_atom, { user: { id: TEST_USER_ID }, access_token: "mock" }],
    ]}
  >
    {children}
  </Provider>
);

export const renderWithProviders = (ui, { wrapper: customWrapper } = {}) => {
  const queryClient = createTestQueryClient();

  const AllTheProviders = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReactFlowProvider>
          <JotaiTestProvider>
            {customWrapper ? (
              <customWrapper>{children}</customWrapper>
            ) : (
              children
            )}
          </JotaiTestProvider>
        </ReactFlowProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: AllTheProviders });
};

export { TEST_USER_ID };

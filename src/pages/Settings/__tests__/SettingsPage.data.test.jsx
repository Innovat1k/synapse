import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import DataPrivacyPage from "../personal/data/DataPrivacyPage";
import { beforeEach, describe, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  resetAllStores,
  skillsStore,
  activitiesStore,
  tracksStore,
  TEST_USER_ID,
} from "@mocks/stores";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: TEST_USER_ID } }),
}));

const mockShowNotif = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@shared/components/ui/Toast/hooks/useToast", () => ({
  useToast: () => ({ showNotif: mockShowNotif }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (ui) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </MemoryRouter>
    ),
  });
};

describe("DataPrivacyPage Integration (MSW)", () => {
  let user;
  beforeEach(() => {
    resetAllStores();
    user = userEvent.setup();
  });

  it("allows user to export their account data successfully", async () => {
    expect(skillsStore.length).toBeGreaterThan(0);

    renderWithProviders(<DataPrivacyPage />);

    await user.click(
      await screen.findByRole("button", { name: /delete all data/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /Yes, delete everything/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Yes, delete everything/i),
      ).not.toBeInTheDocument();
    });

    const remainingSkills = skillsStore.filter(
      (s) => s.user_id === TEST_USER_ID,
    );

    const remainingActivities = activitiesStore.filter(
      (a) => a.user_id === TEST_USER_ID,
    );

    const remainingTracks = tracksStore.filter(
      (t) => t.user_id === TEST_USER_ID,
    );

    expect(remainingSkills).toHaveLength(0);
    expect(remainingActivities).toHaveLength(0);
    expect(remainingTracks).toHaveLength(0);

    expect(mockShowNotif).toHaveBeenCalledWith(
      "All data has been deleted",
      "success",
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("allows user to permanently reset all personal data", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    renderWithProviders(<DataPrivacyPage />);

    await user.click(
      await screen.findByRole("button", {
        name: /Download My Data/i,
      }),
    );

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();

      expect(mockShowNotif).toHaveBeenCalledWith(
        "Data exported successfully",
        "success",
      );
    });
  });
});

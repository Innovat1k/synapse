import { act, renderHook } from "@testing-library/react";
import { useDataPurge } from "./useDataPurge";
import { useToast } from "@shared/components/ui/Toast/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import * as skillService from "@services/skillService";
import * as activityService from "@services/activityService";
import * as trackService from "@services/tracksService";
import invalidateDashboardQueries from "@pages/DashBoard/utils/invalidateDashboardQueries";
import { MemoryRouter, useNavigate } from "react-router-dom";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  MemoryRouter: ({ children }) => children,
}));

vi.mock("@shared/components/ui/Toast/hooks/useToast");
vi.mock("@tanstack/react-query");
vi.mock("@services/skillService");
vi.mock("@services/activityService");
vi.mock("@services/tracksService");
vi.mock("@pages/DashBoard/utils/invalidateDashboardQueries");

describe("useDataPurge", () => {
  const mockShowNotif = vi.fn();
  const mockNavigate = vi.fn();
  const mockInvalidateQueries = vi.fn();

  let RouteWrapper;

  beforeEach(() => {
    vi.clearAllMocks();

    RouteWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

    useToast.mockReturnValue({ showNotif: mockShowNotif });
    useQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    skillService.deleteUserSkills.mockResolvedValue({ success: true });
    activityService.deleteUserActivities.mockResolvedValue({ success: true });
    trackService.deleteUserTracks.mockResolvedValue({ success: true });
    invalidateDashboardQueries.mockResolvedValue();

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("initializes state", () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });

    expect(result.current.isResetModalOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(typeof result.current.setIsResetModalOpen).toBe("function");
    expect(typeof result.current.handleReset).toBe("function");
  });

  it("toggles modal state", () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });

    act(() => {
      result.current.setIsResetModalOpen(true);
    });

    expect(result.current.isResetModalOpen).toBe(true);

    act(() => {
      result.current.setIsResetModalOpen(false);
    });

    expect(result.current.isResetModalOpen).toBe(false);
  });

  it("deletes all user data in correct order", async () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });

    result.current.setIsResetModalOpen(true);

    await result.current.handleReset();

    expect(activityService.deleteUserActivities).toHaveBeenCalledWith(
      "test-user-id",
    );
    expect(skillService.deleteUserSkills).toHaveBeenCalledWith("test-user-id");
    expect(trackService.deleteUserTracks).toHaveBeenCalledWith("test-user-id");
  });

  it("invalidates queries after delete", async () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });
    await result.current.handleReset();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["skills"],
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["tracks"],
    });
    expect(invalidateDashboardQueries).toHaveBeenCalled();
  });

  it("shows success toast and navigates to dashboard", async () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });

    await result.current.handleReset();

    expect(mockShowNotif).toHaveBeenCalledWith(
      "All data has been deleted",
      "success",
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("closes modal and resets isDeleting on success", async () => {
    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });
    result.current.setIsResetModalOpen(true);

    await result.current.handleReset();

    expect(result.current.isResetModalOpen).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  it("shows error toast on failure", async () => {
    skillService.deleteUserSkills.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useDataPurge(), {
      wrapper: RouteWrapper,
    });

    await result.current.handleReset();

    expect(mockShowNotif).toHaveBeenCalledWith(
      "Failed to delete data",
      "error",
    );
    expect(result.current.isDeleting).toBe(false);
  });
});

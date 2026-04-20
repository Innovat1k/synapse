import { act, renderHook, waitFor } from "@testing-library/react";
import { useDataExport } from "./useDataExport";
import { useAuth } from "@pages/UserAuthPage/hooks/useAuth";
import { useToast } from "@shared/components/Toast/hooks/useToast";
import { useSkillsQuery } from "@shared/hooks/useSkillsQuery/useSkillsQuery";
import { useAllActivitiesQuery } from "@shared/hooks/useActivitiesQuery/useActivitiesQuery";
import { useTracksQuery } from "@shared/hooks/useTracksQuery";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
  }),
}));

vi.mock("@shared/components/Toast/hooks/useToast");
vi.mock("@shared/hooks/useSkillsQuery/useSkillsQuery");
vi.mock("@shared/hooks/useActivitiesQuery/useActivitiesQuery");
vi.mock("@shared/hooks/useTracksQuery");

describe("useDataExport", () => {
  const mockShowNotif = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();

    useToast.mockReturnValue({ showNotif: mockShowNotif });
    useSkillsQuery.mockReturnValue({ skills: [] });
    useAllActivitiesQuery.mockReturnValue({ activities: [] });
    useTracksQuery.mockReturnValue({ tracks: [] });
  });

  it("initial state: isExporting is false", () => {
    const { result } = renderHook(() => useDataExport());
    expect(result.current.isExporting).toBe(false);
  });

  it("handleExport creates and downloads JSON file", async () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test-url");

    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    const { result } = renderHook(() => useDataExport());

    await act(async () => {
      await result.current.handleExport();
    });

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();

    expect(mockShowNotif).toHaveBeenCalledWith(
      "Data exported successfully",
      "success",
    );
  });

  it("handleExport shows error toast on failure", async () => {
    // 🔇 silence console uniquement pour ce test
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
      throw new Error("fail");
    });

    const { result } = renderHook(() => useDataExport());

    await act(async () => {
      await result.current.handleExport();
    });

    expect(mockShowNotif).toHaveBeenCalledWith(
      "Failed to export data",
      "error",
    );
  });

  it("isExporting returns to false after export", async () => {
    const { result } = renderHook(() => useDataExport());

    await act(async () => {
      await result.current.handleExport();
    });

    expect(result.current.isExporting).toBe(false);
  });
});

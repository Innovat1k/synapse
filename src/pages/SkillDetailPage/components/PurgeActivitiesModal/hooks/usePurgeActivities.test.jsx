import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { usePurgeActivities } from "./usePurgeActivities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as activityService from "@services/activityService";
import { MemoryRouter } from "react-router-dom";

vi.mock("@pages/UserAuthPage/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-123" },
  }),
}));

vi.mock("@services/activityService");

const mockSkillId = "c7f3a2b4-9e6d-4c8a-b1f2-6a9d0e3b5f41";

describe("usePurgeActivities", () => {
  let queryClient;
  let Wrapper;

  beforeEach(() => {
    queryClient = new QueryClient();
    Wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  });

  it("opens activities purge modal with confirmation step attributes", () => {
    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.openPurgeModal();
    });

    expect(result.current.modal.isOpened).toBe(true);
    expect(result.current.modal.context).toBe("confirm-step");
  });

  it("closes the confirmation step then open verification step", () => {
    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.openPurgeModal();
      result.current.openFinalVerification();
    });

    expect(result.current.modal.context).toBe("verification-step");
  });

  it("changes the skill name input value", () => {
    const mockInput = { target: { value: "Javascript" } };

    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.openPurgeModal();
      result.current.openFinalVerification();
      result.current.handleChange(mockInput);
    });

    expect(result.current.typedSkillName).toEqual("Javascript");
  });

  it("purges the activities list then closes the modal if typesSkillName match the current skill name before confirmation", async () => {
    const mockInput = { target: { value: "Javascript" } };

    vi.mocked(activityService.purgeActivitiesBySkill).mockResolvedValue([]);

    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.openPurgeModal();
      result.current.openFinalVerification();
      result.current.handleChange(mockInput);
    });

    await act(async () => {
      await result.current.confirmPurge({ preventDefault: vi.fn() });
    });

    await waitFor(() => {
      expect(activityService.purgeActivitiesBySkill).toHaveBeenCalledWith(
        mockSkillId,
      );
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.modal.isOpened).toBe(false);
    expect(result.current.modal.context).toBe("confirm-step");
    expect(result.current.typedSkillName).toBe("");
    expect(result.current.hasError).toBe(false);
  });

  it("cancels submission and sets error if typedSkillName doesn't match skill name", async () => {
    const mockInput = { target: { value: "Typescript" } };

    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.openPurgeModal();
      result.current.openFinalVerification();
      result.current.handleChange(mockInput);
    });

    await act(async () => {
      await result.current.confirmPurge({ preventDefault: vi.fn() });
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.modal.isOpened).toBe(true);
    expect(result.current.modal.context).toEqual("verification-step");
    expect(activityService.purgeActivitiesBySkill).not.toHaveBeenCalledOnce();
  });

  it("clears error when user edits input after failed submission", async () => {
    const { result } = renderHook(
      () => usePurgeActivities(mockSkillId, "Javascript"),
      { wrapper: Wrapper },
    );

    act(() => {
      result.current.openPurgeModal();
      result.current.openFinalVerification();
      result.current.handleChange({ target: { value: "Wrong" } });
      result.current.confirmPurge({ preventDefault: vi.fn() });
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.handleChange({ target: { value: "J" } });
    });

    expect(result.current.hasError).toBe(false);
  });
});

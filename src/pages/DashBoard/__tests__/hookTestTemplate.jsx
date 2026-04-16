import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const createHookTests = ({
  hookName,
  useHook,
  mockService,
  mockUserId,
  mockData,
  defaultParams = {},
}) => {
  describe(hookName, () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("returns data successfully", async () => {
      mockService.mockResolvedValue(mockData);

      const testUserId = mockUserId || "test-user-id";
      const { result } = renderHook(() => useHook(testUserId, defaultParams), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.data).toBeDefined();
        },
        { timeout: 3000 },
      );

      expect(result.current.data).toEqual(mockData);

      const calls = mockService.mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const firstCall = calls[0];
      expect(firstCall[0]).toBe(testUserId);

      if (firstCall.length > 1) {
        expect(firstCall[1]).toBeDefined();
      }
    });

    it("has isLoading=true during fetch", () => {
      mockService.mockImplementation(() => new Promise(() => {}));

      const testUserId = mockUserId || "test-user-id";
      const { result } = renderHook(() => useHook(testUserId, defaultParams), {
        wrapper: createQueryWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("handles errors correctly", async () => {
      const testError = new Error("Test error");
      mockService.mockRejectedValue(testError);

      const testUserId = mockUserId || "test-user-id";
      const { result } = renderHook(() => useHook(testUserId, defaultParams), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(
        () => {
          const isErrored =
            result.current.isError === true ||
            result.current.status === "error" ||
            result.current.error !== null;
          expect(isErrored).toBe(true);
        },
        { timeout: 3000 },
      );

      expect(result.current.isError || result.current.status === "error").toBe(
        true,
      );
    });

    it("does not fetch if enabled=false", () => {
      mockService.mockResolvedValue(mockData);

      const testUserId = mockUserId || "test-user-id";
      renderHook(
        () => useHook(testUserId, { ...defaultParams, enabled: false }),
        { wrapper: createQueryWrapper() },
      );

      expect(mockService).not.toHaveBeenCalled();
    });
  });
};

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSubgraph } from "./useSubgraph";
import { fetchSubgraph } from "../../../../../services/subgraphService";

vi.mock("../../../../../services/subgraphService");

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockSubgraphData = {
  nodes: [
    { id: 1, name: "React", type: "skill" },
    { id: 2, name: "JavaScript", type: "skill" },
  ],
  links: [{ source: 1, target: 2, type: "requires" }],
};

describe("useSubgraph", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and transform subgraph data when centerSkillId is valid", async () => {
    fetchSubgraph.mockResolvedValue(mockSubgraphData);

    const { result } = renderHook(() => useSubgraph(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      nodes: mockSubgraphData.nodes,
      links: mockSubgraphData.links,
    });
    expect(fetchSubgraph).toHaveBeenCalledWith(1);
  });

  it("should not run query when centerSkillId is falsy", () => {
    const { result } = renderHook(() => useSubgraph(null), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should handle error from service", async () => {
    fetchSubgraph.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSubgraph(1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("Network error");
  });

  it("should use default centerSkillId of 1 when not provided", async () => {
    fetchSubgraph.mockResolvedValue(mockSubgraphData);

    const { result } = renderHook(() => useSubgraph(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSubgraph).toHaveBeenCalledWith(1);
  });

  it("should transform empty response to empty arrays", async () => {
    fetchSubgraph.mockResolvedValue({});

    const { result } = renderHook(() => useSubgraph(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.nodes).toEqual([]);
    expect(result.current.data.links).toEqual([]);
  });

  it("should transform null response to empty arrays", async () => {
    fetchSubgraph.mockResolvedValue(null);

    const { result } = renderHook(() => useSubgraph(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.nodes).toEqual([]);
    expect(result.current.data.links).toEqual([]);
  });

  it("should refetch when centerSkillId changes", async () => {
    fetchSubgraph.mockResolvedValue(mockSubgraphData);

    const { result, rerender } = renderHook(
      ({ centerSkillId }) => useSubgraph(centerSkillId),
      {
        initialProps: { centerSkillId: 1 },
        wrapper,
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ centerSkillId: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSubgraph).toHaveBeenCalledTimes(2);
    expect(fetchSubgraph).toHaveBeenNthCalledWith(1, 1);
    expect(fetchSubgraph).toHaveBeenNthCalledWith(2, 2);
  });
});

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import { useSkills } from "./useSkills";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as skillService from "../../../services/skillService";

vi.mock("../../../services/skillService");

const mockSkills = [
  {
    name: "React js",
    id: 23,
    category: "frontend",
    level: 4,
    description: "Online free react js course to get certification.",
    tags: ["programming", "visual"],
  },
  {
    name: "Code testing",
    id: 7,
    category: "tools",
    level: 2,
    description: "Testing cases for both React js and Javascript.",
    tags: ["tools"],
  },
  {
    name: "Node js",
    id: 3,
    category: "backend",
    level: 1,
    description: "Trying to explore Javascript backend side.",
    tags: ["programming"],
  },
];

describe("useSkills", () => {
  let queryCLient;
  let queryWrapper;

  beforeEach(() => {
    queryCLient = new QueryClient();
    queryWrapper = ({ children }) => (
      <QueryClientProvider client={queryCLient}>{children}</QueryClientProvider>
    );
  });

  it("filters the fetched data by correct category", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    const { result } = renderHook(() => useSkills(), { wrapper: queryWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    act(() => {
      result.current.skillsCategory.setActiveCategory("backend");
    });

    expect(result.current.skillsCategory.activeCategory).toMatch(/backend/i);
    expect(result.current.search.filteredSkills).toEqual([
      {
        category: "backend",
        description: "Trying to explore Javascript backend side.",
        id: 3,
        level: 1,
        name: "Node js",
        tags: ["programming"],
      },
    ]);
  });

  it("filters the fetched data a-z", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    const { result } = renderHook(() => useSkills(), { wrapper: queryWrapper });

    let skillsByName = mockSkills.sort((a, b) => a.name.localeCompare(b.name));

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
      expect(result.current.sortStates.isAscendant).toBeTruthy();
      expect(result.current.search.filteredSkills).toEqual(skillsByName);
    });

    act(() => {
      result.current.handleSort("level");
    });

    let skillsByLevel = mockSkills.sort((a, b) => a.level - b.level);

    await waitFor(() => {
      expect(result.current.sortStates.sortBy).toBe("level");
      expect(result.current.search.filteredSkills).toEqual(skillsByLevel);
    });
  });

  it("filters the fetched data z-a", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    const { result } = renderHook(() => useSkills(), { wrapper: queryWrapper });

    let skillsByZA = mockSkills.sort((a, b) => b.name.localeCompare(a.name));

    act(() => {
      result.current.handleSort("name");
    });

    await waitFor(() => {
      expect(result.current.sortStates.sortBy).toBe("name");
      expect(result.current.sortStates.isAscendant).toBeFalsy();
      expect(result.current.search.filteredSkills).toEqual(skillsByZA);
    });

    let skillsLevelByZA = mockSkills.sort((a, b) => b.level - a.level);

    act(() => {
      result.current.handleSort("level");
    });
    act(() => {
      result.current.handleSort("level");
    });

    await waitFor(() => {
      expect(result.current.sortStates.sortBy).toBe("level");
      expect(result.current.sortStates.isAscendant).toBeFalsy();
      expect(result.current.search.filteredSkills).toEqual(skillsLevelByZA);
    });
  });

  it("returns the correct elements including search params", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    const { result } = renderHook(() => useSkills(), { wrapper: queryWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    act(() => {
      result.current.search.setSearchTerm("node");
    });

    expect(result.current.search.searchTerm).toBe("node");
    expect(result.current.search.filteredSkills).toEqual([
      {
        name: "Node js",
        id: 3,
        category: "backend",
        level: 1,
        description: "Trying to explore Javascript backend side.",
        tags: ["programming"],
      },
    ]);
  });

  it("returns an empty array list if no element includes search params", async () => {
    vi.mocked(skillService.fetchSkills).mockResolvedValue(mockSkills);
    const { result } = renderHook(() => useSkills(), { wrapper: queryWrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });

    act(() => {
      result.current.search.setSearchTerm("julia");
    });

    expect(result.current.search.filteredSkills).toEqual([]);
  });
});

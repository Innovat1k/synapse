import { beforeEach, describe, expect, vi } from "vitest";
import * as activityService from "../../../services/activityService";
import { renderHook, waitFor } from "@testing-library/react";
import { useActivitiesQuery } from "./useActivitiesQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../../services/activityService");

const mockActivities = [
  {
    id: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    skill_id: "550e8400-e29b-41d4-a716-446655440000",
    activity_type: "learning",
    logged_at: "2025-12-27T10:30",
    duration_minutes: 45,
    notes: "Révision des hooks React, notamment useReducer et useContext.",
    created_at: "2025-12-27T10:35:00Z",
    updated_at: "2025-12-27T10:35:00Z",
  },
  {
    id: "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
    skill_id: "550e8400-e29b-41d4-a716-446655440000",
    activity_type: "project work",
    logged_at: "2025-12-26T14:15",
    duration_minutes: 120,
    notes: "Implémentation de la page SkillDetail avec gestion des activités.",
    created_at: "2025-12-26T15:00:00Z",
    updated_at: "2025-12-26T16:20:00Z",
  },
  {
    id: "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0",
    skill_id: "550e8400-e29b-41d4-a716-446655440000",
    activity_type: "teaching/mentoring",
    logged_at: "2025-12-25T09:00",
    duration_minutes: 30,
    notes:
      "Accompagnement d’un junior sur les bonnes pratiques de test avec Vitest.",
    created_at: "2025-12-25T09:10:00Z",
    updated_at: "2025-12-25T09:10:00Z",
  },
];

describe("useActivitiesQuery", () => {
  let queryClient;
  let queryWrapper;

  beforeEach(() => {
    queryClient = new QueryClient();
    queryWrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it("returns the fetched array data if loading is finished", async () => {
    vi.mocked(activityService.fetchActivitiesBySkill).mockResolvedValue(
      mockActivities
    );
    const { result } = renderHook(() => useActivitiesQuery(), {
      wrapper: queryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.activities).toEqual(mockActivities);
    });
  });

  it("exposes isLoading: true while fetching is in progress", async () => {
    const mockPromise = new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              id: "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
              activity_type: "project work",
            },
          ]),
        100
      )
    );
    vi.mocked(activityService.fetchActivitiesBySkill).mockReturnValue(
      mockPromise
    );

    const { result } = renderHook(() => useActivitiesQuery(), {
      wrapper: queryWrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.activities).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.activities).toEqual([
      {
        id: "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
        activity_type: "project work",
      },
    ]);
  });
});

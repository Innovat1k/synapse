import { vi } from "vitest";
import { useRecentActivities } from "./useRecentActivities";
import { fetchRecentActivities } from "@services/recentActivitiesService";
import { createHookTests } from "../../../__tests__/hookTestTemplate";

vi.mock("@services/recentActivitiesService", () => ({
  fetchRecentActivities: vi.fn(),
}));

const mockData = [
  {
    id: "1",
    skill_name: "React",
    duration_minutes: 90,
    logged_at: "2026-04-09T10:00:00Z",
  },
];

createHookTests({
  hookName: "useRecentActivities",
  useHook: useRecentActivities,
  mockService: fetchRecentActivities,
  mockUserId: "025af00a-1837-44e0-b03d-6150e1da4611",
  mockData,
  defaultParams: { limit: 10 },
});

import { vi } from "vitest";
import { useWeeklyProgress } from "./useWeeklyProgress";
import { fetchWeeklyProgress } from "@services/weeklyProgressService";
import { createHookTests } from "../../../__tests__/hookTestTemplate";

vi.mock("@services/weeklyProgressService", () => ({
  fetchWeeklyProgress: vi.fn(),
}));

const mockData = [
  {
    week_start: "2026-04-06",
    week_label: "Apr 06",
    total_minutes: 781,
    activities_count: 4,
  },
];

createHookTests({
  hookName: "useWeeklyProgress",
  useHook: useWeeklyProgress,
  mockService: fetchWeeklyProgress,
  mockUserId: "025af00a-1837-44e0-b03d-6150e1da4611",
  mockData,
  defaultParams: { weeksBack: 8 },
});

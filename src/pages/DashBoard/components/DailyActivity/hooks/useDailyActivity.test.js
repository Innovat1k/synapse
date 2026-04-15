import { vi } from "vitest";
import { useDailyActivity } from "./useDailyActivity";
import { fetchDailyActivity } from "@services/dailyActivityService";
import { createHookTests } from "../../../__tests__/hookTestTemplate";

vi.mock("@services/dailyActivityService", () => ({
  fetchDailyActivity: vi.fn(),
}));

const mockData = [
  {
    day_date: "2026-04-03",
    day_label: "Apr 03",
    total_minutes: 120,
    activities_count: 2,
  },
  {
    day_date: "2026-04-04",
    day_label: "Apr 04",
    total_minutes: 0,
    activities_count: 0,
  },
  {
    day_date: "2026-04-05",
    day_label: "Apr 05",
    total_minutes: 90,
    activities_count: 1,
  },
  {
    day_date: "2026-04-06",
    day_label: "Apr 06",
    total_minutes: 180,
    activities_count: 3,
  },
  {
    day_date: "2026-04-07",
    day_label: "Apr 07",
    total_minutes: 60,
    activities_count: 1,
  },
  {
    day_date: "2026-04-08",
    day_label: "Apr 08",
    total_minutes: 240,
    activities_count: 2,
  },
  {
    day_date: "2026-04-09",
    day_label: "Apr 09",
    total_minutes: 781,
    activities_count: 4,
  },
];

createHookTests({
  hookName: "useDailyActivity",
  useHook: useDailyActivity,
  mockService: fetchDailyActivity,
  mockUserId: "025af00a-1837-44e0-b03d-6150e1da4611",
  mockData,
  defaultParams: { daysBack: 7 },
});

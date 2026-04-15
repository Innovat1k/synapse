import { vi } from "vitest";
import { useKeyMetrics } from "./useKeyMetrics";
import { fetchKeyMetrics } from "@services/keyMetricsService";
import { createHookTests } from "../../../__tests__/hookTestTemplate";

vi.mock("@services/keyMetricsService", () => ({
  fetchKeyMetrics: vi.fn(),
}));

const mockData = {
  hours_this_week: 13.0,
  skills_practiced: 3,
  total_sessions: 4,
};

createHookTests({
  hookName: "useKeyMetrics",
  useHook: useKeyMetrics,
  mockService: fetchKeyMetrics,
  mockUserId: "025af00a-1837-44e0-b03d-6150e1da4611",
  mockData,
  defaultParams: {},
});

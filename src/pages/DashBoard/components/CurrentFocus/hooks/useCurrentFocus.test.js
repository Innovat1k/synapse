import { vi } from "vitest";
import { useCurrentFocus } from "./useCurrentFocus";
import { fetchCurrentFocus } from "@services/currentFocusService";
import { createHookTests } from "../../../__tests__/hookTestTemplate";

vi.mock("@services/currentFocusService", () => ({
  fetchCurrentFocus: vi.fn(),
}));

const mockData = {
  skill_id: "abc-123",
  skill_name: "React",
  skill_level: 3,
  total_minutes: 180,
  activities_count: 5,
};

createHookTests({
  hookName: "useCurrentFocus",
  useHook: useCurrentFocus,
  mockService: fetchCurrentFocus,
  mockUserId: "025af00a-1837-44e0-b03d-6150e1da4611",
  mockData,
  defaultParams: { daysBack: 7 },
});

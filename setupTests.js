import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "@mocks/server";
import { resetAllStores } from "./src/mocks/stores";

// Clear mocks before test
beforeEach(() => {
  vi.clearAllMocks();

  HTMLFormElement.prototype.requestSubmit = function () {
    this.submit();
  };

  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });
});

window.ResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});

afterEach(() => {
  server.resetHandlers();
  resetAllStores();
});

afterAll(() => {
  server.close();
});

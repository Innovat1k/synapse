import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "@mocks/server";
import { resetAllStores } from "./src/mocks/stores";

// Vitest setup: MSW server, mock stores reset, and DOM API polyfills for consistent test environment

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

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

beforeEach(() => {
  resetAllStores();
});

window.ResizeObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(() => {
  server.resetHandlers();
  resetAllStores();
});

afterAll(() => {
  server.close();
});

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }

  observe = () => {
    this.callback([{ isIntersecting: true }]);
  };

  unobserve = () => {};

  disconnect = () => {};
}

global.IntersectionObserver = IntersectionObserverMock;

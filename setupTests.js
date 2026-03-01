import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "./src/mocks/server";

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
    onUnhandledRequest: "error", // Avertit si requête non mockée
  });
});

afterEach(() => {
  server.resetHandlers();
});

// Arrêter proprement à la fin
afterAll(() => {
  server.close();
});

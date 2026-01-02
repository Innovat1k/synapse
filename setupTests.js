import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

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

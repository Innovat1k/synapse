// vi.mock("@react-aria/interactions", async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     // Retourne un hook mocké qui ne tente pas de modifier HTMLElement
//     useFocusVisible: () => ({ isFocusVisible: false }),
//   };
// });

// // ✅ Mock @react-aria/focus aussi (souvent utilisé ensemble)
// vi.mock("@react-aria/focus", async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     ...actual,
//     useFocus: () => ({ focusProps: {} }),
//     useFocusWithin: () => ({ focusWithinProps: {} }),
//   };
// });

import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { server } from "@mocks/server";
import { resetAllStores } from "./src/mocks/stores";

// test/setup.js
// if (!HTMLElement.prototype.focus) {
//   HTMLElement.prototype.focus = function () {};
// } else {
//   // Some JSDOM versions define it as a getter — redefine it
//   Object.defineProperty(HTMLElement.prototype, "focus", {
//     value: function () {},
//     writable: true,
//   });
// }

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

  observe = (element) => {
    this.callback([{ isIntersecting: true }]);
  };

  unobserve = () => {};

  disconnect = () => {};
}

global.IntersectionObserver = IntersectionObserverMock;

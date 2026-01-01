import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

// Mock clipboard API for browser environment
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
  writable: true,
  configurable: true,
});

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo (not available in jsdom)
Element.prototype.scrollTo = vi.fn();

// Mock requestAnimationFrame (not available in jsdom)
global.requestAnimationFrame = vi.fn(
  (callback) => setTimeout(callback, 0) as unknown as number
);
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Fail the test if there are any console logs during test execution
failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnInfo: true,
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnLog: true,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

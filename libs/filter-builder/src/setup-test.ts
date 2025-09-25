import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

// Mock media query hook
vi.mock("@mui/material/useMediaQuery", async () => {
  return {
    default: () => {
      return false;
    },
  };
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

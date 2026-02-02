import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run tests sequentially to avoid race conditions on shared DB
    sequence: {
      concurrent: false,
    },
    // Global setup: start Next dev server once for all tests
    globalSetup: "./tests/vitest.global-setup.ts",
    // Setup file runs before each test file
    setupFiles: ["./tests/vitest.setup.ts"],
    // Increase timeout for integration tests (server startup, network, etc.)
    testTimeout: 30_000,
    hookTimeout: 60_000,
    // Only run files matching *.test.ts in tests/api
    include: ["tests/api/**/*.test.ts"],
    // Project alias for clarity
    name: "api",
  },
});

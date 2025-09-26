import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: "./src/setup-test.ts",
    coverage: {
      provider: "v8",
      reporter: ["html", "text", "json-summary", "json"],
      exclude: ["src/theme", "src/mocks", "src/types", "src/setup-test.ts", "vite.config.ts", "src/**/*.d.ts", "*.js"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    }
  }
})

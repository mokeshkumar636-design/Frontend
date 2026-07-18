import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    // Only run Vitest unit tests — exclude Playwright e2e specs
    include: ['src/test/**/*.{test,spec}.{js,jsx}'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/server.cjs', 'src/test/**', 'node_modules/**'],
      thresholds: {
        lines: 20,
        functions: 20,
        branches: 25,
        statements: 20,
      },
    },
    testTimeout: 10000,
  },
});

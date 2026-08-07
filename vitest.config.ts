import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'dist', '.astro', 'coverage'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx,js}'],
      exclude: ['**/*.astro', '**/*.d.ts', '**/__mocks__/**', 'src/**/*.test.*', 'src/**/*.spec.*'],
      thresholds: {
        branches: 30,
        functions: 30,
        lines: 25,
        statements: 25,
      },
    },
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

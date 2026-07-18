// Global test setup for Vitest + React Testing Library
import '@testing-library/jest-dom';

// Mock window.confirm globally (used in delete & reset)
beforeEach(() => {
  Object.defineProperty(window, 'confirm', {
    writable: true,
    value: vi.fn(() => true),
  });
  // Clear localStorage before each test for a clean state
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

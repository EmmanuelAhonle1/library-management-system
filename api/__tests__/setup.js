/**
 * Jest setup file - runs before all tests
 */

// Set test environment
process.env.NODE_ENV = "test";

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment below lines if you want to suppress console outputs during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Add any global utilities here
};

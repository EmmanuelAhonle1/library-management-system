export default {
  // Use node environment for testing
  testEnvironment: "node",

  // Module name mapping for ES modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Transform settings
  transform: {},

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],

  // Test file patterns
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],

  // Ignore helper files that aren't tests
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/helpers/",
    "/__tests__/setup.js",
  ],

  // Coverage settings
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!app.js", // Exclude main app file from coverage
    "!**/__tests__/**",
  ],

  // Coverage thresholds (optional - remove these if too strict initially)
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};

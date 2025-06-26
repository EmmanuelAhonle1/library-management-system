/**
 * Test helper utilities for the Library Management System
 */

// Sample test data
export const mockUsers = {
  validUser: {
    userID: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    passwordHash: "hashedpassword123",
    isActive: true,
    createdDate: new Date("2024-01-01"),
    lastLoginDate: new Date("2024-01-15"),
  },

  invalidUser: {
    userID: 2,
    firstName: "A", // Too short
    lastName: "123", // Contains numbers
    email: "invalid-email",
    passwordHash: "short",
    isActive: false,
    createdDate: new Date("2024-01-01"),
    lastLoginDate: null,
  },
};

export const mockItems = {
  validBook: {
    itemID: 1,
    title: "Test Book",
    author: "Test Author",
    isbn: "978-0123456789",
    category: "Fiction",
    isAvailable: true,
  },

  unavailableBook: {
    itemID: 2,
    title: "Checked Out Book",
    author: "Another Author",
    isbn: "978-0987654321",
    category: "Non-Fiction",
    isAvailable: false,
  },
};

// Helper functions
export const createTestUser = (overrides = {}) => {
  return { ...mockUsers.validUser, ...overrides };
};

export const createTestItem = (overrides = {}) => {
  return { ...mockItems.validBook, ...overrides };
};

// Database test helpers (for when you add database testing)
export const clearTestDatabase = async () => {
  // TODO: Implement database clearing for tests
  console.log("Clearing test database...");
};

export const seedTestDatabase = async () => {
  // TODO: Implement database seeding for tests
  console.log("Seeding test database...");
};

// Async test helpers
export const waitFor = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Common assertions
export const expectValidationError = (fn, expectedMessage) => {
  expect(fn).toThrow();
  try {
    fn();
  } catch (error) {
    expect(error.message).toContain(expectedMessage);
  }
};

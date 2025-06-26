# Testing Setup for Library Management System API

This guide explains how to run and write tests for the Library Management System API.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Structure

```
__tests__/
├── unit/               # Unit tests (test individual functions/classes)
│   └── basic.test.js   # Example unit tests
├── integration/        # Integration tests (test API endpoints)
│   └── api.test.js     # API endpoint tests
├── helpers/            # Test helper utilities
│   └── testHelpers.js  # Common test data and functions
└── setup.js           # Jest setup file (runs before all tests)
```

## 📝 What We've Set Up

### 1. **Jest Testing Framework**

- Industry-standard JavaScript testing framework
- Provides test runners, assertions, and mocking capabilities
- Configured to work with ES modules (your `"type": "module"` setup)

### 2. **Supertest for API Testing**

- Specialized library for testing HTTP APIs
- Allows you to make requests to your Express app without starting a server
- Perfect for testing your REST endpoints

### 3. **Test Scripts in package.json**

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests and watch for changes
- `npm run test:coverage`: Generate code coverage reports

## 🧪 Writing Tests

### Unit Tests Example

Unit tests verify that individual functions work correctly:

```javascript
describe("My Function", () => {
  it("should return expected result", () => {
    const result = myFunction("input");
    expect(result).toBe("expected output");
  });
});
```

### Integration Tests Example

Integration tests verify that API endpoints work correctly:

```javascript
import request from "supertest";
import app from "../../app.js";

describe("API Tests", () => {
  it("should return 200 for valid endpoint", async () => {
    const response = await request(app).get("/api/endpoint").expect(200);

    expect(response.body).toEqual({ success: true });
  });
});
```

## 🔧 Common Jest Matchers

```javascript
// Equality
expect(value).toBe(4); // Exact equality
expect(value).toEqual({ name: "John" }); // Deep equality

// Truthiness
expect(value).toBeTruthy(); // Is truthy
expect(value).toBeFalsy(); // Is falsy
expect(value).toBeNull(); // Is null
expect(value).toBeUndefined(); // Is undefined

// Numbers
expect(value).toBeGreaterThan(3); // > 3
expect(value).toBeCloseTo(3.14, 2); // Floating point

// Strings
expect(string).toMatch(/pattern/); // Regex match
expect(string).toContain("substring"); // Contains substring

// Arrays
expect(array).toHaveLength(3); // Length is 3
expect(array).toContain("item"); // Contains item

// Exceptions
expect(() => {
  throw new Error("Something");
}).toThrow(); // Function throws error
```

## 🛠️ Test Best Practices

### 1. **Arrange, Act, Assert Pattern**

```javascript
it("should calculate total correctly", () => {
  // Arrange
  const items = [1, 2, 3];

  // Act
  const total = calculateTotal(items);

  // Assert
  expect(total).toBe(6);
});
```

### 2. **Use Descriptive Test Names**

```javascript
// Good ✅
it("should return 400 when email is missing from registration");

// Bad ❌
it("should fail");
```

### 3. **Test Both Success and Failure Cases**

```javascript
describe("User validation", () => {
  it("should accept valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});
```

### 4. **Use beforeEach for Setup**

```javascript
describe("User tests", () => {
  let user;

  beforeEach(() => {
    user = new User("John", "Doe");
  });

  it("should have correct name", () => {
    expect(user.fullName()).toBe("John Doe");
  });
});
```

## 🎯 Next Steps

1. **Write tests for your existing classes**:

   - Start with simple utility functions
   - Move to more complex classes like `User`, `Item`, etc.

2. **Add API endpoint tests**:

   - Test successful responses
   - Test error conditions
   - Test input validation

3. **Mock external dependencies**:

   - Database connections
   - External APIs
   - File system operations

4. **Aim for good test coverage**:
   - The current setup has coverage thresholds set to 30%
   - Gradually increase these as you add more tests

## 🔍 Debugging Tests

### View detailed output:

```bash
npm test -- --verbose
```

### Run specific test files:

```bash
npm test -- api.test.js
```

### Run tests matching a pattern:

```bash
npm test -- --testNamePattern="should return"
```

## 🤝 Getting Help

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Supertest Documentation**: https://github.com/visionmedia/supertest
- **Testing Best Practices**: https://github.com/goldbergyoni/javascript-testing-best-practices

Happy Testing! 🧪✨

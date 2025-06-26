// Simple unit test example for demonstration
describe("Basic JavaScript Unit Tests", () => {
  describe("String utilities", () => {
    it("should concatenate strings correctly", () => {
      const result = "Hello" + " " + "World";
      expect(result).toBe("Hello World");
    });

    it("should check string length", () => {
      const testString = "Testing";
      expect(testString.length).toBe(7);
    });
  });

  describe("Array operations", () => {
    it("should add items to array", () => {
      const items = [];
      items.push("item1");
      items.push("item2");

      expect(items).toHaveLength(2);
      expect(items).toContain("item1");
      expect(items).toContain("item2");
    });

    it("should filter array correctly", () => {
      const numbers = [1, 2, 3, 4, 5];
      const evenNumbers = numbers.filter((num) => num % 2 === 0);

      expect(evenNumbers).toEqual([2, 4]);
    });
  });

  describe("Object manipulation", () => {
    it("should create and modify objects", () => {
      const user = {
        name: "John",
        age: 25,
      };

      user.email = "john@example.com";

      expect(user.name).toBe("John");
      expect(user.age).toBe(25);
      expect(user.email).toBe("john@example.com");
    });
  });

  describe("Async operations", () => {
    it("should handle promises", async () => {
      const asyncFunction = () => {
        return new Promise((resolve) => {
          setTimeout(() => resolve("Success"), 100);
        });
      };

      const result = await asyncFunction();
      expect(result).toBe("Success");
    });
  });
});

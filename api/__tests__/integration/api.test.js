import request from "supertest";
import app from "../../app.js";

// Set environment to test to prevent server from starting
process.env.NODE_ENV = "test";

describe("API Integration Tests", () => {
  // Test the root endpoint
  describe("GET /", () => {
    it('should return status "Running"', async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.body).toEqual({
        Status: "Running",
      });
    });

    it("should return JSON content type", async () => {
      const response = await request(app)
        .get("/")
        .expect("Content-Type", /json/);
    });
  });

  // Example test for a non-existent endpoint
  describe("GET /nonexistent", () => {
    it("should return 404 for non-existent routes", async () => {
      await request(app).get("/nonexistent").expect(404);
    });
  });
});

import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.API_PORT || 3001;

// Health check endpoint - returns the server status
app.get("/", (req, res) => {
  const status = {
    Status: "Running",
  };
  res.json(status);
});

// Use all routes with /api prefix
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Only start the server if this file is run directly (not imported for testing)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Server Listening on PORT: ", PORT);
  });
}

// Export the app for testing
export default app;

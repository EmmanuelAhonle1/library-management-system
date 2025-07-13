import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Configure dotenv with absolute path to ensure it works regardless of where the app is started from
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

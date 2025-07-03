export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({ error: "Resource not found" });
  }

  // Default error response
  res.status(500).json({ error: "Internal server error" });
};

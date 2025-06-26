import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

// Only start the server if this file is run directly (not imported for testing)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("Server Listening on PORT: ", PORT);
  });
}

// Export the app for testing
export default app;

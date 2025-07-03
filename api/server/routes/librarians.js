import express from "express";
import { librarianController } from "../controllers/librarianController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Librarian-specific routes (protected)
router.get("/dashboard", authenticateUser, librarianController.getDashboard);
router.get("/clients", authenticateUser, librarianController.getAllClients);
router.get(
  "/overdue-items",
  authenticateUser,
  librarianController.getOverdueItems
);
router.post("/items", authenticateUser, librarianController.addItem);
router.put("/items/:itemId", authenticateUser, librarianController.updateItem);
router.delete(
  "/items/:itemId",
  authenticateUser,
  librarianController.deleteItem
);

export default router;

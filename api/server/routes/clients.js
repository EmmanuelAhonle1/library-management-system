import express from "express";
import { clientController } from "../controllers/clientController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Client-specific routes (protected)
router.get("/profile", authenticateUser, clientController.getProfile);
router.put("/profile", authenticateUser, clientController.updateProfile);
router.get(
  "/borrowed-items",
  authenticateUser,
  clientController.getBorrowedItems
);
router.post(
  "/checkout/:itemId",
  authenticateUser,
  clientController.checkoutItem
);
router.post("/return/:itemId", authenticateUser, clientController.returnItem);

export default router;

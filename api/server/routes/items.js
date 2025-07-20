import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { itemController } from "../controllers/itemController.js";

const router = express.Router();

// Search items route - protected by authentication
router.get("/search", authenticateUser, itemController.searchItems);

export default router;

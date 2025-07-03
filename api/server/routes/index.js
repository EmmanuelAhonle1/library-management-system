import express from "express";
import authRoutes from "./auth.js";
import clientRoutes from "./clients.js";
import librarianRoutes from "./librarians.js";

const router = express.Router();

// Mount all routes
router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/librarians", librarianRoutes);

export default router;

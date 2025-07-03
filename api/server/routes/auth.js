import express from "express";

import { authController } from "../controllers/authController.js";
import { validateUserType } from "../middleware/validation.js";

const router = express.Router();

router.post("/sign-up/:userType", validateUserType, authController.signUp);
router.post("/login/:userType", validateUserType, authController.login);

export default router;

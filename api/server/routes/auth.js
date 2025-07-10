import express from "express";

import { authController } from "../controllers/authController.js";
import { validateUserType } from "../middleware/validation.js";

const router = express.Router();

router.post("/:userType/sign-up", validateUserType, authController.signUp);
router.post("/:userType/login", validateUserType, authController.login);

export default router;

import express from "express";
import { AuthController } from "../controllers/authController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register-user", AuthController.registerUser);
router.post("/register-admin", authenticate, authorizeAdmin, AuthController.registerAdmin);
router.post("/login", AuthController.login);
router.post("/oauth-check", AuthController.oauthCheck);

export default router;

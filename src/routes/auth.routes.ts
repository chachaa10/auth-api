import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();
const authController = new AuthController(authService);

export const authRouter = Router();

// Public routes
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));

// Protected routes
authRouter.post("/refresh", (req, res) => authController.refresh(req, res));
authRouter.post("/logout", (req, res) => authController.logout(req, res));

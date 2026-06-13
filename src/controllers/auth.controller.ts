import { registerSchema } from "@/validator/register.validator";
import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const validateInput = await registerSchema.safeParseAsync({ email, password });

      const errors = validateInput.error?.issues.map((issue) => issue.message);

      if (!validateInput.success) {
        return res.status(422).json({ success: false, errors });
      }

      await this.authService.register(email, password);
      res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const validateInput = await registerSchema.safeParseAsync({ email, password });

      const errors = validateInput.error?.issues.map((issue) => issue.message);

      if (!validateInput.success) {
        return res.status(422).json({ success: false, errors });
      }

      const { user, accessToken, refreshToken } = await this.authService.login(email, password);

      const { email: userEmail, id } = user;

      const tokenAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokenAge,
      });

      res.status(200).json({
        success: true,
        data: { user: { email: userEmail, id }, accessToken },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Refresh Token
  async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies["refreshToken"];
      if (!token) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
      }

      const accessToken = await this.authService.refresh(token);

      res.status(200).json(accessToken);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  async logout(req: Request, res: Response) {
    const token = req.cookies["refreshToken"];

    if (!token) {
      return res.status(400).json({ success: false, message: "No refresh token provided" });
    }

    try {
      await this.authService.logout(token);

      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.status(400).json({ success: false, message: "Invalid refresh token" });
    }
  }
}

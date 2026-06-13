import { env } from "@/config";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = env.JWT_ACCESS_SECRET;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No authorization header" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

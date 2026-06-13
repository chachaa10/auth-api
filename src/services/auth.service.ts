import { db } from "@/database/db";
import { refreshTokens, users } from "@/database/schema";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/tokens";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

export class AuthService {
  async register(email: string, password: string) {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await argon2.hash(password);

      const result = await db.insert(users).values({
        email,
        hashedPassword,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("[Drizzle Error]: Registration failed");
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await argon2.verify(user.hashedPassword, password);

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt,
      });

      return { user, accessToken, refreshToken };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("[Drizzle Error]: Login failed");
    }
  }

  async logout(refreshToken: string) {
    try {
      await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("[Drizzle Error]: Logout failed");
    }
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    try {
      const stored = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, refreshToken),
      });

      if (!stored) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = signAccessToken(payload.userId);

      return accessToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("[Drizzle Error]: Refresh failed");
    }
  }
}

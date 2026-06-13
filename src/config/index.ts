// Environment variables configuration
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().min(1, "PORT is required"),
  NODE_ENV: z.enum(["development", "production", "test"], "NODE_ENV is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = z.treeifyError(result.error);
  console.error("❌️ Invalid environment variables", errors);

  // Crash the process immediately to prevent misconfigured runs
  process.exit(1);
}

// Fully typed environment variables
export const env = result.data;

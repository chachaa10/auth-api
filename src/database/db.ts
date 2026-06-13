import { env } from "@/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * Database connection using Drizzle ORM with Node.js PostgreSQL driver
 * Configured with DATABASE_URL from environment variables
 * Uses snake_case for column names
 */
export const db = drizzle(env.DATABASE_URL, { schema, casing: "snake_case" });

export type Database = typeof db;

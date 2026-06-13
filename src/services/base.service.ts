import type { Database } from "@/database/db";

export interface BaseService {
  db: Database;
}

import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const registerSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `${MIN_PASSWORD_LENGTH} characters`)
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one number"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

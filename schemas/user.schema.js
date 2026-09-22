// schemas/user.schema.js
// zod schemas for the /users routes. The validate middleware
// runs these before the controller is reached.

import { z } from "zod";

// A valid MongoDB ObjectId is exactly 24 hex characters.
export const objectIdSchema = z
  .string({ error: "Invalid ObjectId" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// POST /users/signup  body: { name, email, password }
// Every string is trimmed first, so "   " counts as empty and fails.
export const signupSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase() // store emails lowercase so they are case-insensitively unique
    .min(1, "Email is required")
    .email("Email must be a valid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// GET /users/:id  params: { id }
export const userParamsSchema = z.object({
  id: objectIdSchema,
});
// schemas/comment.schema.js
// zod schemas for the comment routes.

import { z } from "zod";

// A valid MongoDB ObjectId is exactly 24 hex characters.
export const objectIdSchema = z
  .string({ error: "Invalid ObjectId" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// The text rules are shared by create and update.
// Trimmed first, so "   " counts as empty and fails.
const textSchema = z
  .string({ error: "Text is required" })
  .trim()
  .min(1, "Text is required")
  .max(300, "Text must be at most 300 characters");

// POST /posts/:postId/comments  body: { userId, text }
export const createCommentSchema = z.object({
  userId: objectIdSchema,
  text: textSchema,
});

// PATCH /comments/:id  body: { text }
export const updateCommentSchema = z.object({
  text: textSchema,
});

// /comments/:id  params: { id }
export const commentParamsSchema = z.object({
  id: objectIdSchema,
});
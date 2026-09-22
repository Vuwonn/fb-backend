// schemas/post.schema.js
// zod schemas for the /posts routes.

import { z } from "zod";

// A valid MongoDB ObjectId is exactly 24 hex characters.
export const objectIdSchema = z
  .string({ error: "Invalid ObjectId" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// The caption rules are shared by create and update.
// Trimmed first, so "   " counts as empty and fails.
const captionSchema = z
  .string({ error: "Caption is required" })
  .trim()
  .min(1, "Caption is required")
  .max(500, "Caption must be at most 500 characters");

// POST /posts  body: { userId, caption }
export const createPostSchema = z.object({
  userId: objectIdSchema,
  caption: captionSchema,
});

// PATCH /posts/:id  body: { caption }
export const updatePostSchema = z.object({
  caption: captionSchema,
});

// POST /posts/:postId/like  body: { userId }
export const likeSchema = z.object({
  userId: objectIdSchema,
});

// /posts/:id  params: { id }
export const postParamsSchema = z.object({
  id: objectIdSchema,
});

// /posts/:postId/...  params: { postId }
export const postIdParamsSchema = z.object({
  postId: objectIdSchema,
});
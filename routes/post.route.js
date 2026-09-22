// routes/post.route.js
// All /posts endpoints (CRUD + the like toggle).

import { Router } from "express";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/post.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createPostSchema,
  updatePostSchema,
  likeSchema,
  postParamsSchema,
  postIdParamsSchema,
} from "../schemas/post.schema.js";

const router = Router();

router.post("/posts", validate({ body: createPostSchema }), createPost);
router.get("/posts", listPosts);
router.get("/posts/:id", validate({ params: postParamsSchema }), getPost);
router.patch(
  "/posts/:id",
  validate({ params: postParamsSchema, body: updatePostSchema }),
  updatePost
);
router.delete("/posts/:id", validate({ params: postParamsSchema }), deletePost);
router.post(
  "/posts/:postId/like",
  validate({ params: postIdParamsSchema, body: likeSchema }),
  toggleLike
);

export default router;
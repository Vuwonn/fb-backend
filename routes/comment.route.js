// routes/comment.route.js
// All comment endpoints. Creating/listing comments goes through the
// post id; editing/deleting them goes through the comment id.

import { Router } from "express";
import {
  createComment,
  listComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
  commentParamsSchema,
} from "../schemas/comment.schema.js";
import { postIdParamsSchema } from "../schemas/post.schema.js";

const router = Router();

router.post(
  "/posts/:postId/comments",
  validate({ params: postIdParamsSchema, body: createCommentSchema }),
  createComment
);
router.get(
  "/posts/:postId/comments",
  validate({ params: postIdParamsSchema }),
  listComments
);
router.patch(
  "/comments/:id",
  validate({ params: commentParamsSchema, body: updateCommentSchema }),
  updateComment
);
router.delete("/comments/:id", validate({ params: commentParamsSchema }), deleteComment);

export default router;
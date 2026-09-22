// controllers/comment.controller.js
// Handles comment routes. Comments always belong to an existing
// post, and comment authors must already exist too.

import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// POST /posts/:postId/comments  body: { userId, text }
export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  // Both the post and the user must exist before we attach a comment.
  const [post, user] = await Promise.all([
    Post.findById(postId),
    User.findById(userId),
  ]);

  if (!post) {
    return res.status(404).json({
      success: false,
      errors: { postId: "Post not found" },
    });
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      errors: { userId: "User not found" },
    });
  }

  const comment = await Comment.create({ post: postId, user: userId, text });

  // Add the author's name to the response (only the name is populated).
  await comment.populate("user", "name");

  res.status(201).json({ success: true, data: comment });
};

// GET /posts/:postId/comments  -> newest first
export const listComments = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      errors: { postId: "Post not found" },
    });
  }

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "name");

  res.json({ success: true, data: comments });
};

// PATCH /comments/:id  body: { text }
export const updateComment = async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true } // return the updated document
  ).populate("user", "name");

  if (!comment) {
    return res.status(404).json({
      success: false,
      errors: { id: "Comment not found" },
    });
  }

  res.json({ success: true, data: comment });
};

// DELETE /comments/:id
export const deleteComment = async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      errors: { id: "Comment not found" },
    });
  }

  res.json({
    success: true,
    data: { id: comment._id, deleted: true },
  });
};
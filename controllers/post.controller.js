// controllers/post.controller.js
// Handles /posts routes (CRUD) plus the like toggle.

import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// Count comments for EVERY post in a single query.
// Returns a Map: { "<postId>": <number of comments> }.
async function commentCountByPost() {
  const rows = await Comment.aggregate([
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [row._id.toString(), row.count]));
}

// Convert a post document into the JSON the frontend expects:
//   { id, user, caption, likesCount, commentsCount, createdAt, updatedAt }
// "counts" (optional) is the Map from commentCountByPost(), used when we
// already know the counts for many posts; otherwise one query is run.
async function toPostJSON(post, counts) {
  const json = post.toJSON(); // applies the model's id/_id transform

  json.likesCount = post.likes.length; // likes is an array of user ids
  json.commentsCount = counts
    ? counts.get(post.id) ?? 0
    : await Comment.countDocuments({ post: post._id });

  delete json.likes; // the raw id array is an internal detail

  return json;
}

// POST /posts  body: { userId, caption }
export const createPost = async (req, res) => {
  const { userId, caption } = req.body;

  // The userId in the body must point to a real user.
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      errors: { userId: "User not found" },
    });
  }

  const post = await Post.create({ user: userId, caption });

  // Add the creator's name to the response (only the name is populated).
  await post.populate("user", "name");

  res.status(201).json({ success: true, data: await toPostJSON(post) });
};

// GET /posts  -> newest first
export const listPosts = async (req, res) => {
  const [posts, counts] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).populate("user", "name"),
    commentCountByPost(),
  ]);

  const data = [];
  for (const post of posts) {
    data.push(await toPostJSON(post, counts));
  }

  res.json({ success: true, data });
};

// GET /posts/:id
export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "name");

  if (!post) {
    return res.status(404).json({
      success: false,
      errors: { id: "Post not found" },
    });
  }

  res.json({ success: true, data: await toPostJSON(post) });
};

// PATCH /posts/:id  body: { caption }
export const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { caption: req.body.caption },
    { new: true } // return the updated document
  ).populate("user", "name");

  if (!post) {
    return res.status(404).json({
      success: false,
      errors: { id: "Post not found" },
    });
  }

  res.json({ success: true, data: await toPostJSON(post) });
};

// DELETE /posts/:id  -> also removes that post's comments
export const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      errors: { id: "Post not found" },
    });
  }

  // Comments would otherwise become orphans pointing at a dead post.
  await Comment.deleteMany({ post: post._id });

  res.json({
    success: true,
    data: { id: post._id, deleted: true },
  });
};

// POST /posts/:postId/like  body: { userId }  -> toggles like/unlike
export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

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

  // likes stores raw ObjectIds, so compare them as strings.
  const liked = post.likes.some((id) => id.toString() === userId);

  if (liked) {
    // Unlike: keep every id except this user's.
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    // Like: append the user id.
    post.likes.push(userId);
  }

  await post.save();

  res.json({
    success: true,
    data: { liked: !liked, likesCount: post.likes.length },
  });
};
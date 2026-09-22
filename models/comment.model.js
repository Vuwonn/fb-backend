// models/comment.model.js
// The Comment collection. A comment belongs to one post and one user.

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      minlength: [1, "Text is required"],
      maxlength: [300, "Text must be at most 300 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Return "id" instead of "_id" and hide the internal "__v".
commentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Comment", commentSchema);
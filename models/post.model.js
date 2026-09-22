// models/post.model.js
// The Post collection. A post belongs to one user and stores
// an array of user ids who liked it.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      minlength: [1, "Caption is required"],
      maxlength: [500, "Caption must be at most 500 characters"],
      trim: true,
    },
    likes: {
      // array of User ids that liked this post
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

// Return "id" instead of "_id" and hide the internal "__v".
postSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Post", postSchema);
// models/user.model.js
// The User collection. Password is hashed before saving
// and never returned in any response.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Mongo creates a unique index -> duplicate emails are rejected
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hidden from queries unless explicitly requested
    },
  },
  { timestamps: true }
);

// Hash the password right before a user is saved (signup).
// The salt (10 rounds) is the standard, safe default for bcrypt.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Shape every response the same way:
//   - return "id" instead of "_id"
//   - drop the internal "__v"
//   - never expose the password hash
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
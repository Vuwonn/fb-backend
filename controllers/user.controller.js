// controllers/user.controller.js
// Handles /users routes. Validation already ran (see routes + schemas),
// so these only contain the request logic.

import User from "../models/user.model.js";

// POST /users/signup  body: { name, email, password }
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Friendlier 409 than waiting for the unique index to complain.
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({
      success: false,
      errors: { email: "Email already exists" },
    });
  }

  // The pre-save hook in the model hashes the password for us.
  const user = await User.create({ name, email, password });

  // The model's toJSON removes the password, so it never reaches the client.
  res.status(201).json({ success: true, data: user });
};

// GET /users
// The frontend calls this to build a "pick a user" dropdown (no login).
export const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

// GET /users/:id
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      errors: { id: "User not found" },
    });
  }

  res.json({ success: true, data: user });
};
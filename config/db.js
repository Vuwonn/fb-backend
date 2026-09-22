// config/db.js
// Connects to MongoDB using the MONGO_URI from .env.
// We pass dbName explicitly so the URI does not need to include one.

import mongoose from "mongoose";

export const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "facebook_clone",
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};
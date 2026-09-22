
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import dns from 'dns';

import { connectDB } from "./config/db.js";
import { swaggerDocument } from "./config/swagger.js";

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

import { notFound, errorHandler } from "./middlewares/error.js";

// Load MONGO_URI (and any other vars) from .env into process.env.
dotenv.config();

const app = express();

// Allow the frontend to call this API from any origin.
app.use(cors());

// Parse JSON request bodies into req.body.
app.use(express.json());

// Swagger UI — open http://localhost:3000/api-docs in the browser.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// All API routes live under /api/v1.
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);

// 404 for anything above that matched nothing, then the error handler.
app.use(notFound);
app.use(errorHandler);

const PORT = 3000;
dns.setServers(['8.8.8.8'])

// Start the server only after the database is connected.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
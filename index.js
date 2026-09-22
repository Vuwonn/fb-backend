
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
// Serve the swagger-ui-dist assets from the repo (Vercel's serverless
// bundler doesn't ship the ones inside node_modules).
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "swagger-ui-dist"), { index: false })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route listing all available routes.
app.get("/", (_req, res) => {
  const endpoints = [
    { method: "GET", path: "/", description: "This route list" },
    { method: "GET", path: "/api-docs", description: "Swagger UI" },
    { method: "POST", path: "/api/users/signup", description: "Create a user" },
    { method: "GET", path: "/api/users", description: "List users" },
    { method: "GET", path: "/api/users/:id", description: "Get a user" },
    { method: "POST", path: "/api/posts", description: "Create a post" },
    { method: "GET", path: "/api/posts", description: "List posts" },
    { method: "GET", path: "/api/posts/:id", description: "Get a post" },
    { method: "PATCH", path: "/api/posts/:id", description: "Update a post" },
    { method: "DELETE", path: "/api/posts/:id", description: "Delete a post" },
    { method: "POST", path: "/api/posts/:postId/like", description: "Toggle like on a post" },
    { method: "POST", path: "/api/posts/:postId/comments", description: "Create a comment" },
    { method: "GET", path: "/api/posts/:postId/comments", description: "List comments for a post" },
    { method: "PATCH", path: "/api/comments/:id", description: "Update a comment" },
    { method: "DELETE", path: "/api/comments/:id", description: "Delete a comment" },
  ];
  res.json({ message: "Facebook API", endpoints });
});

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
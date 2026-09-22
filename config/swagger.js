// config/swagger.js
// OpenAPI 3 definition served by swagger-ui-express at /api-docs.
// Every endpoint is documented with examples so "Try it out" works
// straight from the browser.

// ---- small helpers to keep the paths section readable ----
const ok = (description, example) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/SuccessResponse" },
      example,
    },
  },
});

const created = ok; // 201 and 200 share the same envelope shape

const badRequest = (example) => ({
  description: "Validation failed or invalid ObjectId",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example,
    },
  },
});

const notFound = (example) => ({
  description: "Resource not found",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example,
    },
  },
});

const conflict = (example) => ({
  description: "Conflict (e.g. duplicate email)",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      example,
    },
  },
});

const badObjectId = "64c9f2c9b3d4a5e6f7a8b9c0"; // example (technically any 24 hex chars)

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Facebook Clone API",
    version: "1.0.0",
    description:
      "A simple REST API for frontend practice. No authentication: the " +
      "userId always comes from the request body.",
  },
  servers: [{ url: "http://localhost:3000/api/v1" }],
  tags: [
    { name: "Users", description: "Signup and user listing" },
    { name: "Posts", description: "Post CRUD and likes" },
    { name: "Comments", description: "Comments under a post" },
  ],
  components: {
    schemas: {
      // Shared envelopes
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { description: "The requested resource (shape depends on the endpoint)" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          errors: {
            type: "object",
            description: "fieldName -> error message",
            example: { caption: "Caption is required" },
          },
        },
      },

      // Resources
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          name: { type: "string", example: "Ada Lovelace" },
          email: { type: "string", example: "ada@example.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        description: "Password is never returned.",
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          caption: { type: "string", example: "Hello world!" },
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
              name: { type: "string", example: "Ada Lovelace" },
            },
          },
          likesCount: { type: "integer", example: 2 },
          commentsCount: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          post: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          user: {
            type: "object",
            properties: {
              id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
              name: { type: "string", example: "Ada Lovelace" },
            },
          },
          text: { type: "string", example: "Nice post!" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LikeResult: {
        type: "object",
        properties: {
          liked: { type: "boolean", example: true },
          likesCount: { type: "integer", example: 1 },
        },
      },
      DeletedResult: {
        type: "object",
        properties: {
          id: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          deleted: { type: "boolean", example: true },
        },
      },

      // Request bodies
      SignupRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Ada Lovelace", minLength: 2, maxLength: 50 },
          email: { type: "string", example: "ada@example.com" },
          password: { type: "string", example: "secret123", minLength: 6 },
        },
      },
      CreatePostRequest: {
        type: "object",
        required: ["userId", "caption"],
        properties: {
          userId: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          caption: { type: "string", example: "Hello world!", minLength: 1, maxLength: 500 },
        },
      },
      UpdatePostRequest: {
        type: "object",
        required: ["caption"],
        properties: {
          caption: { type: "string", example: "Edited caption", minLength: 1, maxLength: 500 },
        },
      },
      LikeRequest: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
        },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["userId", "text"],
        properties: {
          userId: { type: "string", example: "64c9f2c9b3d4a5e6f7a8b9c0" },
          text: { type: "string", example: "Nice post!", minLength: 1, maxLength: 300 },
        },
      },
      UpdateCommentRequest: {
        type: "object",
        required: ["text"],
        properties: {
          text: { type: "string", example: "Edited comment", minLength: 1, maxLength: 300 },
        },
      },
    },
  },
  paths: {
    // ----------------------------------------------------------- Users
    "/users/signup": {
      post: {
        tags: ["Users"],
        summary: "Create a user (signup)",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/SignupRequest" } },
          },
        },
        responses: {
          201: created("User created", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              name: "Ada Lovelace",
              email: "ada@example.com",
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T10:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { name: "Name must be at least 2 characters" },
          }),
          409: conflict({
            success: false,
            errors: { email: "Email already exists" },
          }),
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List all users",
        description: "The frontend uses this to pick a 'current user'.",
        responses: {
          200: ok("All users", {
            success: true,
            data: [
              {
                id: "64c9f2c9b3d4a5e6f7a8b9c0",
                name: "Ada Lovelace",
                email: "ada@example.com",
                createdAt: "2026-09-21T10:00:00.000Z",
                updatedAt: "2026-09-21T10:00:00.000Z",
              },
            ],
          }),
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a single user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        responses: {
          200: ok("The requested user", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              name: "Ada Lovelace",
              email: "ada@example.com",
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T10:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { id: "Invalid ObjectId" },
          }),
          404: notFound({
            success: false,
            errors: { id: "User not found" },
          }),
        },
      },
    },

    // ----------------------------------------------------------- Posts
    "/posts": {
      post: {
        tags: ["Posts"],
        summary: "Create a post",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreatePostRequest" } },
          },
        },
        responses: {
          201: created("Post created", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              caption: "Hello world!",
              user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
              likesCount: 0,
              commentsCount: 0,
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T10:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { caption: "Caption must be at most 500 characters" },
          }),
          404: notFound({
            success: false,
            errors: { userId: "User not found" },
          }),
        },
      },
      get: {
        tags: ["Posts"],
        summary: "List all posts, newest first",
        responses: {
          200: ok("All posts (newest first)", {
            success: true,
            data: [
              {
                id: "64c9f2c9b3d4a5e6f7a8b9c0",
                caption: "Hello world!",
                user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
                likesCount: 2,
                commentsCount: 1,
                createdAt: "2026-09-21T10:00:00.000Z",
                updatedAt: "2026-09-21T10:00:00.000Z",
              },
            ],
          }),
        },
      },
    },
    "/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get a single post",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        responses: {
          200: ok("The requested post", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              caption: "Hello world!",
              user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
              likesCount: 2,
              commentsCount: 1,
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T10:00:00.000Z",
            },
          }),
          400: badRequest({ success: false, errors: { id: "Invalid ObjectId" } }),
          404: notFound({ success: false, errors: { id: "Post not found" } }),
        },
      },
      patch: {
        tags: ["Posts"],
        summary: "Update a post's caption",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UpdatePostRequest" } },
          },
        },
        responses: {
          200: ok("Post updated", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              caption: "Edited caption",
              user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
              likesCount: 0,
              commentsCount: 0,
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T11:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { caption: "Caption is required" },
          }),
          404: notFound({ success: false, errors: { id: "Post not found" } }),
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post (and its comments)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        responses: {
          200: ok("Post deleted", {
            success: true,
            data: { id: "64c9f2c9b3d4a5e6f7a8b9c0", deleted: true },
          }),
          400: badRequest({ success: false, errors: { id: "Invalid ObjectId" } }),
          404: notFound({ success: false, errors: { id: "Post not found" } }),
        },
      },
    },
    "/posts/{postId}/like": {
      post: {
        tags: ["Posts"],
        summary: "Toggle a like on a post (on/off)",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LikeRequest" } },
          },
        },
        responses: {
          200: ok("Toggled. `liked` tells you whether the user now likes it", {
            success: true,
            data: { liked: true, likesCount: 1 },
          }),
          400: badRequest({
            success: false,
            errors: { postId: "Invalid ObjectId" },
          }),
          404: notFound({
            success: false,
            errors: { postId: "Post not found" },
          }),
        },
      },
    },

    // ----------------------------------------------------------- Comments
    "/posts/{postId}/comments": {
      post: {
        tags: ["Comments"],
        summary: "Add a comment to a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateCommentRequest" } },
          },
        },
        responses: {
          201: created("Comment created", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              post: "64c9f2c9b3d4a5e6f7a8b9c0",
              user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
              text: "Nice post!",
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T10:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { text: "Text is required" },
          }),
          404: notFound({
            success: false,
            errors: { postId: "Post not found" },
          }),
        },
      },
      get: {
        tags: ["Comments"],
        summary: "List a post's comments, newest first",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        responses: {
          200: ok("The post's comments (newest first)", {
            success: true,
            data: [
              {
                id: "64c9f2c9b3d4a5e6f7a8b9c0",
                post: "64c9f2c9b3d4a5e6f7a8b9c0",
                user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
                text: "Nice post!",
                createdAt: "2026-09-21T10:00:00.000Z",
                updatedAt: "2026-09-21T10:00:00.000Z",
              },
            ],
          }),
          400: badRequest({
            success: false,
            errors: { postId: "Invalid ObjectId" },
          }),
          404: notFound({
            success: false,
            errors: { postId: "Post not found" },
          }),
        },
      },
    },
    "/comments/{id}": {
      patch: {
        tags: ["Comments"],
        summary: "Edit a comment's text",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/UpdateCommentRequest" } },
          },
        },
        responses: {
          200: ok("Comment updated", {
            success: true,
            data: {
              id: "64c9f2c9b3d4a5e6f7a8b9c0",
              post: "64c9f2c9b3d4a5e6f7a8b9c0",
              user: { id: "64c9f2c9b3d4a5e6f7a8b9c0", name: "Ada Lovelace" },
              text: "Edited comment",
              createdAt: "2026-09-21T10:00:00.000Z",
              updatedAt: "2026-09-21T11:00:00.000Z",
            },
          }),
          400: badRequest({
            success: false,
            errors: { text: "Text must be at most 300 characters" },
          }),
          404: notFound({ success: false, errors: { id: "Comment not found" } }),
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB ObjectId (24 hex characters)",
            schema: { type: "string" },
            example: badObjectId,
          },
        ],
        responses: {
          200: ok("Comment deleted", {
            success: true,
            data: { id: "64c9f2c9b3d4a5e6f7a8b9c0", deleted: true },
          }),
          400: badRequest({ success: false, errors: { id: "Invalid ObjectId" } }),
          404: notFound({ success: false, errors: { id: "Comment not found" } }),
        },
      },
    },
  },
};
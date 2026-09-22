// middlewares/error.js
// The two error middlewares registered last in index.js:
//   1. notFound     -> 404 for any route that matches nothing
//   2. errorHandler -> catches every error that reaches next(err)

// 404 - route does not exist
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    errors: { message: "Route not found" },
  });
};

// Global error handler. Express calls this whenever a controller
// calls next(err) or when an async controller throws.
export const errorHandler = (err, req, res, next) => {
  // Duplicate key (unique email) -> 409
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      errors: { email: "Email already exists" },
    });
  }

  // Invalid Mongo ObjectId -> 400
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      errors: { [err.path]: "Invalid ObjectId" },
    });
  }

  // Anything else -> 500
  console.error(err);
  res.status(500).json({
    success: false,
    errors: { message: "Internal server error" },
  });
};
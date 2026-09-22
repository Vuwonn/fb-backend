// middlewares/validate.js
// Reusable validation middleware built on zod schemas.
//
// Usage in a route:
//   validate({ body: someBodySchema })              -> validates req.body
//   validate({ params: someParamsSchema })           -> validates req.params
//   validate({ body: a, params: b })                 -> validates both
//
// On failure it answers 400 with the shared error format:
//   { success: false, errors: { fieldName: "message" } }
// On success it replaces req.body with the parsed (trimmed) values.

export const validate = ({ body, params } = {}) => (req, res, next) => {
  const errors = {};

  if (body) {
    const result = body.safeParse(req.body ?? {});
    if (!result.success) {
      collectIssues(result.error.issues, errors);
    } else {
      // Use the parsed values (e.g. trimmed caption, lowercased email).
      req.body = result.data;
    }
  }

  if (params) {
    const result = params.safeParse(req.params ?? {});
    if (!result.success) {
      collectIssues(result.error.issues, errors);
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Turn zod issues into { fieldName: "First message for this field" }.
// We keep the FIRST message per field so that e.g. an empty caption
// reports "Caption is required" instead of a later length error.
function collectIssues(issues, errors) {
  for (const issue of issues) {
    const field = issue.path[0] ?? "body";
    if (!(field in errors)) {
      errors[field] = issue.message;
    }
  }
}
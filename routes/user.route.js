// routes/user.route.js
// All /users endpoints.

import { Router } from "express";
import { signup, listUsers, getUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, userParamsSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/users/signup", validate({ body: signupSchema }), signup);
router.get("/users", listUsers);
router.get("/users/:id", validate({ params: userParamsSchema }), getUser);

export default router;
import { Router } from "express";

import {
  register,
  login,
  me,
} from "../controllers/auth.controller.js";
import { Role } from "../generated/prisma/client.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, me);

export default router;
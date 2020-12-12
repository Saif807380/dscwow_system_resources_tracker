import express from "express";
import authRoutes from "./auth.js";
import instanceRoutes from "./instance.js";

import { loginRequired, ensureCorrectUser } from "../../middlewares/auth.js";

const router = express.Router();

router.use(authRoutes);
router.use(loginRequired);
router.use("/:id/instance", instanceRoutes);

export default router;

import express from "express";
import { signin, signup } from "../../handlers/user/auth.js";
import {
  signUpRateLimiter,
  signInRateLimiter,
} from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.route("/signin").post(signInRateLimiter, signin);
router.route("/signup").post(signUpRateLimiter, signup);

export default router;

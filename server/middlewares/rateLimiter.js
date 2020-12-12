import rateLimit from "express-rate-limit";

export const signUpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Maximum tries exceeded",
});

export const signInRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Maximum tries exceeded",
});

import express from "express";
import userRoutes from "./user/index.js";

const router = express.Router();

router.get("/", () => res.json({ message: "API is working" }));
router.use("/user", userRoutes);

export default router;

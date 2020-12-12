import express from "express";
import userRoutes from "./user/index.js";
import sendEmail from "../handlers/sendEmail.js"

const router = express.Router();

router.get("/", () => res.json({ message: "API is working" }));
router.post("/email", sendEmail);
router.use("/user", userRoutes);

export default router;

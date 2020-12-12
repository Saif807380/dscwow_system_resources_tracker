import express from "express";
import {
  getInstances,
  createInstance,
  getInstance,
  editInstance,
  deleteInstance,
} from "../../handlers/user/instance.js";

const router = express.Router();

router.route("/").get(getInstances).post(createInstance);

router
  .route("/:instanceId")
  .get(getInstance)
  .put(editInstance)
  .delete(deleteInstance);

export default router;

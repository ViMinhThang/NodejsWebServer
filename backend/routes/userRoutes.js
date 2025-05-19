import express from "express";
import { getUser, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").get(protect, getUser).put(updateUserProfile);

export default router;

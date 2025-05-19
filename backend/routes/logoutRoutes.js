import express from "express";
import logout from "../controllers/logoutController.js";

const router = express.Router();

router.route("/").delete(logout);

export default router;

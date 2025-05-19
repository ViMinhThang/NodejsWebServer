import express from "express";
import { getvideos, uploadVideo } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs"
import path from "path"
import crypto from "crypto"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const videoId = crypto.randomBytes(4).toString("hex");
    const uploadPath = path.join(process.cwd(), "storage/videos", videoId);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      cb(err, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/quicktime"]; // mp4 + mov
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only mp4 and mov formats are allowed"), false);
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter,
});

const router = express.Router();
router.route("/").get(protect, getvideos);
router
  .route("/upload-video")
  .post(protect, upload.single("video"), uploadVideo);
export default router;

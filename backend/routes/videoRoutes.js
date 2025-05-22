import express from "express";
import {
  getVideoAsset,
  getvideos,
  uploadVideo,
  extractedAudio,
  resizeVideo
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { generateVideoId } from "../middleware/generateVideoId.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "storage", req.videoId);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      cb(err, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, `original.${ext.toLowerCase()}`);
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
  .post(protect, generateVideoId, upload.single("video"), uploadVideo);
router.route("/get-video-asset").get(getVideoAsset);
router.route("/extract-audio").patch(extractedAudio);
router.route("/resize").put(resizeVideo)
export default router;

import asyncHandler from "../middleware/asyncHandler.js";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import { deleteFolder } from "../util/util.js";
import Video from "../models/videoModel.js";
import { makeThumbnail, getDimension } from "../lib/FF.js";
const uploadVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No video file uploaded");
  }
  const file = req.file;
  const fullPath = file.path;
  const extension = path.extname(file.originalname).substring(1).toLowerCase();
  const name = path.parse(file.originalname).name;
  const videoId = crypto.randomBytes(4).toString("hex");
  const videoFolder = path.dirname(fullPath);

  try {
    const thumbnailPath = `${videoFolder}/thumbnail.jpg`;
    await makeThumbnail(fullPath, thumbnailPath);
    const dimensions = await getDimension(fullPath);

    const video = new Video({
      id: videoId,
      name,
      extension,
      dimensions,
      userId: req.user._id,
      extractedAudio: false,
      resizes: {},
    });
    await video.save();

    res.status(201).json({
      status: "success",
      message: "The file was uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    try {
      await deleteFolder(videoFolder);
    } catch (delErr) {
      console.error("Failed to delete folder:", delErr);
    }
    res.status(500).json({
      status: "error",
      message: error.message || "Server error during video upload",
    });
  }
});

const getvideos = asyncHandler(async (req, res, next) => {
  const videos =await Video.find({ userId: req.user._id });
  res.status(200).json(videos);
});

export { uploadVideo, getvideos };

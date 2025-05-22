import asyncHandler from "../middleware/asyncHandler.js";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { pipeline } from "stream/promises";
import { deleteFile, deleteFolder } from "../util/util.js";
import Video from "../models/videoModel.js";
import cluster from "cluster";
import {
  makeThumbnail,
  getDimension,
  extractAudio,
  hasAudioStream,
} from "../lib/FF.js";

const uploadVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No video file uploaded");
  }
  const file = req.file;
  const fullPath = file.path;
  const extension = path.extname(file.originalname).substring(1).toLowerCase();
  const name = path.parse(file.originalname).name;
  const videoFolder = path.dirname(fullPath);
  const videoId = req.videoId;
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
    });
    await video.save();

    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://nodejs-web-server-five.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, filename"
    );
    res.status(201).json({
      status: "success",
      message: "The file was uploaded successfully",
      video,
    });
  } catch (e) {
    util.deleteFolder(`./storage/${videoId}`);
    if (e.code !== ECONNRESET) {
      return throw new Error(`${e}`)
    }
  }
});

const extractedAudio = asyncHandler(async (req, res, next) => {
  const videoId = req.query.videoId;
  const video = await Video.findOne({ id: videoId });
  if (video.extractedAudio) {
    res.status(400);
    throw new Error(`The audio has already been extracted for this video`);
  }
  const originalPath = `./storage/${videoId}/original.${video.extension}`;
  const targetAudioPath = `./storage/${videoId}/audio.aac`;
  const hasAudio = await hasAudioStream(originalPath);
  if (!hasAudio) {
    res.status(400);
    throw new Error("This video does not contain an audio stream");
  }
  try {
    await extractAudio(originalPath, targetAudioPath);
    video.extractedAudio = true;
    await video.save();
    res.status(200).json({
      status: "success",
      message: "The audo was extracted successfully",
    });
  } catch (error) {
    console.log(error);
    try {
      deleteFile(targetAudioPath);
    } catch (error) {
      console.log(error);
    }
    throw new Error(`${error}`);
  }
});

const getvideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find({ userId: req.user._id });
  res.status(200).json(videos);
});
const resizeVideo = asyncHandler(async (req, res, next) => {
  const videoId = req.body.videoId;
  const width = Number(req.body.width);
  const height = Number(req.body.height);
  const video = await Video.findOne({ id: videoId });
  video.resizes.set(`${width}x${height}`, { processing: true });
  await video.save();
  if (cluster.isPrimary) {
    jobs.enqueue({
      type: "resize",
      videoId,
      width,
      height,
    });
  } else {
    process.send({
      messageType: "new-resize",
      data: { videoId, width, height },
    });
  }
  res.status(200).json({
    status: "success",
    message: "The video is now being processed",
  });
});
const getVideoAsset = asyncHandler(async (req, res, next) => {
  const videoId = req.query.videoId;
  const type = req.query.type;
  const video = await Video.findOne({ id: videoId });
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  let file;
  let mimeType;
  let filename;
  switch (type) {
    case "thumbnail":
      file = await fs.open(`./storage/${videoId}/thumbnail.jpg`, "r");
      mimeType = "image/jpeg";
      break;
    case "audio":
      file = await fs.open(`./storage/${videoId}/audio.aac`, "r");
      mimeType = "audio/aac";
      filename = `${video.name}-audio.aac`;
      break;
    case "resize":
      file = await fs.open(
        `./storage/${video.id}/${req.query.dimensions}.${video.extension}`
      );
      mimeType = "video/mp4";
      filename = `${video.name}.${video.extension}`;
      break;
    case "original":
      file = await fs.open(`./storage/${video.id}/original.${video.extension}`);
      mimeType = "video/mp4";
      filename = `${video.name}.${video.extension}`;
  }
  try {
    const stat = await file.stat();
    const fileStream = file.createReadStream();
    if (type !== "thumnail") {
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    }
    res.setHeader("Content-type", mimeType);
    res.setHeader("Content-Length", stat.size);
    res.status(200);
    await pipeline(fileStream, res);
    file.close();
  } catch (error) {
    console.log(e);
  }
});

export { uploadVideo, getvideos, getVideoAsset, extractedAudio, resizeVideo };

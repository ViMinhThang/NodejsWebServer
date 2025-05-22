import asyncHandler from "./asyncHandler.js";
import crypto from "crypto";
const generateVideoId = asyncHandler(async (req, res, next) => {
  const videoId = crypto.randomBytes(4).toString("hex");
  req.videoId = videoId;
  next();
});
export { generateVideoId };

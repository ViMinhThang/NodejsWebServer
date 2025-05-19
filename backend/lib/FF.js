import { spawn } from "child_process"; // destructuring import

const makeThumbnail = (fullPath, thumbnailPath) => {
  // ffmpeg -i video.mp4 -ss -5 -vframes 1 thumbnail.jpg
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-ss",
      "5",
      "-vframes",
      "1",
      thumbnailPath,
    ]);
    ffmpeg.on("close", (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject(`FFmpeg existed with this code:${code}`);
      }
    });
    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

const getDimension = (fullPath) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      fullPath,
    ]);
    let dimensions = "";
    ffprobe.stdout.on("data", (data) => {
      dimensions += data.toString("utf-8");
    });
    ffprobe.on("close", (code) => {
      if (code === 0) {
        dimensions = dimensions.replace(/\s/g, "").split(",");
        resolve({
          width: Number(dimensions[0]),
          height: Number(dimensions[1]),
        });
      } else {
        reject(`FFprobe existed with this code: ${code}`);
      }
    });

    ffprobe.on("error", (err) => {
      reject(err);
    });
  });
};
export { getDimension, makeThumbnail };

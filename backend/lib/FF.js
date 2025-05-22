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
const extractAudio = (originalPath, targetAudioPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalPath,
      "-vn",
      "-c:a",
      "copy",
      targetAudioPath,
    ]);
    ffmpeg.on("close", (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject(`ffmpeg existed with code ${code}`);
      }
    });
    // ffmpeg.stderr.on("data", (data) => {
    //   console.error(`ffmpeg stderr: ${data}`);
    // });
    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};
const hasAudioStream = (filePath) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "a",
      "-show_entries",
      "stream=codec_type",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    let output = "";
    ffprobe.stdout.on("data", (data) => {
      output += data.toString("utf-8");
    });

    // ffprobe.stderr.on("data", (data) => {
    // });

    ffprobe.on("close", (code) => {
      resolve(output.includes("audio"));
    });

    ffprobe.on("error", (err) => {
      reject(err);
    });
  });
};
const resize = (originalPath, targetPath, width, height) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalPath,
      "-vf",
      `scale=${width}x${height}`,
      "-c:a",
      "copy",
      "-threads",
      "2",
      "-y",
      targetPath,
    ]);
    ffmpeg.on("close", (code) => {
      if (code == 0) {
        resolve();
      } else {
        reject(`FFmpeg existed with this code:${code}`);
      }
    });
     ffmpeg.stderr.on("data", (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });
    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};
export { getDimension, makeThumbnail, extractAudio, hasAudioStream, resize };

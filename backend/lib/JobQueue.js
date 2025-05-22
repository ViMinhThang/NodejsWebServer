import Video from "../models/videoModel.js";
import { deleteFile } from "../util/util.js";
import { resize } from "./FF.js";
class JobQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;
  }
  async init() {
    const videos = await Video.find();
    videos.forEach((video) => {
      for (const [key, value] of video.resizes.entries()) {
        if (value.processing) {
          const [width, height] = key.split("x");
          this.enqueue({
            type: "resize",
            videoId: video._id,
            width: Number(width),
            height: Number(height),
          });
        }
      }
    });
    return this;
  }
  enqueue(job) {
    this.jobs.push(job);
    this.executeNext();
  }
  dequeue() {
    return this.jobs.shift();
  }
  executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.dequeue();
    if (!this.currentJob) return;
    this.execute(this.currentJob);
  }
  async execute(job) {
    if (job.type === "resize") {
      const { videoId, width, height } = job;
      const video = await Video.findOne({ id: videoId });
      const originalVideoPath = `./storage/${video.id}/original.${video.extension}`;
      const targetPath = `./storage/${video.id}/${width}x${height}.${video.extension}`;
      try {
        console.log("Enqueue resize job with", { videoId, width, height });
        await resize(originalVideoPath, targetPath, width, height);
        const resizeEntry = video.resizes.get(`${width}x${height}`);
        if (resizeEntry) {
          resizeEntry.processing = false;
          video.resizes.set(`${width}x${height}`, resizeEntry);
        }
        await video.save();
        console.log(
          "Done resizing! Number of Jobs remaning:",
          this.jobs.length
        );
      } catch (error) {
        console.log(error);
        deleteFile(targetPath);
      }
    }
    this.currentJob = null;
    this.executeNext();
  }
}

export default JobQueue;

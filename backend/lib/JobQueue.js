import Video from "../models/videoModel";
import { deleteFile } from "../util/util";
import { resize } from "./FF.js";
class JobQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;
  }
  async init() {
    const videos = await Video.find();
    videos.forEach((video) => {
      Object.keys(video.resizes).forEach((key) => {
        if (video.resizes[key].processing) {
          const [width, height] = key.split("x");
          this.enqueue({
            type: "resize",
            videoId: video._id,
            width,
            height,
          });
        }
      });
    });
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
    this.executeNext(this.currentJob);
  }
  async execute(job) {
    if (job.type === "resize") {
      const { videoId, width, height } = job;
      const video = await Video.findOne({ id: videoId });
      const originalVideoPath = `./storage/${video._id}/original.${video.extension}`;
      const targetPath = `./storage/${video._id}/${width}x${height}.${video.extension}`;
      try {
        await resize(originalVideoPath, targetPath, width, height);
        video.resizes[`${width}x${height}`].processing = false;
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

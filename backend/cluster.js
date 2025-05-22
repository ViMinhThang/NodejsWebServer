import cluster from "cluster";
import JobQueue from "./lib/JobQueue.js";
import { availableParallelism } from "node:os";
if (cluster.isPrimary) {
  const jobs = await new JobQueue().init();
  const coreCount = availableParallelism();
  for (let i = 0; i < coreCount; i++) {
    cluster.fork();
  }
  cluster.on("message", (worker, message) => {
    if (message.messageType === "new-resize") {
      const { videoId, height, width } = message.data;
      jobs.enqueue({
        type: "resize",
        videoId,
        width,
        height,
      });
    }
  });
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal}|${code}. Restarting)`
    );
    cluster.fork();
  });
} else {
  import("./server.js");
}

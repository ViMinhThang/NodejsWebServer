import mongoose from "mongoose";

const VideoSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
  },
  userId: {
    type: String,
    required: true,
  },
  extractedAudio: {
    type: Boolean,
    required: false,
  },
  resizes: {
    type: Map,
    of: new mongoose.Schema(
      {
        processing: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
      { _id: false }
    ),
    default: {},
  },
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;

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
  resizes: [
    {
      width_height: {
        processing: {
          type: Boolean,
          required: false,
        },
      },
    },
  ],
});

const Video = mongoose.model("VideoSchema", VideoSchema);
export default Video;

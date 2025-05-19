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
    type: String,
    required: true,
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
          required: true,
        },
      },
    },
  ],
});

const Video = mongoose.model("VideoSchema", VideoSchema);
export default Video

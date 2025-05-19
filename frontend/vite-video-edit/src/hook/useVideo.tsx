import React, { useState, useEffect, useContext, type Key } from "react";
import { AppContext } from "../App";
import t from "../lib/tokens";
import axios from "axios";

import alert from "../lib/alert";
interface Video {
  id: Key | null | undefined;
  extension: any;
  name: any;
  videoId: string;
  resizes: Record<string, ResizeInfo>;
  dimensions: Dimension;
  extractedAudio?: boolean;
}
interface ResizeInfo {
  processing: boolean;
}
interface Dimension {
  width: number;
  height: number;
}

const useVideo = (videoId?: string): { video?: Video; videos: Video[]; loading: boolean; addResize: (width: number, height: number) => void, fetchVideos: () => Promise<void>, extractedAudioTrue: (videoId: string) => void } => {
  const { videos, setVideos } = useContext(AppContext); // the complete list of videos
  const [loading, setLoading] = useState(true); // loading for fetching the videos
  const [video, setVideo] = useState<Video | undefined>(undefined); // selected video for the modal

  const fetchVideos = async () => {
    setLoading(true);
    try {
      /** @API call */
      const { data } = await axios.get("/api/videos");
      setVideos(data);
    } catch (e) {
      setVideos([])
      // alert(t.alert.error.default, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (videoId) {
      const selectedVideo = videos.find((video) => video.videoId === videoId);
      setVideo(selectedVideo);
    } else {
      setVideo((undefined));
    }
  }, [videoId, videos]);

  const addResize = (width: number, height: number) => {
    // Find the video in videos and add the resize to it, with processing set to true
    const updatedVideos = videos.map((video) => {
      if (video.videoId === videoId) {
        return {
          ...video,
          resizes: {
            ...video.resizes,
            [`${width}x${height}`]: {
              processing: true,
            },
          },
        };
      }
      return video;
    });
    setVideos(updatedVideos);
  };

  const extractedAudioTrue = (videoId: string) => {
    const updatedVideos = videos.map((video) => {
      if (video.videoId === videoId) {
        return {
          ...video,
          extractedAudio: true,
        };
      }
      return video;
    });
    setVideos(updatedVideos);
  };

  return {
    videos,
    loading,
    fetchVideos,
    video,
    addResize,
    extractedAudioTrue,
  };
};

export { useVideo }; export type { Video };


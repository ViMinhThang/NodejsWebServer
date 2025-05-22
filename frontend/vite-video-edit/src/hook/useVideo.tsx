import  { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import axios from "axios";
import t from "../lib/tokens"
import alert from "../lib/alert";
interface Video {
  id: string;
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
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/videos`);
      setVideos(data);
    } catch (e) {
      setVideos([])
      alert(t.alert.error.default, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (videoId) {
      const selectedVideo = videos.find((v) => v.id === videoId);
      if (selectedVideo !== video) {
        setVideo(selectedVideo);
      }
    } else if (video !== undefined) {
      setVideo(undefined);
    }
  }, [videoId, videos, video]);


  const addResize = (width: number, height: number) => {
    // Find the video in videos and add the resize to it, with processing set to true
    const updatedVideos = videos.map((video) => {
      if (video.id === videoId) {
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
      if (video.id === videoId) {
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

export default useVideo;
export type { Video };

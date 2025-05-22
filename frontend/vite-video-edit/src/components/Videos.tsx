import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import InlineLoading from "../resuable/InlineLoading";
import t from "../lib/tokens";
import alert from "../lib/alert";
import Button from "../resuable/Button";
import ResizeModal from "./ResizeModal";

import useVideo from "../hook/useVideo";
interface ResizeModalData {
  width: number;
  height: number;
  videoId?: string;
}

const Videos = () => {
  // const [loading, setLoading] = useState(false);
  const { videos, loading, fetchVideos, extractedAudioTrue } = useVideo();
  console.log(videos)
  const [resizeModalOpen, setResizeModalOpen] = useState(false);
  const [resizeModalData, setResizeModalData] = useState<ResizeModalData>({ width: 100, height: 200 });
  const [extractAudioLoading, setExtractAudioLoading] = useState<string | false>(false);
  useEffect(() => {
    fetchVideos();
  }, []);

  const extractAudio = async (videoId: string): Promise<void> => {
    setExtractAudioLoading(videoId);

    try {
      /** @API call */
      await axios.patch(`/api/videos/extract-audio?videoId=${videoId}`, {
        videoId,
      });
      alert(t.alert.success.video.audioExtracted, "success");
      extractedAudioTrue(videoId);
    } catch (e: any) {
      alert(e.response.data.message, "error");
    }

    setExtractAudioLoading(false);
  };

  const renderVideos = () => {
    return videos.map((video) => {
      return (
        <div className="video" key={video.id}>
          {/** @API call */}
          <img
            className="video__thumbnail"
            src={`/api/videos/get-video-asset?videoId=${video.id}&type=thumbnail`}
          />
          <div className="video__name">{video.name}</div>
          <div className="video__dimensions">
            {video.dimensions.width}x{video.dimensions.height}
          </div>
          <div className="video__extension">
            {video.extension.toUpperCase()}
          </div>

          <div className="video__actions">
            <Button
              size="small"
              color="blue"
              onClick={() => {
                setResizeModalOpen(true);
                setResizeModalData({
                  width: 100,
                  height: 100,
                  videoId: video.id,
                });
              }}
            >
              Resize Video
            </Button>

            {video.extractedAudio ? (
              /** @API call */
              <a
                className="button button-small button-blue"
                href={`/api/videos/get-video-asset?videoId=${video.id}&type=audio`}
              >
                Download Audio
              </a>
            ) : (
              <Button
                size="small"
                color="blue"
                loading={extractAudioLoading === video.id}
                onClick={() => {
                  extractAudio(video.id);
                }}
              >
                Extract Audio
              </Button>
            )}

            {/** @API call */}
            <a
              className="button button-small button-blue"
              href={`/api/videos/get-video-asset?videoId=${video.id}&type=original`}
            >
              Download Video
            </a>
          </div>
        </div>
      );
    });
  };

  if (loading)
    return (
      <div className="u-text-center u-margin-top-3">
        <InlineLoading color="gray" className={""} />
      </div>
    );
  return (
    <div className="videos">
      <ResizeModal
        videoId={resizeModalData.videoId}
        text="Specify a new width and height:"
        onClose={() => {
          setResizeModalOpen(false);
          setResizeModalData({ width: 0, height: 0 });
        }}
        success={() => { }}
        open={resizeModalOpen}
      />

      <h2 className="videos__heading">Your Videos</h2>
      {videos.length === 0 ? (
        <div className="videos__no-video-message">
          You have not uploaded any videos yet for editing. Start by dragging a
          video file and dropping it into the box above!
        </div>
      ) : (
        renderVideos()
      )}
    </div>
  );
};

export default Videos;

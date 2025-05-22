import React, { useState, type ReactNode } from "react";
import Modal from "../resuable/Modal";
import axios from "axios";
import Input from "../resuable/Input";
import Button from "../resuable/Button";
import alert from "../lib/alert";
import t from "../lib/tokens";
import useVideo from '../hook/useVideo';
interface UploadPhotoProps {
  text: ReactNode;
  open: boolean;
  onClose: () => void;
  videoId?: string
  success?: () => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = (props) => {
  // const [loading, setLoading] = useState(false); // overall modal loading
  const [resizeLoading, setResizeLoading] = useState(false); // resize button loading
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const { video, addResize } = useVideo(props.videoId);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check that width and height are numbers, greater than zero, and less than the
    // dimensions of the original video.
    if (
      !video ||
      !Number(width) ||
      !Number(height) ||
      Number(width) <= 0 ||
      Number(height) <= 0 ||
      Number(width) > video.dimensions.width ||
      Number(height) > video.dimensions.height
    ) {
      alert(t.alert.error.video.resize.range, "error");
      return;
    }

    // Check if numbers are even
    if (Number(width) % 2 !== 0 || Number(height) % 2 !== 0) {
      alert(t.alert.error.video.resize.even, "error");
      return;
    }

    setResizeLoading(true);

    try {
      /** @API call */
      await axios.put("/api/videos/resize", {
        videoId: props.videoId,
        width,
        height,
      });

      setWidth("");
      setHeight("");
      alert(t.alert.success.video.resized, "success");
      addResize(Number(width), Number(height));
    } catch (e) {
      alert(t.alert.error.default, "error");
    }

    setResizeLoading(false);
  };

  const renderResizes = () => {
    if (!video) return null;
    const dimensionsArray = Object.keys(video.resizes);

    // Separate processing and processed videos
    const processingVideos = dimensionsArray.filter(
      (dimensions) => video.resizes[dimensions].processing
    );

    const processedVideos = dimensionsArray.filter(
      (dimensions) => !video.resizes[dimensions].processing
    );

    // Sort processed videos by resolution (higher resolution first)
    processedVideos.sort((a, b) => {
      const resolutionA = a.split("x").map(Number);
      const resolutionB = b.split("x").map(Number);

      if (resolutionA[0] !== resolutionB[0]) {
        return resolutionB[0] - resolutionA[0];
      } else {
        return resolutionB[1] - resolutionA[1];
      }
    });

    // Combine processing and sorted processed videos
    const sortedDimensions = [...processingVideos, ...processedVideos];

    return sortedDimensions.map((dimensions) => {
      const width = dimensions.split("x")[0];
      const height = dimensions.split("x")[1];

      const isProcessing = video.resizes[dimensions].processing;

      return (
        <div
          className={`resizes__item ${isProcessing && "resizes__item--in-progress"
            }`}
          key={dimensions}
        >
          <div className="resizes__dimensions">
            {width}x{height}
          </div>
          {isProcessing ? (
            <div className="resizes__progress-msg">Processing</div>
          ) : (
            /** @API call */
            <a
              className="button button-blue button-small"
              href={`/api/videos/get-video-asset?videoId=${props.videoId}&type=resize&dimensions=${dimensions}`}
            >
              Download
            </a>
          )}
        </div>
      );
    });
  };

  return (
    <Modal
      header={video ? `Resize ${video.name}` : "Resize Video"}
      open={props.open}
      onClose={() => {
        props.onClose();
        setWidth("");
        setHeight("");
      }}
    >
      {/* Nếu chưa có video, hiển thị thông báo */}
      {!video ? (
        <div className="resizes__no-video-message">
          No video found or still loading...
        </div>
      ) : (
        <>
          <p>{props.text}</p>
          <form className="resize-input" onSubmit={onFormSubmit}>
            <Input
              label="width"
              value={width}
              required={true}
              onChange={(value: string) => setWidth(value)}
            />
            <span>&times;</span>
            <Input
              label="height"
              value={height}
              required={true}
              onChange={(value: string) => setHeight(value)}
            />
            <Button color="blue" type="submit" loading={resizeLoading}>
              Resize
            </Button>
          </form>

          <div className="resizes">
            <h4>Your Resizes:</h4>
            {Object.keys(video.resizes).length ? (
              renderResizes()
            ) : (
              <div className="resizes__no-resize-message">
                You haven't resized this video yet.
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );

};

export default UploadPhoto;

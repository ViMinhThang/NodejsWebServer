import React, { useState } from "react";
import axios from "axios";
import UploadingIcon from "../resuable/UploadingIcon";
import useVideo from '../hook/useVideo';
import Button from "../resuable/Button";

const CancelToken = axios.CancelToken;
let cancel: () => void;
function Uploader() {
  const { fetchVideos } = useVideo();

  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDragStart = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDraggedOver(false);

    setFileName(e.dataTransfer.files[0].name);
    setFile(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  };

  const cancelUploading = () => {
    setIsUploading(false);
    setProcessing(false);
    setFileName("");
    setProgress(0);
    setFile(null);

    if (cancel) cancel();
  };

  const onInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }

    const fileInput = document.querySelector("#file") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      showMessage("Please select a file first", "error");
      return;
    }
    setProcessing(false)
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", file);  // "video" trùng với multer.single("video")

      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/videos/upload-video`, formData, {
        withCredentials: true,
        headers: {
          Authorization: localStorage.get("token"),
          "Content-Type": "multipart/form-data",
          filename: fileName,
        },
        onUploadProgress: (progressEvent) => {
          const progressNumber = Math.round(
            (100 * progressEvent.loaded) / (progressEvent.total ?? 1)
          );
          setProgress(progressNumber);
          if (progressNumber === 100) setProcessing(true);
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      });

      if (data.status === "success") {
        cancelUploading();
        showMessage("File was uploaded successfully!", "success");
        fetchVideos();
      }
    } catch (e: any) {
      if (e.response && e.response.data.error)
        showMessage(e.response.data.error, "error");
      cancelUploading();
    }
  };


  const showMessage = (message: string, status: string) => {
    if (status === "success") {
      setSuccessMsg(message);
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
    }

    if (status === "error") {
      setErrorMsg(message);
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`box ${isDraggedOver ? "box--dragged-over" : ""} ${fileName ? "box--file-selected" : ""
        } ${isUploading ? "box--file-uploading" : ""} ${successMsg ? "box--success" : ""
        } ${errorMsg ? "box--error" : ""} ${processing ? "box--processing" : ""}`}
      onDrag={handleDragStart}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragLeave}
      onDrop={handleDrop}
    >
      {!!successMsg || !!errorMsg || processing ? (
        <div className="box__message">
          {successMsg || errorMsg || "Processing your video file."}
        </div>
      ) : (
        <>
          <input
            className="box__file"
            type="file"
            name="file"
            id="file"
            onChange={onInputFileChange}
          />
          {isUploading ? <UploadingIcon animated={true} /> : <UploadingIcon />}
          {isUploading && <span className="box__percentage">{progress}%</span>}
          <div className="box__file-selected-msg">
            {!isUploading && (
              <div className="box__input">
                <label htmlFor="file">
                  {fileName ? (
                    <strong>{fileName}</strong>
                  ) : isDraggedOver ? (
                    <span>You can now drop your video!</span>
                  ) : (
                    <>
                      <strong>Choose a video file</strong>
                      <span className="box__dragndrop">
                        {" "}
                        or drag and drop it here
                      </span>
                      .
                    </>
                  )}
                </label>
              </div>
            )}
            {fileName && !isUploading && (
              <Button color="blue" type="submit" size="small">
                Upload
              </Button>
            )}
          </div>
          {isUploading && (
            <div className="box__is-uploading-msg">
              Uploading <strong> {fileName}</strong>
              <Button
                color="red"
                size="small"
                type="submit"
                onClick={cancelUploading}
              >
                Cancel
              </Button>
            </div>
          )}
          <div className="box-loading" style={{ width: progress + "%" }}></div>
        </>
      )}
    </form>
  );
}

export default Uploader;

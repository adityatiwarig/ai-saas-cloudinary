"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {toast} from "react-hot-toast"; // react-hot-toast import for notifications

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null); // file state
  const [title, setTitle] = useState(""); // video title
  const [description, setDescription] = useState(""); // video description
  const [isUploading, setIsUploading] = useState(false); // upload loader

  const router = useRouter();
  // max file size of 70 mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      // add notification
      toast.error("File size too large. Max allowed is 70MB.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file); // appending the video file
    formData.append("title", title); // appending the title
    formData.append("description", description); // appending the description
    formData.append("originalSize", file.size.toString()); // appending file size as string

    const toastId = toast.loading("Uploading video..."); // show loading toast fir update hoga

    try {
      const response = await axios.post("/api/video-upload", formData);
      // check for 200 response
      if (response.status === 200) {
        toast.success("Video uploaded successfully!", { id: toastId });
        router.push("/"); // redirect on success
      } else {
        toast.error("Upload failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.log(error);
      // notification for failure
      toast.error("Something went wrong during upload.", { id: toastId });
    } finally {
      setIsUploading(false); // reset loader state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
}

export default VideoUpload;

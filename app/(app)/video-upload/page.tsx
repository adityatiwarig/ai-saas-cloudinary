"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large. Max allowed is 70MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    const toastId = toast.loading("Uploading video...");

    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status === 200) {
        toast.success("Video uploaded successfully!", { id: toastId });
        router.push("/");
      } else {
        toast.error("Upload failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during upload.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 space-y-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center">
          📤 Upload Your Video
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a short description (optional)"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-blue-600 file:text-white file:cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg font-semibold transition duration-200 ${
              isUploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "🚀 Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/app/components/VideoCard";
import { Video } from "@/types";
import { toast } from "react-hot-toast";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from server
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");

      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Download handler
  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Optional: Delete handler
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/delete-video", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Video deleted");
        setVideos((prev) => prev.filter((video) => video.id !== id));
      } else {
        toast.error("Failed to delete video");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-500">
        Loading videos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Uploaded Videos</h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              onDelete={handleDelete} // optional if used
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

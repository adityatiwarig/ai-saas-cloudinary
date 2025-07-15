"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/app/components/VideoCard";
import { Video } from "@/types";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      setVideos(response.data);
    } catch (err) {
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = (url: string, title: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.mp4`;
    a.click();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert("Failed to delete video.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f17] text-white px-4 py-6">
   
      <div className="relative z-0 rounded-2xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-xl border border-white/10">

        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse drop-shadow-lg text-center mb-10">
          ✨ Collections.. ✨
        </h1>

        {/* 📦 Video Cards */}
        {loading ? (
          <p className="text-center text-gray-400">Loading your videos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

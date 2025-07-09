"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/app/components/VideoCard"; // ✅ Adjusted path
import { Video } from "@/types";


function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all uploaded videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ✅ FIXED handleDownload (no arrow wrapper inside)
  const handleDownload = useCallback((url: string, title: string) => {
    try {
      const urlParts = url.split("/upload/");
      if (urlParts.length !== 2) {
        alert("Invalid video URL");
        return;
      }

      const [base, rest] = urlParts;
      const cleanRest = rest.split("?")[0]; // remove query if present

      const finalUrl = `${base}/upload/fl_attachment:${title}/${cleanRest}`;

      const link = document.createElement("a");
      link.href = finalUrl;
      link.setAttribute("download", `${title}.mp4`);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Download failed");
      console.error("Download error:", err);
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading...</div>;
  }

  return(
     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-10 drop-shadow-lg">
          🎬 Your Uploaded Videos
        </h1>

        {videos.length === 0 ? (
          <div className="text-center text-slate-400 text-lg">No videos available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload} onDelete={function (id: string): void {
                  throw new Error("Function not implemented.");
                } }              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

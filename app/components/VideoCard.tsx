"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: [
        "e_preview:duration_15:max_seg_9:min_seg_dur_1",
      ],
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const formatSize = useCallback((size: number) => filesize(size), []);
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="relative bg-[#0a0a10] border border-gray-700/30 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.015] transition-transform duration-300 backdrop-blur-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <figure className="aspect-video relative">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-red-500">
              Preview not available
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs text-white flex items-center">
          <Clock size={14} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </figure>

      {/* 📄 Content */}
      <div className="p-4 text-white">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 animate-shimmer">
          ⚡ {video.title} ⚡
        </h2>
        <p className="text-sm text-gray-300">{video.description}</p>
        <p className="text-xs text-gray-400 mb-4">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileUp size={18} className="text-blue-400" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileDown size={18} className="text-pink-400" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-semibold text-green-400">
            Compression: <span>{compressionPercentage}%</span>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none shadow-md hover:scale-105 transition"
              onClick={() =>
                onDownload(getFullVideoUrl(video.publicId), video.title)
              }
            >
              <Download size={16} />
            </button>
            <button
              className="btn btn-sm bg-red-500 text-white border-none shadow-md hover:bg-red-600 transition"
              onClick={() => onDelete(video.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

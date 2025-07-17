"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isTransforming, setIsTransforming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen w-full bg-black relative text-white font-sans overflow-hidden">

      {/* 🧠 Black Grid + White Dots Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      {/* 🔥 Main Content */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">

        <div className="text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-down">
            🔥 Social Media Image Creator 🔥
          </h1>
          <p className="text-lg text-gray-300 mt-3 animate-fade-in-up">
            Upload your image and generate platform-ready formats in 1 click!
          </p>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-2xl">
          <div className="space-y-6">
            {/* Upload Section */}
            <div>
              <label className="block text-lg font-medium mb-2">📤 Upload your image</label>
              <input
                type="file"
                onChange={handleFileUpload}
                className="file-input w-full file-input-bordered file-input-accent text-white"
              />
            </div>

            {/* Format Dropdown */}
            {uploadedImage && (
              <div>
                <label className="block text-lg font-medium mb-2">📱 Choose Social Format</label>
                <select
                  className="select select-bordered w-full bg-black text-white border-gray-700"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Image Preview */}
            {uploadedImage && (
              <div className="relative mt-8">
                {isTransforming && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10 rounded-xl">
                    <span className="loading loading-spinner loading-lg text-accent"></span>
                  </div>
                )}
                <CldImage
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  sizes="100vw"
                  alt="Transformed"
                  crop="fill"
                  gravity="auto"
                  aspectRatio={socialFormats[selectedFormat].aspectRatio}
                  ref={imageRef}
                  onLoad={() => setIsTransforming(false)}
                  className="rounded-2xl border border-white/20 shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            {/* Download Button */}
            {uploadedImage && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 px-6 py-3 rounded-xl font-semibold text-white shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  ⬇️ Download {selectedFormat} Format
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

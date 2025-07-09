import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-6 py-12">
      <Image src="/fa" width={80} height={80} alt="Logo" className="mb-4" />

      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse text-center">
        Welcome to Cloudinary Showcase ✨
      </h1>

      <p className="mt-6 text-lg text-gray-300 text-center max-w-xl">
        Upload, preview, and download your compressed videos in style. Let's make your videos shine!
      </p>
    </div>
  );
}

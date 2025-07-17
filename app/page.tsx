"use client";

import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignup = () => {
    router.push("/sign-up");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* ✅ Radial Gradient Background only */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #7c3aed 100%)",
        }}
      />

      {/* 🌟 Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-black">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 animate-pulse text-center">
          Welcome to Cloudinary Showcase ✨
        </h1>

        <p className="mt-6 text-lg text-gray-800 text-center max-w-xl">
          Upload, preview, and download your compressed videos in style.
          Let&apos;s make your videos shine!
        </p>

        {/* 🔐 Auth Card */}
        <div className="mt-10 bg-white/60 backdrop-blur-md rounded-xl border border-black/10 p-6 sm:p-8 w-full max-w-md text-center shadow-xl">
          <p className="text-xl font-semibold mb-4 text-black">Already have an account?</p>

          <InteractiveHoverButton
            onClick={handleSignIn}
            className="w-full mb-6 text-white"
          >
            Sign In
          </InteractiveHoverButton>

          <p className="text-xl font-semibold mb-4 text-black">New here?</p>

          <InteractiveHoverButton
            onClick={handleSignup}
            className="w-full text-white"
          >
            Sign Up
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}

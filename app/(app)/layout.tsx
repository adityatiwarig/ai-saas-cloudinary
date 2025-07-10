"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open text-white">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#121212]">
        {/* Navbar */}
        <header className="w-full sticky top-0 z-50 shadow-md backdrop-blur bg-gradient-to-r from-[#161616] via-[#1f1f1f] to-[#2a2a2a] border-b border-zinc-700">
          <div className="navbar max-w-7xl mx-auto px-6 py-3">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost text-white"
              >
                <MenuIcon className="w-6 h-6" />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Cloudinary Showcase
                </span>
              </Link>
            </div>
            <div className="flex-none flex items-center space-x-4">
              {user && (
                <>
                  <div className="avatar">
                    <div className="w-9 h-9 rounded-full ring ring-primary ring-offset-2 ring-offset-black">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username || user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>
                  <span className="text-sm text-zinc-300 truncate max-w-[160px]">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle hover:bg-red-700"
                  >
                    <LogOutIcon className="h-6 w-6 text-red-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto w-full px-6 py-10">{children}</div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-[#111] border-r border-zinc-700 w-64 h-full flex flex-col shadow-lg">
          <div className="flex items-center justify-center py-6">
            <ImageIcon className="w-10 h-10 text-blue-500" />
          </div>
          <ul className="menu px-4 space-y-2 text-white flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 font-semibold ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="px-4 pb-6">
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-full hover:bg-red-600"
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

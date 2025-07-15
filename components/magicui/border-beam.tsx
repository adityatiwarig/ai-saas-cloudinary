"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils"; // or replace with your own cn utility

interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  duration?: number;
  delay?: number;
  size?: number;
  children: React.ReactNode;
}

export function BorderBeam({
  className,
  color = "white",
  duration = 10,
  delay = 0,
  size = 300,
  children,
  ...props
}: BorderBeamProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--beam-color", color);
    el.style.setProperty("--beam-duration", `${duration}s`);
    el.style.setProperty("--beam-delay", `${delay}s`);
    el.style.setProperty("--beam-size", `${size}px`);
  }, [color, duration, delay, size]);

  return (
    <div
      ref={ref}
      className={cn("relative z-0", className)}
      {...props}
    >
      <div className="absolute inset-0 z-[-1] rounded-xl border border-neutral-800 before:absolute before:inset-0 before:animate-border-beam before:bg-[radial-gradient(var(--beam-size)_at_var(--mouse-x)_var(--mouse-y),var(--beam-color)_0%,transparent_80%)]" />
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "trgt:bg-video-current-time";

function readStoredTime() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedSecondRef = useRef(-1);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const restorePlaybackPosition = () => {
      const storedTime = readStoredTime();

      if (storedTime === null) {
        return;
      }

      if (Number.isFinite(video.duration) && storedTime >= video.duration - 0.25) {
        video.currentTime = 0;
        return;
      }

      video.currentTime = storedTime;
    };

    const persistPlaybackPosition = () => {
      const currentSecond = Math.floor(video.currentTime);

      if (currentSecond === lastSavedSecondRef.current) {
        return;
      }

      lastSavedSecondRef.current = currentSecond;
      window.sessionStorage.setItem(STORAGE_KEY, String(video.currentTime));
    };

    const resumePlayback = () => {
      restorePlaybackPosition();
      void video.play().catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      persistPlaybackPosition();

      if (!document.hidden) {
        resumePlayback();
      }
    };

    restorePlaybackPosition();
    void video.play().catch(() => undefined);

    video.addEventListener("loadedmetadata", restorePlaybackPosition);
    video.addEventListener("timeupdate", persistPlaybackPosition);
    window.addEventListener("pagehide", persistPlaybackPosition);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      persistPlaybackPosition();
      video.removeEventListener("loadedmetadata", restorePlaybackPosition);
      video.removeEventListener("timeupdate", persistPlaybackPosition);
      window.removeEventListener("pagehide", persistPlaybackPosition);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/bg.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.3]"
    />
  );
}

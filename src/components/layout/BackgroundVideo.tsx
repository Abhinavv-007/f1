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

    const ensurePlayback = () => {
      if (document.hidden) {
        return;
      }

      if (video.ended) {
        video.currentTime = 0;
      }

      if (video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    const resumePlayback = () => {
      restorePlaybackPosition();
      ensurePlayback();
    };

    const handlePause = () => {
      persistPlaybackPosition();

      window.setTimeout(() => {
        ensurePlayback();
      }, 120);
    };

    const handleEnded = () => {
      window.sessionStorage.setItem(STORAGE_KEY, "0");
      lastSavedSecondRef.current = 0;
      video.currentTime = 0;
      ensurePlayback();
    };

    const handleVisibilityChange = () => {
      persistPlaybackPosition();

      if (!document.hidden) {
        resumePlayback();
      }
    };

    restorePlaybackPosition();
    ensurePlayback();

    video.addEventListener("loadedmetadata", restorePlaybackPosition);
    video.addEventListener("canplay", ensurePlayback);
    video.addEventListener("timeupdate", persistPlaybackPosition);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("stalled", ensurePlayback);
    window.addEventListener("pagehide", persistPlaybackPosition);
    window.addEventListener("pageshow", resumePlayback);
    window.addEventListener("focus", ensurePlayback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      persistPlaybackPosition();
      video.removeEventListener("loadedmetadata", restorePlaybackPosition);
      video.removeEventListener("canplay", ensurePlayback);
      video.removeEventListener("timeupdate", persistPlaybackPosition);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("stalled", ensurePlayback);
      window.removeEventListener("pagehide", persistPlaybackPosition);
      window.removeEventListener("pageshow", resumePlayback);
      window.removeEventListener("focus", ensurePlayback);
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

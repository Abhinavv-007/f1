"use client";

import { useEffect, useState } from "react";
import type { SessionSnapshot } from "@/lib/race";

interface CountdownState {
  compact: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

const EMPTY_COUNTDOWN: CountdownState = {
  compact: "--:--:--:--",
  days: "--",
  hours: "--",
  minutes: "--",
  seconds: "--",
  expired: false,
};

function buildCountdown(startsAt: string | null, now: number): CountdownState {
  if (!startsAt) {
    return EMPTY_COUNTDOWN;
  }

  const diff = new Date(startsAt).getTime() - now;

  if (Number.isNaN(diff)) {
    return EMPTY_COUNTDOWN;
  }

  if (diff <= 0) {
    return {
      compact: "LOCKED",
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      expired: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const format = (value: number) => value.toString().padStart(2, "0");

  return {
    compact: `${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`,
    days: format(days),
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
    expired: false,
  };
}

export function useRaceSession() {
  const [session, setSession] = useState<SessionSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = (await res.json()) as SessionSnapshot & { error?: string };

        if (cancelled) {
          return;
        }

        if (!res.ok) {
          setError(data.error ?? "Failed to load session data.");
          return;
        }

        setError(null);
        setSession(data);
        setNow(Date.now());
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load session data.");
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.startsAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [session?.startsAt]);

  const countdown =
    now === null ? EMPTY_COUNTDOWN : buildCountdown(session?.startsAt ?? null, now);

  return {
    session,
    countdown,
    error,
    isLoading: session === null && error === null,
    isLocked: Boolean(session?.isLocked) || countdown.expired,
  };
}

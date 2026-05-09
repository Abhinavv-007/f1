"use client";

const SECRET_KEY = "trgt:admin:secret";

export function getStoredSecret(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SECRET_KEY) ?? "";
}

export function setStoredSecret(value: string): void {
  if (typeof window === "undefined") return;
  if (value) sessionStorage.setItem(SECRET_KEY, value);
  else sessionStorage.removeItem(SECRET_KEY);
}

export async function adminFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("x-admin-secret", getStoredSecret());
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }
  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function relTime(unixSec: number): string {
  if (!unixSec) return "—";
  const diff = Math.floor(Date.now() / 1000) - unixSec;
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function shortUptime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  if (sec < 86400) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  return `${d}d ${h}h`;
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export interface AdminSummary {
  service: string;
  generatedAt: number;
  process: { booted_at: number; uptime_ms: number; uptime_seconds: number; runtime: string };
  config: { firebase_configured: boolean; gemini_configured: boolean; admin_secret_set: boolean; node_env: string | null };
  db: string;
  metrics: {
    total_requests: number;
    per_route: Array<{ route: string; total: number; success: number; errors: number; error_rate_pct: number | null; last_seen: number; avg_latency_ms: number | null }>;
    status_codes: Record<string, number>;
  };
}

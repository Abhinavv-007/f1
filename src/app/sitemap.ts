import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://trgt.in";

const lastModified = new Date();

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/standings", priority: 0.9, changeFrequency: "daily" },
  { path: "/leaderboard", priority: 0.9, changeFrequency: "daily" },
  { path: "/predict", priority: 0.9, changeFrequency: "weekly" },
  { path: "/live", priority: 0.8, changeFrequency: "hourly" },
  { path: "/stats", priority: 0.8, changeFrequency: "weekly" },
  { path: "/api-docs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

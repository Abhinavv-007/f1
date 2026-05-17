import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/profile/", "/login/"],
      },
    ],
    sitemap: "https://trgt.in/sitemap.xml",
    host: "https://trgt.in",
  };
}

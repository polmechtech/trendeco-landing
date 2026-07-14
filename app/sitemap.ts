import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trendeco.eu";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/o-nas`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}

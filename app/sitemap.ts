import type { MetadataRoute } from "next";
import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { seoCategories } from "@/lib/seoCategories";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://trendeco.eu";
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/o-nas`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dostawa`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/zwroty-i-reklamacje`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...seoCategories.map((category) => ({
      url: `${baseUrl}/kategoria/${category.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.95,
    })),
  ];

  try {
    const response = await fetch(`${baseUrl}/api/allegro/offers`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return staticPages;

    const products = (await response.json()) as AllegroProduct[];
    return [
      ...staticPages,
      ...products.map((product) => ({
        url: `${baseUrl}${getOfferPath(product)}`,
        lastModified: now,
        changeFrequency: "hourly" as const,
        priority: 0.8,
        images: product.image ? [product.image] : undefined,
      })),
    ];
  } catch {
    return staticPages;
  }
}

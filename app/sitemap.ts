import type { MetadataRoute } from "next";
import { Redis } from "@upstash/redis";
import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { seoCategories } from "@/lib/seoCategories";
import { seoGuides } from "@/lib/seoGuides";
import { productSitemapSnapshot } from "@/lib/productSitemapSnapshot";
export const revalidate = 3600;
const OFFERS_CACHE_KEY = "allegro:offers_cache:v4";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl="https://www.trendeco.eu"; const now=new Date();
 const staticPages:MetadataRoute.Sitemap=[
  {url:baseUrl,lastModified:now,changeFrequency:"hourly",priority:1},
  {url:`${baseUrl}/o-nas`,lastModified:now,changeFrequency:"monthly",priority:.6},
  {url:`${baseUrl}/dostawa`,lastModified:now,changeFrequency:"monthly",priority:.7},
  {url:`${baseUrl}/zwroty-i-reklamacje`,lastModified:now,changeFrequency:"monthly",priority:.7},
  {url:`${baseUrl}/regulamin`,lastModified:now,changeFrequency:"monthly",priority:.5},
  {url:`${baseUrl}/polityka-prywatnosci`,lastModified:now,changeFrequency:"monthly",priority:.5},
  {url:`${baseUrl}/poradnik`,lastModified:now,changeFrequency:"weekly",priority:.85},
  ...seoGuides.map(guide=>({url:`${baseUrl}/poradnik/${guide.slug}`,lastModified:now,changeFrequency:"monthly" as const,priority:.8})),
  ...seoCategories.map(category=>({url:`${baseUrl}/kategoria/${category.slug}`,lastModified:now,changeFrequency:"daily" as const,priority:.95}))
 ];
 try {
  const hasRedis = Boolean(
   (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
   (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
  const products = hasRedis
   ? await Promise.race<AllegroProduct[] | null>([
      Redis.fromEnv().get<AllegroProduct[]>(OFFERS_CACHE_KEY),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 750)),
     ])
   : null;
  const productPages: MetadataRoute.Sitemap = Array.isArray(products) && products.length > 0
   ? products.map(product=>({url:`${baseUrl}${getOfferPath(product)}`,lastModified:now,changeFrequency:"hourly" as const,priority:.8,images:product.image?[product.image]:undefined}))
   : productSitemapSnapshot.map(path=>({url:`${baseUrl}${path}`,changeFrequency:"daily" as const,priority:.8}));
  return [...staticPages, ...productPages];
 } catch {
  return [...staticPages, ...productSitemapSnapshot.map(path=>({url:`${baseUrl}${path}`,changeFrequency:"daily" as const,priority:.8}))];
 }
}

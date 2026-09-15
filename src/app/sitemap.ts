import type { MetadataRoute } from "next";
import { site } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date("2026-09-15"), changeFrequency: "monthly", priority: 1 }];
}

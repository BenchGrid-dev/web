import type { MetadataRoute } from "next";
import { models, reviewed } from "@/lib/models";
import { guides } from "@/lib/guides";
import { comparisonNotes } from "@/lib/comparisons";
import { rankings } from "@/lib/rankings";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: reviewed,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...[
      "/models",
      "/rankings",
      "/compare",
      "/guides",
      "/methodology",
      ...models.map((m) => `/models/${m.slug}`),
    ].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: reviewed,
      changeFrequency: "monthly" as const,
      priority: path.startsWith("/models/") ? 0.8 : 0.6,
    })),
    ...guides.map((g) => ({ url: `${siteUrl}/guides/${g.slug}`, lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...comparisonNotes.map((note) => ({ url: `${siteUrl}/compare/${note.slug}`, lastModified: note.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...rankings.map((ranking) => ({ url: `${siteUrl}/rankings/${ranking.slug}`, lastModified: ranking.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}

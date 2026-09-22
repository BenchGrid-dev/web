import type { MetadataRoute } from "next";
import { siteUrl, isPublicSite } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPublicSite
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

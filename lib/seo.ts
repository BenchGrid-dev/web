import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://benchgrid.dev"
).replace(/\/$/, "");
export const isPublicSite =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.SITE_INDEXING !== "false" &&
  siteUrl.startsWith("https://") && !/localhost|127\.0\.0\.1/.test(siteUrl);
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${title} — BenchGrid`,
      description,
      url: `${siteUrl}${path}`,
      type: "website",
      siteName: "BenchGrid",
      images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "BenchGrid — Open-model deployment intelligence" }],
    },
    twitter: { card: "summary_large_image", title: `${title} — BenchGrid`, description, images: [`${siteUrl}/opengraph-image`] },
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

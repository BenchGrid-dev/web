import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { ModelTools } from "@/components/model-tools";
import { siteUrl, isPublicSite, jsonLd } from "@/lib/seo";
import "@fontsource-variable/dm-sans";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BenchGrid — Model specs & GPU memory requirements",
    template: "%s | BenchGrid",
  },
  description:
    "Explore MiMo, Qwen, Llama, and Gemma. Compare model specifications, estimate GPU memory, and make better-informed open-model deployment decisions.",
  icons: { icon: "/favicon.svg" },
  robots: { index: isPublicSite, follow: isPublicSite },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <ModelTools />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "BenchGrid",
              url: siteUrl,
              description:
                "An independent field guide to open-model deployment.",
            }),
          }}
        />
      </body>
    </html>
  );
}

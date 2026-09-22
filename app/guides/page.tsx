import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/chrome";
import { guides } from "@/lib/guides";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";
export const metadata = pageMetadata(
  "LLM deployment field notes: GPU memory, quantization & inference",
  "Practical guides to GPU memory, inference latency, throughput, and reading reproducible AI model benchmarks.",
  "/guides",
);
export default function GuidesPage() {
  return (
    <main id="main" className="page-width guides-page">
      <Breadcrumb items={[{ label: "Deployment guides" }]} />
      <div className="page-intro">
        <h1>Deployment field notes</h1>
        <p>Practical notes on GPU memory, quantization, multi-GPU serving, and reproducible model benchmarks.</p>
      </div>
      <div className="guide-list">
        {[...guides].reverse().map((g) => (
          <Link href={`/guides/${g.slug}`} key={g.slug}>
            <div>
              <span className="eyebrow">{g.category}</span>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <span className="mono">{g.readTime}</span>
            </div>
            <ArrowUpRight size={28} />
          </Link>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Deployment field notes", url: `${siteUrl}/guides`, mainEntity: { "@type": "ItemList", itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: `${siteUrl}/guides/${g.slug}` })) } }) }} />
    </main>
  );
}

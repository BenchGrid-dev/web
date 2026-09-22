import Link from "next/link";
import { ArrowRight, BookOpen, GitCompareArrows } from "lucide-react";
import { MemorySnapshot } from "@/components/memory-snapshot";
import { ModelDirectory } from "@/components/model-directory";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";
import { trendingModels } from "@/lib/models";

export const metadata = pageMetadata(
  "Compare AI models: GPU memory & deployment specs",
  "Explore Qwen, MiMo, Gemma, and GLM GPU requirements. Compare model specifications and weight memory estimates with transparent sources and practical deployment guides.",
  "/",
);
const notes = [
  { slug: "4-bit-vs-8-bit-llm-inference", title: "4-bit vs. 8-bit inference", description: "Weight storage, compatibility, and the quality trade-off." },
  { slug: "kv-cache-context-length-vram", title: "Why longer contexts need more VRAM", description: "A worked KV cache example and a diagnosis checklist." },
  { slug: "moe-active-vs-total-parameters", title: "MoE: active parameters are not memory", description: "Separate sparse computation from checkpoint storage." },
];

export default function Home() {
  return (
    <main id="main" className="explorer-home">
      <div className="page-width">
        <section className="explorer-intro" aria-labelledby="explorer-title">
          <div>
            <h1 id="explorer-title">Know what it takes to run a model.</h1>
            <p>Compare GPU memory, context windows, and deployment specs for the latest open-weight models.</p>
          </div>
          <Link href="/compare" className="button primary"><GitCompareArrows size={17} /> Compare models</Link>
        </section>
        <div className="data-status">
          <span className="status-indicator" aria-hidden="true" />
          <span>Official model specs <span className="status-divider">/</span> Calculated memory estimates</span>
          <Link href="/methodology">How we get the data <ArrowRight size={14} /></Link>
        </div>
        <ModelDirectory variant="trending" />
        <section className="deployment-resources" aria-label="Memory estimates and deployment guides">
          <MemorySnapshot />
          <div className="resource-guides">
            <div className="resource-heading"><BookOpen size={16} /><h2>Field notes</h2><Link href="/guides">View all <ArrowRight size={14} /></Link></div>
            {notes.map((note) => (
              <Link className="resource-guide" href={`/guides/${note.slug}`} key={note.slug}>
                <div><h3>{note.title}</h3><p>{note.description}</p></div><ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org", "@type": "ItemList", name: "BenchGrid trending model picks",
        itemListElement: trendingModels.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: `${siteUrl}/models/${m.slug}` })),
      }) }} />
    </main>
  );
}

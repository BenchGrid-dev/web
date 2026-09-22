import Link from "next/link";
import { comparisonNotes } from "@/lib/comparisons";
import { Breadcrumb, ArrowLink } from "@/components/chrome";
import { Comparison } from "@/components/comparison";
import { models } from "@/lib/models";
import { pageMetadata, jsonLd, siteUrl, isPublicSite } from "@/lib/seo";
const baseMetadata = pageMetadata(
  "Compare open models: specifications & GPU memory",
  "Compare Qwen, MiMo, Llama, and Gemma side by side. Explore parameter counts, context windows, licenses, and calculated 16-bit, 8-bit, and 4-bit weight memory.",
  "/compare",
);
type Query = { models?: string; bits?: string };
export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  return query.models !== undefined || query.bits !== undefined
    ? { ...baseMetadata, robots: { index: false, follow: isPublicSite } }
    : baseMetadata;
}
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ models?: string; bits?: string }>;
}) {
  const query = await searchParams;
  const requested = [
    ...new Set(
      (typeof query.models === "string" ? query.models : "").split(","),
    ),
  ]
    .filter((slug) => models.some((m) => m.slug === slug))
    .slice(0, 3);
  const selected =
    requested.length >= 2
      ? requested
      : [
          ...requested,
          ...["qwen3-8-27b", "mimo-v2-6-distill-qwen-9b", "gemma-4-12b"].filter(
            (x) => !requested.includes(x),
          ),
        ].slice(0, 3);
  return (
    <main id="main" className="page-width compare-page">
      <Breadcrumb items={[{ label: "Compare models" }]} />
      <div className="page-intro">
        <h1>Compare open AI models</h1>
        <p>Compare GPU memory estimates, parameter counts, context windows, and licenses side by side.</p>
      </div>
      <Comparison
        key={selected.join(",")}
        initial={selected}
        initialBits={
          [4, 8, 16].includes(Number(query.bits)) ? Number(query.bits) : 16
        }
      />
      <section className="comparison-collection">
        <div className="section-heading"><div><h2>Deployment comparisons</h2><p className="trending-caption">Selected pairs, with sourced specifications and a clear test plan.</p></div></div>
        <div className="comparison-note-grid">{comparisonNotes.map((note) => <Link key={note.slug} href={`/compare/${note.slug}`}><h3>{note.title}</h3><p>{note.description}</p><span>Read comparison →</span></Link>)}</div>
      </section>
      <section className="comparison-editorial">
        <h2>How to compare model deployment requirements</h2>
        <p>Start with the exact checkpoint and input modalities your application needs. Compare total parameters, context configuration, license, and runtime support before estimating weight memory. Then validate the configuration under a representative workload.</p>
        <h3>Is the memory estimate a minimum GPU requirement?</h3>
        <p>No. It estimates raw weight storage at the selected precision in decimal GB. KV cache, quantization metadata, encoders, and runtime allocations can add memory. Pending entries have not yet had their complete checkpoint scope reconciled.</p>
        <h3>Can I compare inference speed here?</h3>
        <p>Not yet. BenchGrid has not run GPU performance tests. The table separates publisher specifications and calculated estimates from measured performance; it does not rank models by speed or quality.</p>
        <h3>Why are total and active parameters different?</h3>
        <p>A sparse model may use only some experts for each token while retaining a much larger checkpoint. Use the complete weight scope for storage planning. <Link href="/guides/moe-active-vs-total-parameters">Read our MoE memory field note.</Link></p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Compare open AI models", url: `${siteUrl}/compare`, description: "Sourced model specifications, calculated weight storage, and selected deployment comparisons.", mainEntity: { "@type": "ItemList", itemListElement: comparisonNotes.map((note, i) => ({ "@type": "ListItem", position: i + 1, name: note.title, url: `${siteUrl}/compare/${note.slug}` })) } }) }} />
      <div className="compare-next">
        <h2>Memory is the starting point.</h2>
        <p>
          Latency, throughput, and quality need a test that reflects your
          workload.
        </p>
        <ArrowLink href="/guides/reading-a-benchmark">
          Learn to read a benchmark
        </ArrowLink>
      </div>
    </main>
  );
}

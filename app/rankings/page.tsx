import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Breadcrumb } from "@/components/chrome";
import { RankingCards } from "@/components/ranking-cards";
import { rankings } from "@/lib/rankings";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata("Open-model rankings & deployment shortlists", "Explore model weight-memory rankings, long-context tiers, and compact, coding, multimodal, and MoE deployment shortlists. Every list explains its evidence and scope.", "/rankings");
export default function RankingsPage() {
  return <main id="main" className="page-width rankings-page">
    <Breadcrumb items={[{ label: "Rankings" }]} />
    <div className="page-intro ranking-intro"><span className="eyebrow">CHOOSE BY THE QUESTION</span><h1>Model rankings & shortlists</h1><p>Find candidates for your next deployment. Compare the specifications we can verify, then narrow the test to your workload.</p></div>
    <div className="ranking-evidence"><span className="status-indicator" aria-hidden="true" /><p><strong>Specifications first.</strong> Calculated rankings and editorial shortlists are labeled separately. Performance benchmarks are not available yet.</p><Link href="/methodology">Our methodology <ArrowRight size={15} /></Link></div>
    <section aria-labelledby="ranking-collections"><div className="section-heading"><h2 id="ranking-collections">Explore the lists <span className="directory-count">{rankings.length}</span></h2><span className="section-caption">Sources and ordering explained on every page</span></div><RankingCards entries={rankings} /></section>
    <section className="ranking-pending" aria-labelledby="performance-next"><div className="ranking-pending-heading"><FlaskConical size={20} /><div><h2 id="performance-next">The measured rankings come next</h2><p>These need reproducible GPU runs. No scores or winners have been assigned.</p></div></div><div className="ranking-pending-grid">{[
      ["24 / 48 / 80 GB GPU fit", "Working configurations at a stated precision, context, and concurrency."],
      ["Inference speed", "Successful throughput and tail latency on the same hardware and workload."],
      ["Deployment cost", "Measured capacity paired with dated instance pricing and utilization assumptions."],
    ].map(([title, body]) => <div key={title}><span className="ranking-pending-label">AWAITING TESTS</span><h3>{title}</h3><p>{body}</p></div>)}</div></section>
    <section className="comparison-editorial"><h2>How to use these lists</h2><p>Choose a question, inspect the inclusion rules, then open a model profile to check the original card. The lists cover a curated directory, not the whole open-model ecosystem. Position in an alphabetical shortlist does not indicate quality.</p><p>To compare individual candidates side by side, use the <Link href="/compare">model comparison tool</Link>. For sizing context and runtime overhead, start with our <Link href="/guides/how-much-vram-do-you-need">GPU memory field note</Link>.</p></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Model rankings & shortlists", url: `${siteUrl}/rankings`, mainEntity: { "@type": "ItemList", itemListOrder: "https://schema.org/ItemListUnordered", numberOfItems: rankings.length, itemListElement: rankings.map((entry, i) => ({ "@type": "ListItem", position: i + 1, name: entry.title, url: `${siteUrl}/rankings/${entry.slug}` })) } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Rankings", item: `${siteUrl}/rankings` }] },
    ]) }} />
  </main>;
}

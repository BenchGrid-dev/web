import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/chrome";
import { ModelMark } from "@/components/model-directory";
import { RankingCards } from "@/components/ranking-cards";
import { rankings, rankingModels, rankingMetric, contextTier } from "@/lib/rankings";
import { weightGB } from "@/lib/models";
import { guides } from "@/lib/guides";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";

export function generateStaticParams() { return rankings.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ranking = rankings.find((entry) => entry.slug === slug);
  return ranking ? pageMetadata(ranking.title, ranking.description, `/rankings/${slug}`) : { title: "Ranking not found" };
}
export default async function RankingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ranking = rankings.find((entry) => entry.slug === slug);
  if (!ranking) notFound();
  const models = rankingModels(ranking);
  const guide = guides.find((guide) => guide.slug === ranking.guide)!;
  const order = ranking.kind === "calculated" ? "ItemListOrderAscending" : ranking.kind === "specification" ? "ItemListOrderDescending" : "ItemListUnordered";
  return <main id="main" className="page-width rankings-page">
    <Breadcrumb items={[{ label: "Rankings", href: "/rankings" }, { label: ranking.title }]} />
    <div className="page-intro ranking-intro"><span className={`ranking-label ranking-label--${ranking.kind}`}>{ranking.label}</span><h1>{ranking.title}</h1><p>{ranking.description}</p><div className="ranking-byline">{models.length} models · Reviewed <time dateTime={ranking.updated}>September 22, 2026</time> · BenchGrid editorial</div></div>
    <dl className="ranking-rules"><div><dt>What is included</dt><dd>{ranking.scope}</dd></div><div><dt>How this list is ordered</dt><dd>{ranking.ordering}</dd></div></dl>
    <p className="ranking-table-help" id="ranking-scroll-help">Publisher sources are linked for every model. {ranking.kind === "calculated" ? "≈ marks nominal parameter arithmetic. Weight storage excludes serving overhead." : "No independent performance scores have been measured."} <span>On smaller screens, scroll the table horizontally.</span></p>
    <div className="ranking-table-wrap" role="region" aria-label={`${ranking.title} model table`} aria-describedby="ranking-scroll-help" tabIndex={0}>
      <table className="ranking-table" data-ranking-kind={ranking.kind}>
        <caption className="sr-only">{ranking.title}. {ranking.ordering}</caption>
        <thead><tr>{ranking.kind === "calculated" && <th scope="col">Rank</th>}<th scope="col">Model</th><th scope="col">{ranking.metric}</th>{ranking.kind !== "specification" && <th scope="col">Context</th>}<th scope="col">Deployment note</th></tr></thead>
        <tbody>{models.map((model) => {
          const rank = ranking.kind === "calculated" ? models.findIndex((entry) => entry.params === model.params) + 1 : undefined;
          const value = ranking.kind === "calculated" ? weightGB(model.params!) : ranking.kind === "specification" ? contextTier(model) : undefined;
          return <tr key={model.slug} data-model-slug={model.slug} data-sort-value={value}>
            {rank !== undefined && <td className="ranking-position">{String(rank).padStart(2, "0")}</td>}
            <th scope="row"><div className="ranking-model"><ModelMark model={model} /><Link href={`/models/${model.slug}`}>{model.name}</Link></div><div className="ranking-model-meta"><span>{model.maker}</span>{model.baseline && <span className="ranking-baseline">Baseline</span>}<a href={model.source} target="_blank" rel="noopener noreferrer" aria-label={`${model.name} official model card`}>Source <ArrowUpRight size={12} /></a></div></th>
            <td className="ranking-value">{rankingMetric(ranking, model)}{ranking.kind === "calculated" && <small>{model.size} parameters</small>}</td>
            {ranking.kind !== "specification" && <td className="ranking-context">{model.context}</td>}
            <td className="ranking-note">{ranking.notes[model.slug] || model.takeaway}<Link href={`/compare?models=${model.slug},${models.find((entry) => entry.slug !== model.slug)!.slug}`}>Compare model <ArrowRight size={13} /></Link></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <div className="comparison-editorial ranking-editorial">{ranking.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}<section><h2>Before you choose hardware</h2><p><Link href={`/guides/${guide.slug}`}>{guide.title}</Link> explains the next planning step. For the distinction between publisher specifications, calculations, and measurements, read the <Link href="/methodology">BenchGrid methodology</Link>.</p></section></div>
    <section className="ranking-related" aria-labelledby="related-rankings"><div className="section-heading"><h2 id="related-rankings">Explore another question</h2><Link className="browse-models-link" href="/rankings">All rankings <ArrowRight size={16} /></Link></div><RankingCards entries={rankings.filter((entry) => entry.slug !== slug).slice(0, 3)} /></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([
      { "@context": "https://schema.org", "@type": "CollectionPage", name: ranking.title, description: ranking.description, url: `${siteUrl}/rankings/${slug}`, dateModified: ranking.updated, author: { "@type": "Organization", name: "BenchGrid", url: siteUrl }, citation: models.map((model) => model.source), mainEntity: { "@type": "ItemList", name: ranking.title, description: ranking.ordering, numberOfItems: models.length, itemListOrder: `https://schema.org/${order}`, itemListElement: models.map((model, i) => ({ "@type": "ListItem", position: i + 1, name: model.name, url: `${siteUrl}/models/${model.slug}` })) } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Rankings", item: `${siteUrl}/rankings` }, { "@type": "ListItem", position: 3, name: ranking.title, item: `${siteUrl}/rankings/${slug}` }] },
    ]) }} />
  </main>;
}

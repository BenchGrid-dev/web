import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, ArrowLink } from "@/components/chrome";
import { Comparison } from "@/components/comparison";
import { comparisonNotes } from "@/lib/comparisons";
import { guides } from "@/lib/guides";
import { models } from "@/lib/models";
import { pageMetadata, siteUrl, jsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return comparisonNotes.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = comparisonNotes.find((item) => item.slug === slug);
  return note ? pageMetadata(`${note.title}: deployment comparison`, note.description, `/compare/${slug}`) : { title: "Comparison not found" };
}
export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = comparisonNotes.find((item) => item.slug === slug);
  if (!note) notFound();
  const selectedModels = note.models.map((slug) => models.find((model) => model.slug === slug)!);
  return (
    <main id="main" className="page-width compare-page">
      <Breadcrumb items={[{ label: "Compare models", href: "/compare" }, { label: note.title }]} />
      <div className="page-intro">
        <span className="eyebrow">DEPLOYMENT COMPARISON · SPECIFICATIONS</span>
        <h1>{note.title}</h1><p>{note.intro}</p>
        <p className="comparison-review">By BenchGrid editorial · Reviewed <time dateTime={note.updated}>September 22, 2026</time> · Performance not yet measured</p>
      </div>
      <Comparison initial={note.models} fixedModels />
      <div className="comparison-editorial">
        {note.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
        <section><h2>Sources and model profiles</h2><ul>{selectedModels.map((model) => <li key={model.slug}><Link href={`/models/${model.slug}`}>{model.name} deployment profile</Link>{" · "}<a href={model.source} target="_blank" rel="noopener noreferrer">Official model card</a></li>)}</ul></section>
        <section><h2>Continue reading</h2><ul>{note.guides.map((slug) => { const guide = guides.find((g) => g.slug === slug)!; return <li key={slug}><Link href={`/guides/${slug}`}>{guide.title}</Link></li>; })}</ul></section>
        <ArrowLink href="/compare">Build your own comparison</ArrowLink>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([
        { "@context": "https://schema.org", "@type": "Article", headline: note.title, description: note.description, datePublished: note.updated, dateModified: note.updated, author: { "@type": "Organization", name: "BenchGrid", url: siteUrl }, mainEntityOfPage: `${siteUrl}/compare/${slug}`, citation: selectedModels.map((model) => model.source), about: selectedModels.map((model) => ({ "@type": "Thing", name: model.name, url: `${siteUrl}/models/${model.slug}` })) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Compare models", item: `${siteUrl}/compare` }, { "@type": "ListItem", position: 3, name: note.title, item: `${siteUrl}/compare/${slug}` }] },
      ]) }} />
    </main>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb, ArrowLink } from "@/components/chrome";
import { guides } from "@/lib/guides";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  return g
    ? { ...pageMetadata(g.title, g.description, `/guides/${slug}`), openGraph: { ...pageMetadata(g.title, g.description, `/guides/${slug}`).openGraph, type: "article", publishedTime: g.published, modifiedTime: g.updated } }
    : { title: "Field note not found" };
}
export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  return (
    <main id="main" className="page-width article-page">
      <Breadcrumb
        items={[
          { label: "Field notes", href: "/guides" },
          { label: `Note ${g.number}` },
        ]}
      />
      <article>
        <header className="article-header">
          <span className="eyebrow">
            FIELD NOTE {g.number} / {g.category}
          </span>
          <h1>{g.title}</h1>
          <div className="article-meta">
            <span>BenchGrid editorial</span>
            <time dateTime={g.published}>{new Date(`${g.published}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>
            <span>{g.readTime}</span>
          </div>
          <p className="article-intro">{g.intro}</p>
        </header>
        <div className="article-layout">
          <aside>
            <span className="eyebrow">IN THIS NOTE</span>
            {g.sections.map((s, i) => (
              <a key={s.title} href={`#section-${i + 1}`}>
                <span className="mono">0{i + 1}</span>
                {s.title}
              </a>
            ))}
          </aside>
          <div className="article-body">
            {g.sections.map((s, i) => (
              <section id={`section-${i + 1}`} key={s.title}>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
            <section className="article-sources">
              <span className="eyebrow">SOURCES & FURTHER READING</span>
              {g.sources.map((s) => (
                <a
                  href={s.url}
                  key={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.title}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </section>
            <section className="article-related">
              <h2>Related field notes</h2>
              <ul>{(g.related ? guides.filter((item) => g.related!.includes(item.slug)) : guides.filter((item) => item.slug !== g.slug).slice(-2)).map((item) => <li key={item.slug}><Link href={`/guides/${item.slug}`}>{item.title}</Link></li>)}</ul>
            </section>
            <div className="article-cta">
              <h3>Put the context to work.</h3>
              <p>
                Explore the models, compare the fundamentals, and start with a
                clearer picture.
              </p>
              <ArrowLink href="/compare">Compare models</ArrowLink>
            </div>
          </div>
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: g.title,
              description: g.description,
              datePublished: g.published,
              dateModified: g.updated,
              author: { "@type": "Organization", name: "BenchGrid", url: siteUrl },
              image: `${siteUrl}/opengraph-image`,
              mainEntityOfPage: `${siteUrl}/guides/${slug}`,
              citation: g.sources.map((s) => s.url),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Field notes",
                  item: `${siteUrl}/guides`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: g.title,
                  item: `${siteUrl}/guides/${slug}`,
                },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}

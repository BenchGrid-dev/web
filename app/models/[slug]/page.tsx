import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowRight, BookOpen, FlaskConical } from "lucide-react";
import { models, getModel, formatGB, weightGB, reviewed } from "@/lib/models";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";
import { Breadcrumb, ArrowLink } from "@/components/chrome";
import { ModelMark } from "@/components/model-directory";
import { rankings } from "@/lib/rankings";
import { comparisonNotes } from "@/lib/comparisons";
import { MemoryCalculator } from "@/components/memory-calculator";
export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getModel(slug);
  if (!m) return { title: "Model not found" };
  return pageMetadata(
    `${m.name}: GPU memory & deployment guide`,
    `${m.name} specifications, ${m.size} parameters, ${m.context} context, and GPU weight-memory estimates. Compare deployment considerations and inspect official sources.`,
    `/models/${slug}`,
  );
}
export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();
  const related = models.filter((m) => m.slug !== slug).slice(0, 3);
  const faq = [
    {
      question: `How much GPU memory does ${model.name} need?`,
      answer: model.params === null ? "The full checkpoint weight footprint is pending review. Minimum and recommended GPU configurations will be added after testing; the model name or active parameter count alone is not a memory requirement." : `At 16-bit precision, the estimated weight storage is ${formatGB(weightGB(model.params))} GB. At 8-bit it is ${formatGB(weightGB(model.params, 8))} GB, and at 4-bit it is ${formatGB(weightGB(model.params, 4))} GB. These are theoretical weight-only estimates, excluding KV cache, runtime allocations, and quantization metadata. A working deployment needs additional memory and a supported checkpoint.`,
    },
    {
      question: `Has BenchGrid benchmarked ${model.name}?`,
      answer:
        "Not yet. This profile contains publisher specifications and calculated weight-memory estimates. We do not currently publish measured latency, throughput, or cost per token for this model.",
    },
    {
      question: "Where do these specifications come from?",
      answer: `The specifications are based on the official ${model.maker} model card linked on this page. Memory estimates use the stated total parameter count, including inactive experts for MoE models. Nominal model sizes are labeled with ~.`,
    },
  ];
  return (
    <main id="main" className="page-width detail-page">
      <Breadcrumb
        items={[{ label: "Models", href: "/models" }, { label: model.name }]}
      />
      <section className="detail-hero">
        <div>
          <div className="detail-brand">
            <ModelMark model={model} />
            <span className="eyebrow">{model.maker} / MODEL PROFILE</span>
          </div>
          <h1>
            {model.name}
          </h1>
          <p>{model.description}</p>
          <div className="detail-actions">
            <Link
              className="button dark"
              href={`/compare?models=${model.slug},${model.slug === "qwen3-8-27b" ? "gemma-4-12b" : "qwen3-8-27b"}`}
            >
              Compare this model <ArrowRight size={16} />
            </Link>
            <a
              className="text-link"
              href={model.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official model card <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="profile-status">
          <BookOpen size={19} />
          <strong>Data sources</strong>
          <span>Publisher specifications</span>
          <span>Calculated memory estimates</span>
          <small>Source review · Sep 22, 2026</small>
        </div>
      </section>
      <dl className="detail-stats">
        {[
          ["Published size", model.size],
          ["Active parameters", model.active || (model.architecture.includes("MoE") ? "See model card" : model.size)],
          ["Context window", model.context],
          ["Architecture", model.architecture],
          ["License", model.license],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="detail-columns">
        <div className="detail-editorial">
          <span className="eyebrow">THE DEPLOYMENT PERSPECTIVE</span>
          <h2>Deployment considerations</h2>
          <p className="takeaway">{model.takeaway}</p>
          {model.notes.map((note, i) => (
            <div className="numbered-note" key={note}>
              <span className="mono">0{i + 1}</span>
              <p>{note}</p>
            </div>
          ))}
          <a
            className="source-link"
            href={model.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify against the upstream model card <ArrowUpRight size={15} />
          </a>
        </div>
        <MemoryCalculator model={model} />
      </div>
      <section className="benchmark-status">
        <div className="status-icon">
          <FlaskConical size={26} />
        </div>
        <div>
          <span className="eyebrow">THE MEASURED PART COMES NEXT</span>
          <h2>No invented leaderboards.</h2>
          <p>
            Latency, throughput, and cost per token will appear here after a
            reproducible run. Until then, this page helps you understand the
            model—not predict its performance.
          </p>
        </div>
        <ArrowLink href="/methodology">Read our protocol</ArrowLink>
      </section>
      <section className="faq-section">
        <span className="eyebrow">A FEW USEFUL ANSWERS</span>
        <h2>{model.name} deployment FAQ</h2>
        {faq.map((f) => (
          <details key={f.question}>
            <summary>
              {f.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </section>
      <section className="provider-section">
        <div>
          <span className="eyebrow">WHEN YOU’RE READY TO EXPERIMENT</span>
          <h2>Explore your compute options.</h2>
          <p>
            Check available hardware, quotas, and current pricing with the
            provider. These links are not verified deployments or performance
            recommendations.
          </p>
        </div>
        <div className="provider-links">
          <a
            href="https://aws.amazon.com/ec2/instance-types/accelerated-computing/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AWS EC2 <ArrowUpRight size={18} />
          </a>
          <a
            href="https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Azure <ArrowUpRight size={18} />
          </a>
          <a
            href="https://www.runpod.io/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Runpod <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      {comparisonNotes.some((note) => note.models.includes(slug)) && <section className="comparison-collection"><h2>Compare {model.name}</h2><div className="comparison-note-grid">{comparisonNotes.filter((note) => note.models.includes(slug)).map((note) => <Link href={`/compare/${note.slug}`} key={note.slug}><h3>{note.title}</h3><p>{note.description}</p><span>Read comparison →</span></Link>)}</div></section>}
      {rankings.some((entry) => entry.slugs.includes(slug)) && <section className="model-ranking-links"><h2>Find this model in</h2><div>{rankings.filter((entry) => entry.slugs.includes(slug)).map((entry) => <Link key={entry.slug} href={`/rankings/${entry.slug}`}>{entry.title}<ArrowRight size={14} /></Link>)}</div></section>}
      <section className="related-section">
        <span className="eyebrow">KEEP EXPLORING</span>
        <div className="related-grid">
          {related.map((m) => (
            <Link href={`/models/${m.slug}`} key={m.slug}>
              <ModelMark model={m} />
              <div>
                <span>{m.maker}</span>
                <h3>{m.name}</h3>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: `${model.name}: GPU memory and deployment guide`,
              description: model.description,
              datePublished: reviewed,
              dateModified: reviewed,
              author: { "@type": "Organization", name: "BenchGrid" },
              mainEntityOfPage: `${siteUrl}/models/${slug}`,
              citation: model.source,
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
                  name: "Models",
                  item: `${siteUrl}/models`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: model.name,
                  item: `${siteUrl}/models/${slug}`,
                },
              ],
            },
          ]),
        }}
      />
    </main>
  );
}

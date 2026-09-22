import { Breadcrumb } from "@/components/chrome";
import { ModelDirectory } from "@/components/model-directory";
import { models } from "@/lib/models";
import { pageMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata(
  "Open model directory: deployment specs & GPU requirements",
  "Browse Qwen, MiMo, Gemma, GLM, DeepSeek, Kimi, MiniMax, Mistral, Nemotron, and Llama. Filter current releases and baselines, inspect specifications, and compare models.",
  "/models",
);
export default function ModelsPage() {
  return (
    <main id="main" className="page-width models-page">
      <Breadcrumb items={[{ label: "Models" }]} />
      <div className="page-intro">
        <h1>Model directory</h1>
        <p>Explore {models.length} open-weight models. Compare deployment specs across current releases and established baselines.</p>
      </div>
      <ModelDirectory />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org", "@type": "ItemList", name: "BenchGrid open model directory",
        itemListElement: models.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: `${siteUrl}/models/${m.slug}` })),
      }) }} />
    </main>
  );
}

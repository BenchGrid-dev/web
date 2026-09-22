import { ArrowUpRight } from "lucide-react";
import { Breadcrumb, ArrowLink } from "@/components/chrome";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Methodology & disclosure",
  "How BenchGrid distinguishes publisher specifications, calculated memory estimates, and measured benchmarks. Read our methodology and commercial disclosure.",
  "/methodology",
);
export default function MethodologyPage() {
  return (
    <main id="main" className="page-width methodology-page">
      <Breadcrumb items={[{ label: "Methodology" }]} />
      <div className="page-intro">
        <h1>Methodology & data sources</h1>
        <p>How we source model specifications, calculate memory estimates, and report benchmark results.</p>
      </div>
      <div className="evidence-grid">
        {[
          {
            n: "01",
            title: "Published.",
            text: "Specifications from the model publisher. We link to the original model card and distinguish total parameters from active parameters.",
            tag: "SOURCE-LINKED",
          },
          {
            n: "02",
            title: "Calculated.",
            text: "Weight storage is parameters × bits ÷ 8, in decimal GB. It excludes KV cache, runtime allocations, and quantization metadata.",
            tag: "AN ESTIMATE",
          },
          {
            n: "03",
            title: "Measured.",
            text: "Performance requires a reproducible experiment. No BenchGrid performance runs have been published in this first edition.",
            tag: "NOT YET AVAILABLE",
          },
        ].map((x) => (
          <section key={x.n}>
            <span className="mono">{x.n} / EVIDENCE TYPE</span>
            <h2>{x.title}</h2>
            <p>{x.text}</p>
            <span className="tiny-label">{x.tag}</span>
          </section>
        ))}
      </div>
      <div className="methodology-body">
        <section>
          <h2>What a future benchmark must include.</h2>
          <p>
            Model and tokenizer revisions; exact GPU and instance configuration;
            runtime, CUDA and driver versions; precision; parallelism; context
            and output lengths; arrival rate and concurrency; warmup; cache
            policy; errors; repeat variability; and raw results.
          </p>
          <p>
            We will report latency and throughput separately, with the workload
            and measurement boundary visible. A price-derived cost will be
            labeled as calculated, with its region, pricing basis, and date.
          </p>
          <a
            href="https://docs.vllm.ai/en/latest/benchmarking/cli/"
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            Reference: vLLM benchmark documentation <ArrowUpRight size={15} />
          </a>
        </section>
        <section>
          <h2>A weight estimate is not a GPU recommendation.</h2>
          <p>
            The memory explorer illustrates how bit width changes weight
            storage. It does not establish checkpoint availability, output
            quality, runtime compatibility, or a successful fit. Nominal sizes
            are labeled with ~. MoE calculations use total parameters for a
            fully resident model; offloaded deployments need separate analysis.
          </p>
        </section>
        <section>
          <h2>Independence & commercial links.</h2>
          <p>
            The provider links in this first edition are ordinary links.
            BenchGrid has not connected an affiliate account, receives no
            tracked commissions from these links, and has no sponsored
            placements.
          </p>
          <p>
            If affiliate links or sponsored content are introduced, they will be
            labeled. Payment will not change measurements or turn an untested
            configuration into a recommendation. Results from one cloud will not
            be represented as measurements from another.
          </p>
        </section>
        <section>
          <h2>A living field guide.</h2>
          <p>
            The homepage features six editor-selected Trending models. These
            picks are not a live popularity ranking. The full directory contains
            20 current candidates and six established baselines. New profiles
            keep memory estimates pending until their checkpoint scope is
            reconciled. Sources were reviewed on September 22, 2026.
          </p>
          <ArrowLink href="/models">Explore all models</ArrowLink>
        </section>
      </div>
    </main>
  );
}

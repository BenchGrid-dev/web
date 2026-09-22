import { models, weightGB, formatGB, type Model } from "./models";

export type Ranking = {
  slug: string;
  title: string;
  description: string;
  kind: "calculated" | "specification" | "shortlist";
  label: string;
  question: string;
  scope: string;
  ordering: string;
  metric: string;
  slugs: string[];
  notes: Record<string, string>;
  sections: { title: string; body: string }[];
  guide: string;
  updated: string;
};

export const rankings: Ranking[] = [
  {
    slug: "weight-memory", title: "Smallest weight footprints", kind: "calculated", label: "Calculated ranking",
    description: "Rank six baseline model profiles by calculated 16-bit weight storage, with explicit parameter scope, nominal counts, and serving-memory limitations.",
    question: "How much space do the weights take?",
    scope: "The six baseline profiles with numeric parameter counts in our directory. This is not a ranking of all current models. New profiles with unresolved checkpoint scope are excluded.",
    ordering: "Ascending 16-bit weight storage, in decimal GB. Equal values share a rank. Nominal parameter counts remain approximate.",
    metric: "16-bit weights",
    slugs: ["gemma-3-4b", "llama-3-1-8b", "qwen3-8b", "gemma-3-12b", "qwen3-32b", "mimo-v2-flash"], notes: {},
    sections: [
      { title: "Read this as storage arithmetic", body: "Each value is the profile's parameter count multiplied by two bytes. The ordering is based on those recorded counts, including rounded model sizes where marked. Actual checkpoint files can include different precision, additional modules, and quantization metadata. This calculation does not measure GPU allocations or confirm a supported 16-bit checkpoint." },
      { title: "The smallest entry is not automatically the best fit", body: "Before selecting hardware, add the memory needed for your context length, concurrency, and runtime. Then validate quality and successful request completion. A 24 GB weight estimate can exceed a 24 GB GPU's usable serving budget. This list deliberately makes no 24 GB, 48 GB, or 80 GB fit claims." },
      { title: "Why newer models are missing", body: "The current collection includes models whose total scope needs reconciliation across backbone, embeddings, encoders, and auxiliary heads. They stay outside this arithmetic ranking until that review is complete. The compact-model shortlist includes newer candidates without assigning them unverified memory figures." },
    ], guide: "how-much-vram-do-you-need", updated: "2026-09-22",
  },
  {
    slug: "long-context", title: "Long-context model tiers", kind: "specification", label: "Published specifications",
    description: "Explore open-weight models in published 1M, 256K, and 128K context tiers, with sources and caveats about memory, configuration, and useful context.",
    question: "Which models advertise room for longer inputs?",
    scope: "Selected models with a context tier recorded in our sourced directory. Profiles marked Under review are excluded. Optional context extensions are not promoted into a higher tier.",
    ordering: "Largest published context tier first, then model name within a tier. K/M labels are approximate groups; they do not assert equal exact token limits or equal long-context performance.",
    metric: "Published context",
    slugs: ["mimo-v2-6-flash-rl", "nemotron-3-5-lightning", "deepseek-v4-1-flash", "minimax-m3", "kimi-k3", "qwen3-8-27b", "gemma-4-12b", "qwen3-coder-next", "gemma-4-e4b"],
    notes: {
      "mimo-v2-6-flash-rl": "A large multimodal checkpoint: test memory at your intended input length and concurrency.",
      "nemotron-3-5-lightning": "This profile covers NVFP4 weights; verify the supported runtime and hardware recipe.",
      "deepseek-v4-1-flash": "Separate prompt processing and generation tests for this architecture.",
      "minimax-m3": "Validate the sparse-attention backend as well as the context setting.",
      "kimi-k3": "The large checkpoint requires its own distributed-serving evaluation.",
      "qwen3-8-27b": "Listed at its native 256K tier; the optional extension is a separate configuration.",
      "gemma-4-12b": "Test text, image, and audio workloads independently.",
      "qwen3-coder-next": "Use representative repository context and tool traces, not only synthetic text.",
      "gemma-4-e4b": "The context ceiling is not a promise of on-device memory capacity.",
    },
    sections: [
      { title: "Capacity is not retrieval quality", body: "A supported token limit describes an input envelope. It does not establish that a model reliably uses every part of a document, retrieves the right evidence, or responds within your latency target. A useful evaluation asks answerable questions at different document positions and scores whether the response cites the relevant information." },
      { title: "Compare the same amount of application work", body: "Tokenizers can produce different lengths for the same document. Keep the source documents and requested answers consistent, while recording each model's actual token counts. Measure short, typical, and long inputs separately. Do not infer long-context throughput from a short-prompt run." },
      { title: "Check the exact limit upstream", body: "This table groups publisher labels into approximate context tiers. Native and extended limits, modality processing, and deployment settings may differ. Open the linked model card before setting a server limit, and allow for generated output within the supported sequence budget." },
    ], guide: "kv-cache-context-length-vram", updated: "2026-09-22",
  },
  {
    slug: "compact-models", title: "Compact models to evaluate", kind: "shortlist", label: "Deployment shortlist",
    description: "A compact open-model shortlist spanning Gemma, MiMo, Qwen, and Llama, with checkpoint-size caveats and practical deployment evaluation questions.",
    question: "Where should a smaller deployment experiment start?",
    scope: "Six selected compact or edge-focused profiles: four current candidates and two older baselines. Inclusion reflects the recorded model size or publisher positioning, not a verified single-GPU fit.",
    ordering: "Alphabetical by model name. This is an editorial shortlist, not a quality, latency, or GPU-memory ranking.",
    metric: "Published size",
    slugs: ["gemma-4-e4b", "gemma-4-12b", "mimo-v2-6-distill-qwen-9b", "qwen3-5-9b", "qwen3-8b", "llama-3-1-8b"],
    notes: {
      "gemma-4-e4b": "Edge-focused; effective parameters omit part of the full weight scope.",
      "gemma-4-12b": "A compact unified multimodal candidate; review each input modality separately.",
      "mimo-v2-6-distill-qwen-9b": "The distilled 9B checkpoint, distinct from the large Flash and Pro releases.",
      "qwen3-5-9b": "A compact vision-language candidate for a controlled application test.",
      "qwen3-8b": "An older baseline with a recorded parameter count and weight arithmetic.",
      "llama-3-1-8b": "An established baseline; inspect the checkpoint's access and license terms.",
    },
    sections: [
      { title: "Define compact in terms of the job", body: "A smaller nominal model can be a useful starting point, but the relevant budget includes serving state and the inputs your application accepts. Decide whether the first experiment needs text only, images, or audio. A model outside that modality scope is not a substitute merely because its name contains a smaller number." },
      { title: "Do not equate effective size with total storage", body: "Some model names describe effective parameters or a rounded backbone count. Gemma E4B is an example where the full scope requires additional attention. Our profile notes explain the published boundary; pending memory estimates remain pending here." },
      { title: "Use the older entries as controls", body: "Keep a reproducible baseline while testing newer candidates. Use the same prompt set, quality threshold, and output budget. Only after the checkpoint runs successfully under representative load should it receive a minimum or recommended GPU configuration." },
    ], guide: "4-bit-vs-8-bit-llm-inference", updated: "2026-09-22",
  },
  {
    slug: "coding-agents", title: "Coding & agent model shortlist", kind: "shortlist", label: "Workload shortlist",
    description: "Compare deployment candidates for coding and tool-using agents, with model-card sources, runtime questions, and an application-level evaluation plan.",
    question: "Which candidates belong in a coding-agent test?",
    scope: "Selected profiles whose publisher descriptions cover coding or agent workloads. Model sizes vary substantially; inclusion does not mean equivalent hardware needs or verified tool compatibility.",
    ordering: "Alphabetical by model name. No benchmark score or performance order is assigned.",
    metric: "Architecture",
    slugs: ["qwen3-coder-next", "qwen3-8-27b", "nemotron-3-5-lightning", "mimo-v2-6-flash-rl", "mistral-small-4"],
    notes: {
      "qwen3-coder-next": "Coding-focused; evaluate the actual tool parser and agent scaffold.",
      "qwen3-8-27b": "A dense candidate for a different hardware budget from the large sparse entries.",
      "nemotron-3-5-lightning": "An official quantized agent candidate; validate the NVFP4 deployment path.",
      "mimo-v2-6-flash-rl": "A large sparse checkpoint for testing multi-step tool workflows.",
      "mistral-small-4": "Reasoning and coding candidate; Small is a product name, not a memory guarantee.",
    },
    sections: [
      { title: "Rank completed tasks when measurements arrive", body: "For a coding agent, generating tokens is only one part of the job. Record whether the change passes its tests, whether tool calls are valid, and how many attempts are required. Keep the repository snapshot, agent instructions, tool access, and task budget fixed so a future ranking measures comparable work." },
      { title: "The serving configuration includes the scaffold", body: "Chat templates, tool-call parsing, reasoning settings, and maximum output length affect the behavior an agent sees. Validate one complete tool cycle before a longer evaluation. A successful plain-text chat request does not prove that a checkpoint works with a particular coding harness." },
      { title: "Separate quality from capacity", body: "First reject configurations that cannot complete the target tasks reliably. Then compare end-to-end time and completed tasks within a fixed resource budget. No independent coding scores or deployment winners have been measured by BenchGrid yet; these entries are candidates for that experiment." },
    ], guide: "reading-a-benchmark", updated: "2026-09-22",
  },
  {
    slug: "multimodal-models", title: "Multimodal deployment shortlist", kind: "shortlist", label: "Workload shortlist",
    description: "Explore open-weight multimodal model candidates for documents, images, and audio, with encoder-memory caveats and modality-specific testing guidance.",
    question: "Which models should we test with more than text?",
    scope: "Six current candidates with multimodal or vision-language capabilities recorded in their official profiles. The exact supported inputs differ; the architecture label is not a modality compatibility matrix.",
    ordering: "Alphabetical by model name. Inclusion is based on publisher-described capabilities, not a measured quality score.",
    metric: "Architecture",
    slugs: ["gemma-4-12b", "gemma-4-e4b", "qwen3-8-27b", "mimo-v2-6-flash-rl", "minimax-m3", "mistral-small-4"],
    notes: {
      "gemma-4-12b": "The unified model covers text, image, and audio inputs.",
      "gemma-4-e4b": "Review the extra modality encoders when planning the full checkpoint budget.",
      "qwen3-8-27b": "The language-model parameter count does not include all vision-related scope.",
      "mimo-v2-6-flash-rl": "A large multimodal candidate with additional modules beyond the backbone.",
      "minimax-m3": "Test the intended image or video workload with its supported runtime.",
      "mistral-small-4": "A vision-language MoE; verify the image-processing and reasoning configuration.",
    },
    sections: [
      { title: "Choose an input workload before choosing a winner", body: "A document assistant, a photo question-answering service, and an audio application need different evaluations. Start with one supported modality and define what a correct response looks like. Keep any text-only baseline separate from results that include image or audio processing." },
      { title: "Record preprocessing alongside generation", body: "Image resolution, page count, video sampling, and audio duration change the workload. Capture the processor configuration and actual generated input representation where available. The text context label alone does not describe how much media a deployment can process within its memory budget." },
      { title: "Inspect the entire model package", body: "Encoders, projections, embeddings, and auxiliary modules can sit outside a headline parameter count. Use the source-linked profile notes to identify what still needs review, then measure peak memory for the actual inputs. This shortlist does not assign a minimum GPU or claim that all listed modalities work in every inference engine." },
    ], guide: "kv-cache-context-length-vram", updated: "2026-09-22",
  },
  {
    slug: "moe-models", title: "MoE deployment shortlist", kind: "shortlist", label: "Architecture shortlist",
    description: "Compare open-weight MoE candidates using total and active parameter scope, with clear notes on sparse computation, full weight storage, and distributed serving.",
    question: "What does sparse compute mean for deployment?",
    scope: "Seven selected MoE profiles with total and active parameter figures recorded in the directory. The counts have different publisher boundaries and are not normalized compute or memory measurements.",
    ordering: "Alphabetical by model name. Active-to-total ratios are not used as an efficiency ranking.",
    metric: "Total / active",
    slugs: ["gemma-4-26b-a4b", "nemotron-3-5-lightning", "qwen3-coder-next", "qwen3-8-flash-next", "mistral-small-4", "mimo-v2-6-flash-rl", "minimax-m3"],
    notes: {
      "gemma-4-26b-a4b": "The language backbone and vision encoder have distinct parameter scope.",
      "nemotron-3-5-lightning": "The listed checkpoint uses NVFP4; stored and compute precision can differ.",
      "qwen3-coder-next": "3B active does not turn the full 80B checkpoint into a 3B memory budget.",
      "qwen3-8-flash-next": "Additional n-gram embeddings and the prediction head matter for total storage.",
      "mistral-small-4": "Use the total checkpoint scope, not the Small name or active count, for sizing.",
      "mimo-v2-6-flash-rl": "The backbone count excludes additional multimodal and prediction modules.",
      "minimax-m3": "Sparse attention and expert routing both need compatible runtime support.",
    },
    sections: [
      { title: "A sparse compute count is not a resident weight count", body: "Experts that are unused for one token can still occupy memory in a fully resident deployment. Total and active parameters belong in separate columns. Offloading changes where weights are held and how they are transferred, so it should have its own measured configuration rather than borrowing a fully resident result." },
      { title: "Do not rank efficiency from a ratio", body: "An active-to-total ratio omits architectural work, memory traffic, communication, and runtime implementation. Two models with similar ratios may have very different serving requirements. This page intentionally exposes the source numbers without converting them into a quality or speed score." },
      { title: "Measure the system you plan to rent", body: "For distributed configurations, record GPU count, interconnect, parallelism, precision, and request load. Test whether your latency target holds while the service processes realistic inputs. Until those runs are complete, the table is a deployment planning aid and not a recommendation for a particular instance type." },
    ], guide: "moe-active-vs-total-parameters", updated: "2026-09-22",
  },
];

export function contextTier(model: Model): number {
  if (model.context.startsWith("1M")) return 3;
  if (model.context.startsWith("256K")) return 2;
  if (model.context.startsWith("128K")) return 1;
  return 0;
}
export function rankingModels(ranking: Ranking): Model[] {
  const entries = ranking.slugs.map((slug) => {
    const model = models.find((model) => model.slug === slug);
    if (!model) throw new Error(`Unknown ranking model: ${slug}`);
    if (ranking.kind === "calculated" && model.params === null) throw new Error(`Unreviewed weight count: ${slug}`);
    if (ranking.kind === "specification" && !contextTier(model)) throw new Error(`Unreviewed context tier: ${slug}`);
    return model;
  });
  return entries.sort((a, b) => {
    if (ranking.kind === "calculated") return weightGB(a.params!) - weightGB(b.params!) || a.name.localeCompare(b.name, "en");
    if (ranking.kind === "specification") return contextTier(b) - contextTier(a) || a.name.localeCompare(b.name, "en");
    return a.name.localeCompare(b.name, "en");
  });
}
export function rankingMetric(ranking: Ranking, model: Model): string {
  if (ranking.kind === "calculated") return `${model.size.startsWith("~") ? "≈ " : ""}${formatGB(weightGB(model.params!))} GB`;
  if (ranking.kind === "specification") return model.context;
  if (ranking.slug === "compact-models") return model.size;
  if (ranking.slug === "moe-models") return `${model.size} / ${model.active}`;
  return model.architecture;
}

export type ComparisonNote = {
  slug: string;
  title: string;
  description: string;
  models: [string, string];
  intro: string;
  sections: { title: string; body: string }[];
  guides: string[];
  updated: string;
};
export const comparisonNotes: ComparisonNote[] = [
  {
    slug: "qwen3-8-27b-vs-gemma-4-12b",
    title: "Qwen3.8 27B vs Gemma 4 12B",
    description: "Compare Qwen3.8 27B and Gemma 4 12B deployment specifications, multimodal architecture, context limits, and what remains to be benchmarked.",
    models: ["qwen3-8-27b", "gemma-4-12b"], updated: "2026-09-22",
    intro: "These are two dense multimodal candidates with different checkpoint sizes and input capabilities. This comparison helps define a deployment test; it does not establish a quality or performance winner.",
    sections: [
      { title: "Different sizes, different parameter boundaries", body: "Qwen lists 27B language-model parameters and a vision encoder. Google's Gemma 4 12B card describes an 11.95B unified model supporting text, image, and audio inputs. Comparing the names alone misses that difference in parameter scope. We leave complete weight-memory estimates pending until each checkpoint's included modules are reconciled." },
      { title: "Match the modality before matching the GPU", body: "For a text or document-image workload, build a shared test set and hold the answer budget constant. If audio input is required, validate that path separately instead of extrapolating from a text-only run. Qwen's native context is 262,144 tokens with a separately configured extension; Gemma's card lists a 256K context. Supported limits are not measured capacity at that length." },
      { title: "What the first benchmark should answer", body: "Our proposed experiment starts with short text requests, then adds representative document images and longer inputs. Record peak memory, P95 time to first token, successful throughput, and task accuracy. Compare each model's valid runtime settings rather than assuming the same configuration flags are interchangeable. GPU recommendations remain pending until those tests are run." },
    ], guides: ["kv-cache-context-length-vram", "4-bit-vs-8-bit-llm-inference"],
  },
  {
    slug: "mimo-v2-6-distill-9b-vs-qwen3-5-9b",
    title: "MiMo V2.6 Distill 9B vs Qwen3.5 9B",
    description: "Compare MiMo V2.6 Distill Qwen 9B with Qwen3.5 9B: checkpoint identity, deployment scope, and a fair distillation evaluation plan.",
    models: ["mimo-v2-6-distill-qwen-9b", "qwen3-5-9b"], updated: "2026-09-22",
    intro: "A compact distilled MiMo and a compact Qwen are a useful pair for an application-level evaluation. Their similar nominal size makes them candidates for a controlled test, not proof that their quality, memory, or speed is identical.",
    sections: [
      { title: "Keep this MiMo separate from Flash and Pro", body: "This page concerns XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B. It is a different checkpoint from the much larger MiMo Flash and Pro entries. Before downloading weights or interpreting a result, match the full repository name and revision. A report labeled only MiMo is not sufficient to identify what ran." },
      { title: "Similar names are a starting point, not an equivalence", body: "Both directory entries use a nominal 9B size. Complete checkpoint scope, context settings, and compatible serving configurations still require review here. The comparison therefore shows pending memory estimates. For an initial experiment, choose a context and modality supported by both exact checkpoints, keep the same prompt set, and record any different chat-template requirements." },
      { title: "Evaluate the task before counting tokens", body: "Our suggested comparison uses code tests or objectively scored question sets from the intended application. Set a maximum generation budget and report completion success as well as latency. A model that produces a longer answer may look different under raw tokens per second without completing more useful work. Keep publisher benchmark claims separate from independent measurements, which are not available on this page yet." },
    ], guides: ["reading-a-benchmark", "throughput-vs-latency"],
  },
  {
    slug: "gemma-4-26b-a4b-vs-gemma-4-31b",
    title: "Gemma 4 26B-A4B vs Gemma 4 31B",
    description: "Compare sparse Gemma 4 26B-A4B and dense Gemma 4 31B: total versus active parameters, deployment trade-offs, and a reproducible test plan.",
    models: ["gemma-4-26b-a4b", "gemma-4-31b"], updated: "2026-09-22",
    intro: "This comparison asks whether a sparse or dense Gemma configuration better fits a specific serving workload. Shared family branding does not remove the need to test memory, latency, and quality independently.",
    sections: [
      { title: "A4B does not mean a 4B checkpoint", body: "The 26B-A4B publisher card lists a 25.2B backbone, about 3.8B active parameters, and a vision encoder. The 31B entry is a dense counterpart. Active parameters describe sparse computation rather than all the weights a fully resident deployment holds. Do not use the active count as the GPU weight-memory budget." },
      { title: "Keep the comparison within the same workload", body: "Use the same application prompts, input modalities, precision policy, and answer limits. A shared advertised context range does not guarantee equal memory use at that range. Our proposed test starts at low concurrency, then increases load while checking a predefined latency target and task-quality threshold. Report each configuration's actual runtime and checkpoint revision." },
      { title: "No deployment winner has been measured yet", body: "This page provides a sourced specification comparison. Neither the model names nor the sparse architecture establish which endpoint will be faster or cheaper for your traffic. Minimum GPU configurations, measured throughput, and tail latency will be added only after reproducible runs. Until then, use the pair to scope an experiment rather than select a production capacity number." },
    ], guides: ["moe-active-vs-total-parameters", "multi-gpu-inference-tensor-parallelism"],
  },
  {
    slug: "qwen3-8b-vs-llama-3-1-8b",
    title: "Qwen3 8B vs Llama 3.1 8B",
    description: "Compare Qwen3 8B and Llama 3.1 8B baseline specifications, 4/8/16-bit weight estimates, context configuration, and reproducibility considerations.",
    models: ["qwen3-8b", "llama-3-1-8b"], updated: "2026-09-22",
    intro: "These older 8B-class models remain useful baseline profiles for a deployment experiment. They are not presented as the latest releases. Similar parameter counts make the arithmetic easy to compare, while runtime and workload differences still matter.",
    sections: [
      { title: "An 8B label is not an identical memory footprint", body: "The table uses the parameter counts recorded in each sourced profile. At 16 bits, each billion parameters contributes roughly 2 decimal GB of raw weight storage; at 4 bits it contributes 0.5 GB. These values exclude cache, temporary allocations, and quantization metadata. They are useful for comparing weight-storage scale, not for certifying that a particular GPU will serve the model." },
      { title: "Record the exact context and generation configuration", body: "Read each model card before copying a launch command. Context extensions, chat templates, and reasoning settings can change the experiment. Keep input and output lengths bounded, record sampling settings, and score the completed task. An older baseline can still be informative if its role and configuration are explicit." },
      { title: "Use a baseline to measure progress", body: "Our suggested workflow saves a reproducible run of the baseline, then tests a newer candidate against the same application workload. Keep the baseline result even when the candidate performs better: it gives later changes a reference point. BenchGrid has not run that experiment yet. This page offers specifications and transparent arithmetic, with no claimed performance ranking." },
    ], guides: ["4-bit-vs-8-bit-llm-inference", "reading-a-benchmark"],
  },
];

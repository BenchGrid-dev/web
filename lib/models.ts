import { latestModels } from "./latest-models";
export type Model = {
  slug: string;
  name: string;
  family: string;
  maker: string;
  params: number | null;
  baseline?: boolean;
  size: string;
  active?: string;
  context: string;
  architecture: string;
  license: string;
  tag: string;
  description: string;
  source: string;
  color: string;
  glyph: string;
  takeaway: string;
  notes: string[];
};
const baselineModels: Model[] = [
  {
    slug: "qwen3-8b",
    name: "Qwen3 8B",
    family: "Qwen",
    maker: "Alibaba",
    params: 8.2,
    size: "8.2B",
    context: "32K native",
    architecture: "Dense",
    license: "Apache 2.0",
    tag: "Reasoning",
    color: "violet",
    glyph: "Q",
    description:
      "A compact starting point for reasoning, chat, and your first self-hosted deployment.",
    source: "https://huggingface.co/Qwen/Qwen3-8B",
    takeaway:
      "A useful small-model baseline. Start with a short context and measure the additional latency of thinking mode separately.",
    notes: [
      "The publisher lists 8.2 billion total parameters. Weight estimates here use that count, not the rounded model name.",
      "The native context is 32,768 tokens. The published 131,072-token configuration uses YaRN and needs separate validation.",
      "Thinking and non-thinking requests should be benchmarked separately: the number of generated tokens can change substantially.",
    ],
  },
  {
    slug: "mimo-v2-flash",
    name: "MiMo V2 Flash",
    family: "MiMo",
    maker: "Xiaomi",
    params: 309,
    size: "309B",
    active: "15B",
    context: "256K",
    architecture: "MoE",
    license: "MIT",
    tag: "Agentic",
    color: "orange",
    glyph: "m",
    description:
      "Sparse compute, substantial memory. A closer look at the economics of a large MoE.",
    source: "https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash",
    takeaway:
      "15B active parameters does not mean 15B worth of weights. Size a fully resident deployment for the total parameter count.",
    notes: [
      "The model card reports 309B total parameters and 15B active parameters per token.",
      "The published checkpoint uses FP8. Our bit-width calculator is a theoretical comparison, not a list of validated checkpoint formats.",
      "Hybrid attention and multi-token prediction make runtime support especially important. Use the upstream deployment recipe and validate your exact configuration.",
    ],
  },
  {
    slug: "llama-3-1-8b",
    name: "Llama 3.1 8B",
    family: "Llama",
    maker: "Meta",
    params: 8,
    size: "~8B",
    context: "128K",
    architecture: "Dense",
    license: "Llama 3.1",
    tag: "General purpose",
    color: "blue",
    glyph: "∞",
    description:
      "An established instruction-tuned baseline for a practical deployment comparison.",
    source: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    takeaway:
      "Start with the workload you actually serve. A 128K model context does not mean a small GPU can serve 128K at your target concurrency.",
    notes: [
      "This profile covers the instruction-tuned 8B release, using a rounded parameter count for the memory illustration.",
      "Weights are distributed under the Llama 3.1 Community License. Review the upstream access and usage requirements.",
      "The advertised context limit is a model capability. KV cache, concurrency, and runtime overhead determine the memory needed to use it.",
    ],
  },
  {
    slug: "gemma-3-12b",
    name: "Gemma 3 12B",
    family: "Gemma",
    maker: "Google",
    params: 12,
    size: "~12B",
    context: "128K",
    architecture: "Dense · vision",
    license: "Gemma",
    tag: "Multimodal",
    color: "teal",
    glyph: "✦",
    description:
      "Text and image understanding, with a memory budget that deserves a closer look.",
    source: "https://huggingface.co/google/gemma-3-12b-it",
    takeaway:
      "The nominal 16-bit weights alone approach 24 GB. Leave room for runtime allocations, KV cache, and image processing.",
    notes: [
      "This profile uses the nominal 12B model size for approximate weight arithmetic; it is not a measured checkpoint allocation.",
      "Image inputs add processing and memory requirements. Text-only and multimodal workloads should have separate results.",
      "Access to the upstream weights requires accepting the Gemma terms. Verify runtime support for the instruction-tuned multimodal model.",
    ],
  },
  {
    slug: "qwen3-32b",
    name: "Qwen3 32B",
    family: "Qwen",
    maker: "Alibaba",
    params: 32.8,
    size: "32.8B",
    context: "32K native",
    architecture: "Dense",
    license: "Apache 2.0",
    tag: "Reasoning",
    color: "violet",
    glyph: "Q",
    description:
      "A larger dense reasoning model for exploring precision and memory trade-offs.",
    source: "https://huggingface.co/Qwen/Qwen3-32B",
    takeaway:
      "Weight precision changes the hardware shortlist dramatically. Quality and performance still need to be tested on the chosen checkpoint.",
    notes: [
      "The publisher lists 32.8 billion total parameters; the memory calculator uses that number.",
      "32,768 tokens is the native context. Extending to 131,072 with YaRN changes the configuration being tested.",
      "A lower bit width is not a guaranteed speedup. Available kernels, quantization format, and workload all matter.",
    ],
  },
  {
    slug: "gemma-3-4b",
    name: "Gemma 3 4B",
    family: "Gemma",
    maker: "Google",
    params: 4,
    size: "~4B",
    context: "128K",
    architecture: "Dense · vision",
    license: "Gemma",
    tag: "Multimodal",
    color: "teal",
    glyph: "✦",
    description:
      "A smaller multimodal model to explore when your memory budget comes first.",
    source: "https://huggingface.co/google/gemma-3-4b-it",
    takeaway:
      "A smaller weight footprint leaves more room for serving overhead. It does not establish a particular latency or quality level.",
    notes: [
      "Memory figures are calculated from the nominal 4B model size and exclude all serving overhead.",
      "The instruction-tuned model accepts text and images. Measure the modalities you plan to use.",
      "The 128K context capability still requires appropriate runtime configuration and memory. Review the Gemma license before deployment.",
    ],
  },
];
export const models: Model[] = [
  ...latestModels,
  ...baselineModels.map((model) => ({ ...model, baseline: true })),
];
export const trendingSlugs = [
  "qwen3-8-27b",
  "mimo-v2-6-distill-qwen-9b",
  "gemma-4-12b",
  "qwen3-8-flash-next",
  "mimo-v2-6-flash-rl",
  "glm-5-3-flash",
];
export const trendingModels = trendingSlugs.map((slug) => models.find((m) => m.slug === slug)!);
export const getModel = (slug: string) => models.find((m) => m.slug === slug);
export const weightGB = (params: number, bits = 16) => (params * bits) / 8;
export const formatGB = (n: number) =>
  Number.isInteger(n) ? String(n) : n.toFixed(1);
export const reviewed = "2026-09-22";

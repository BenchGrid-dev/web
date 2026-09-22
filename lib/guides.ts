import { fieldNotes } from "./field-notes";
export type Guide = {
  slug: string; number: string; category: string; title: string; description: string;
  readTime: string; intro: string; published: string; updated: string;
  sections: { title: string; body: string }[];
  sources: { title: string; url: string }[];
  related?: string[];
};
const essentials: Guide[] = [
  {
    slug: "how-much-vram-do-you-need",
    number: "01",
    category: "THE ESSENTIALS",
    title: "How much GPU memory do you actually need?",
    description:
      "A practical guide to model weights, KV cache, and the memory you need beyond the parameter count.",
    published: "2026-09-22", updated: "2026-09-22",
    readTime: "5 min read",
    intro:
      "Parameter count is a useful first clue. It is not a complete GPU shopping list. A serving process needs room for the model, the conversation, and the work happening in between.",
    sections: [
      {
        title: "Start with the weights.",
        body: "A simple lower-bound estimate is total parameters × bytes per parameter. At 16-bit precision, a nominal 8-billion-parameter model stores roughly 16 GB of weights. At 8-bit, the arithmetic gives 8 GB; at 4-bit, 4 GB. These are decimal gigabytes, not GiB, and they do not include quantization scales, extra modules, or runtime allocations.",
      },
      {
        title: "Leave room for the conversation.",
        body: "The KV cache stores attention state for the sequences being served. Its footprint depends on the architecture, cache precision, sequence lengths, and concurrent requests. Increasing context or concurrency can consume the memory that appeared to be spare. Hybrid and sliding-window attention also change the calculation, so one generic percentage is not a reliable fit test.",
      },
      {
        title: "Active parameters are not resident parameters.",
        body: "Mixture-of-experts models activate only a subset of their weights for each token. That reduces some computation; it does not remove the other experts from a fully resident deployment. Use total parameters when estimating model weight storage. Offloading changes the memory and transfer trade-off and needs a separate measurement.",
      },
      {
        title: "A smaller format is a different configuration.",
        body: "An arithmetic 4-bit estimate does not establish that a compatible, accurate, and fast 4-bit checkpoint exists. Verify the quantization format and runtime kernels. Then check the output quality on representative tasks before choosing it solely for its smaller memory footprint.",
      },
      {
        title: "Turn an estimate into a deployment test.",
        body: "Choose a supported checkpoint, set a representative context limit, and start at low concurrency. Record allocated memory and failures, then increase the load while watching latency. Only a successful test of that exact configuration can turn a memory estimate into evidence that the deployment works.",
      },
    ],
    sources: [
      {
        title: "vLLM: optimization and tuning",
        url: "https://docs.vllm.ai/en/latest/configuration/optimization/",
      },
      {
        title: "Qwen3 8B official model card",
        url: "https://huggingface.co/Qwen/Qwen3-8B",
      },
    ],
  },
  {
    slug: "throughput-vs-latency",
    number: "02",
    category: "PERFORMANCE, EXPLAINED",
    title: "Fast for one user. Fast for everyone.",
    description:
      "Understand time to first token, inter-token latency, and system throughput before comparing inference results.",
    published: "2026-09-22", updated: "2026-09-22",
    readTime: "4 min read",
    intro:
      "A server can produce more tokens overall while making each person wait longer. That is why a single tokens-per-second number is rarely enough to choose a deployment.",
    sections: [
      {
        title: "The first token is a separate wait.",
        body: "Time to first token (TTFT) measures the delay from a request until its first output token arrives. It can include network delay, queueing, and prompt processing, depending on the measurement boundary. Always check whether a result was measured at the client or inside the server.",
      },
      {
        title: "Generation speed describes the next part.",
        body: "Inter-token latency describes the spacing between generated tokens. Time per output token is usually an average over generation after the first token; it should not be confused with the tail of the inter-token latency distribution. Averages can hide stalls that a person notices immediately.",
      },
      {
        title: "Throughput belongs to the whole system.",
        body: "System output throughput counts the output tokens generated across all requests per unit time. Increasing concurrent work can improve utilization, but it can also increase queueing and slow individual requests. Keep per-user output speed and aggregate server throughput in separate columns.",
      },
      {
        title: "Compare inside an acceptable experience.",
        body: "Define the latency targets first, then compare the capacity achieved while staying within them. For a conversational workload, that might include P95 TTFT and an output-speed threshold. The right targets depend on the application; a batch pipeline can reasonably choose different constraints.",
      },
      {
        title: "Cost needs the same boundary.",
        body: "Dividing an hourly instance price by measured output throughput gives a test-specific compute cost. It assumes that workload and utilization. Real production cost also includes idle capacity, redundancy, failed requests, storage, and traffic. State whether tokens mean input, output, or a combination.",
      },
    ],
    sources: [
      {
        title: "vLLM benchmark CLI",
        url: "https://docs.vllm.ai/en/latest/benchmarking/cli/",
      },
      {
        title: "Artificial Analysis: AgentPerf methodology",
        url: "https://artificialanalysis.ai/methodology/agentperf",
      },
    ],
  },
  {
    slug: "reading-a-benchmark",
    number: "03",
    category: "BEFORE YOU DEPLOY",
    title: "A good benchmark shows its working.",
    description:
      "A deployment benchmark checklist: model revision, hardware, runtime, request distribution, caching, and reproducibility.",
    published: "2026-09-22", updated: "2026-09-22",
    readTime: "4 min read",
    intro:
      "A performance number becomes useful when you can tell what produced it. Before following a chart to a deployment decision, inspect the experiment behind the number.",
    sections: [
      {
        title: "Know exactly what was running.",
        body: "Look for the model revision, weight precision and quantization format, runtime version, driver, GPU model and count, instance type, and parallelism settings. The same model name on the same GPU family is not enough to identify a reproducible setup.",
      },
      {
        title: "Ask what the requests looked like.",
        body: "Input and output lengths, sampling parameters, concurrency, and arrival rate all affect the result. Fixed-length synthetic prompts are useful for controlled comparisons, but they do not capture a production distribution by themselves. Reasoning output and multi-turn histories can change the load substantially.",
      },
      {
        title: "Check the cache policy.",
        body: "Repeated prompts can reuse prefix state, so later runs may do less work than earlier runs. A realistic shared-prefix workload is valid if it is intentional and labeled. An accidental warm cache should not be presented as an uncached result. Record cache settings and the reset or seeding procedure.",
      },
      {
        title: "Read failures alongside successes.",
        body: "A high throughput number is less helpful if a meaningful fraction of requests failed or exceeded the latency budget. Record attempted and completed requests, errors, timeouts, warmup, measurement duration, and repeat variability. Tail latency needs enough samples to be informative.",
      },
      {
        title: "Look for the raw evidence.",
        body: "A useful report includes the configuration, invocation, machine-readable results, and enough detail to rerun the test. Keep measured performance separate from publisher claims and extrapolated prices. When a result is not available yet, leaving the field empty is more honest than filling in an attractive estimate.",
      },
    ],
    sources: [
      {
        title: "vLLM: reproducible serving benchmarks",
        url: "https://docs.vllm.ai/en/latest/benchmarking/cli/",
      },
      {
        title: "BentoML: systematic inference optimization",
        url: "https://www.bentoml.com/blog/announcing-llm-optimizer",
      },
    ],
  },
];

export const guides: Guide[] = [...essentials, ...fieldNotes];

# BenchGrid first measurement batch

Status: **not run**. No GPU benchmark results are present in this directory.

## Checkpoint preflight

`preflight.py` reads public Hugging Face metadata and configuration at an exact
checkpoint revision. It downloads no weights and creates no cloud resources.

```sh
python3 benchmarks/preflight.py --output benchmarks/manifests/homepage-YYYY-MM-DD.json
```

Snapshots preserve model IDs, revisions, architecture, configured context,
quantization metadata and checkpoint storage size. Stored bytes are not GPU
memory measurements. Safetensors packed tensor counts must not be reported as
logical parameter counts, particularly for MiMo's packed MXFP4 checkpoint.

## Execution order

| Phase | Checkpoint | Hardware candidate, not a validated minimum |
| --- | --- | --- |
| First | XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B | One A100 80GB; BF16, short context |
| First | google/gemma-4-12B-it | Same GPU; BF16, short context |
| First | Qwen/Qwen3.8-27B | Same GPU; BF16, short context |
| Later | Qwen/Qwen3.8-Flash-Next | Multiple GPUs; select after reviewing full checkpoint and runtime support |
| Later | XiaomiMiMo/MiMo-V2.6-Flash-RL | Multiple GPUs; verify mixed FP8/MXFP4 storage support and unpacked runtime footprint |
| Later | zai-org/GLM-5.3-Flash | Hopper or newer NVIDIA GPUs per current vLLM recipe; multiple GPUs |

Use one machine serially for the first three models. Start with a functional
text-only smoke test. A successful run on A100 80GB establishes only that the
recorded configuration works; it does not establish minimum or recommended GPU
requirements. Smaller GPU and quantization tests need separate runs.

## Planned measurement protocol

- Pin model and tokenizer revisions, runtime package versions and container
  digest. Save exact server/client launch arguments, GPU model/count, instance
  SKU, region, driver/CUDA versions and effective model configuration.
- Confirm a meaningful response before synthetic load. Record thinking settings
  and distinguish reasoning tokens from visible answer tokens where available.
- Start with an 8,192-token server limit, no CPU offload, no speculative decoding
  and prefix caching disabled. These are experimental controls, not deployment
  recommendations. Any compatibility change must be recorded per model.
- Text-only synthetic serving workloads: 512 input / 128 output tokens and
  2,048 input / 256 output tokens, concurrency 1 and 8, three repetitions with
  fixed recorded seeds, and 64 requests per repetition. Warm up each workload
  before measuring. Force the output length only for this synthetic test and
  label it clearly; it is not a reasoning-quality evaluation.
- Report successful/failed requests, actual input/output token counts, TTFT,
  time per output token, end-to-end latency and aggregate output tokens/second.
  Report percentiles and variation across repetitions. Preserve client queue
  time separately; do not describe saturation throughput as single-user speed.
- Run the client on the same VM and identify this boundary; these are not
  internet-user latency measurements. Record GPU memory during loading, idle
  serving and load. Runtime-reserved KV memory is not a model's minimum VRAM.
- Save raw benchmark JSON, logs, hardware metadata and per-phase timings.
  Prices, if reported, use the actual region/SKU/rate/date and include download,
  setup and idle time separately. Credits do not make the underlying rate zero.
- Configure a cloud-side deallocation deadline before starting a paid VM;
  budget the first pilot to at most $100 of credits and four allocated hours,
  using whichever limit is tighter after checking the current hourly rate.
  Export results before deallocating and remove only this batch's resources.

Runtime compatibility, exact launch commands and pricing still require a GPU
pilot. Do not publish this plan or publisher metadata as measured results.

## Sources

- [MiMo Distill model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B)
- [Gemma 4 12B model card](https://huggingface.co/google/gemma-4-12B-it)
- [Qwen3.8 27B recipe](https://recipes.vllm.ai/Qwen/Qwen3.8-27B)
- [Qwen3.8 Flash-Next model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [MiMo Flash model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL)
- [GLM 5.3 Flash recipe](https://recipes.vllm.ai/zai-org/GLM-5.3-Flash)
- [vLLM benchmark CLI](https://docs.vllm.ai/en/latest/benchmarking/cli/)
- [Azure NC A100 v4 specifications](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nca100v4-series)

# Official brand artwork

Reviewed 2026-09-22. Original artwork is stored in `public/brands/`; exact asset URLs are recorded in `brand-asset-urls.json`. Logos identify the model publisher in an independent editorial directory; they do not indicate sponsorship or endorsement.

| Model family | Official source | Asset / usage notes |
| --- | --- | --- |
| Qwen | https://huggingface.co/Qwen | Publisher's organization avatar; original colors and embedded background. No separate public visual guideline located. |
| MiMo | https://github.com/XiaomiMiMo/MiMo | Official repository's Xiaomi MiMo wordmark, unchanged. No separate public visual guideline located. |
| Gemma | https://deepmind.google/models/gemma/ | Official Gemma light-background SVG; model-family artwork rather than the Google corporate G. General Google guidance: https://about.google/brand-resource-center/guidance/ |
| GLM / Z.ai | https://huggingface.co/zai-org | Official publisher's organization avatar. No separate public visual guideline located. |
| DeepSeek | https://huggingface.co/deepseek-ai | Official publisher's organization avatar. No separate public visual guideline located. |
| Nemotron / NVIDIA | https://www.nvidia.com/en-gb/about-nvidia/legal-info/logo-brand-usage/ | Original inline two-color logo including eye and wordmark. Keep both together, preserve color/proportions and clearspace. |
| Mistral | https://mistral.ai/brand/ | Original inline gradient icon from the current brand page. Prefer gradient; no recoloring, stretching, colored surround, or decorative frame. The separate CDN download was unavailable; the official site's SVG is used directly. |
| MiniMax | https://www.minimax.io/brand-vi | Original horizontal gradient-symbol + black-wordmark asset used by the official site. Preserve gradients, composition and proportions. |
| Kimi | https://moonshotai.github.io/Branding-Guide/ | Official K-only light-background SVG, a published small-space identity variant. Current brand portal: https://www.kimi.com/resources/kimi-brand |
| Llama / Meta | https://huggingface.co/meta-llama | Publisher's official Meta-symbol avatar; retain artwork and additional surrounding clearspace. Corporate guidance: https://www.meta.com/brand/resources/meta/company-brand/ |

Implementation: one shared ModelMark renders the assets across the homepage, catalog, detail pages, related-model links, and comparisons. Wide wordmarks receive wider slots instead of cropping or splitting the logo. No CSS recoloring, filters, or masks are used. BenchGrid's own mark is unchanged.

These source links document provenance, not a commercial trademark license or an approval from the publishers. Brand rules and permission requirements remain those of the respective rights holders; this change is for the local prototype requested by the user.

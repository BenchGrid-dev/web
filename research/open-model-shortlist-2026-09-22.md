# BenchGrid 开放权重模型候选清单

查证日期：2026-09-22。范围：可下载权重的通用、推理、编码与多模态理解模型；不含仅 API 模型及图像/视频生成模型。未修改网站目录。

这是一份策划候选清单，不是实测排行榜。优先级是 BenchGrid 编辑建议，不代表搜索量或转化率已验证。官方 HF 仓库的 Updated 时间不等于模型发布日期，未核实的发布日期不填。

参数采用发布方模型卡口径；模型名称标称、语言模型主干、视觉编码器、MTP、embedding 与 HF 文件统计可能不同。以下数字不能直接当作最低显存配置。许可证名称只作索引，不代表所有模型均满足严格开源定义或无条件商用。

## 优先收录与较适合起步测试

| 模型（官方仓库） | 参数口径 | 许可证/核对状态 | BenchGrid 选题建议 |
|---|---|---|---|
| [MiMo-V2.6-Distill-Qwen-9B](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B) | 9B 标称 | MIT | MiMo 新版本中的小模型入口，与 Qwen 9B 对照 |
| [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) | 9B 标称 | Apache 2.0 | 新于原目录 Qwen3 8B；保留紧凑模型档位，不称整个 Qwen 家族最新 |
| [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | 27B 语言模型，另有视觉编码器 | Apache 2.0 | 中型模型量化、显存、上下文对比 |
| [Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) | 35B 总 / 3B 激活，语言模型口径 | 上线前再次核对仓库 LICENSE | 较小 MoE 与 dense 的部署差异；不是整个家族最新 |
| [Gemma 4 12B IT](https://huggingface.co/google/gemma-4-12B-it) | 11.95B；标称 12B Unified | Apache 2.0 | 替换 Gemma 3 12B 的主推位置，测试统一多模态模型 |
| [Gemma 4 26B-A4B IT](https://huggingface.co/google/gemma-4-26B-A4B-it) | 主干 25.2B / 3.8B 激活；另有约 550M 视觉编码器 | Apache 2.0 | 与 Gemma 4 31B 比较性能/内存；卡片可显示官方标称 26B-A4B |
| [Gemma 4 31B IT](https://huggingface.co/google/gemma-4-31B-it) | 主干 30.7B，另有约 550M 视觉编码器 | Apache 2.0（家族模型卡） | 中型 dense 参照 |
| [Gemma 4 E4B IT](https://huggingface.co/google/gemma-4-E4B-it) | 4.5B effective，含 embedding 约 8B，另有模态编码器 | Apache 2.0（家族模型卡） | 端侧部署；不能按普通 4B 模型估算全部权重 |
| [Nemotron 3.5 Lightning 30B-A3B NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4) | 30B 总 / 3B 激活 | OpenMDW 1.1 | 官方量化版本、不同 GPU 架构兼容路径；官方发布日期 2026-08-11 |
| [Qwen3-Coder-Next](https://huggingface.co/Qwen/Qwen3-Coder-Next) | 80B 总 / 3B 激活 | Apache 2.0 | 编码 Agent 部署专题；小激活量不代表小权重内存 |
| [Mistral Small 4 119B 2603](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603) | 119B 总 / 6.5B 激活 | Apache 2.0 | 欧洲模型家族、多模态与推理模式；名称 Small 不等于小模型 |

## 新一代大型模型：先收录资料，再按预算安排实测

| 模型（官方仓库） | 参数口径 | 许可证 | BenchGrid 选题建议 |
|---|---|---|---|
| [Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) | 125B 主干 / 6B 激活，另有 51B n-gram embedding + 4B MTP | Qwen Community 1.0 | 内存拆分、offload 与长上下文成本 |
| [MiMo-V2.6-Flash-RL](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL) | 309B 总 / 15B 激活（主干口径），另有多模态模块 | MIT | 取代原 MiMo V2 Flash 主推位置；官方支持 1M 上下文 |
| [GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) | 320B 总 / 18B 激活 | MIT | 新多模态 GLM，量化、多卡部署 |
| [DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) | 552B 主干 + 196B Engram 等；prefill 8B / decode 16B 激活 | MIT | KV cache 与不同推理阶段的成本；不能用单一 active 参数表示全部行为 |
| [MiMo-V2.6-Pro-RL](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL) | 1.02T 总 / 42B 激活（主干口径） | MIT | 大规模部署资料页，实测后置 |
| [MiniMax-M3](https://huggingface.co/MiniMaxAI/MiniMax-M3) | 约 428B 总 / 23B 激活 | MiniMax Community | 多模态、百万上下文、稀疏注意力 |
| [Kimi-K3](https://huggingface.co/moonshotai/Kimi-K3) | 2.8T 总 / 104B 激活 | Kimi K3 License | 旗舰模型资料、托管与自部署对比；实测后置 |
| [GLM-5.3](https://huggingface.co/zai-org/GLM-5.3) | 大型 MoE；HF 展示约 753B，正式录入前核对架构统计口径 | GLM-5.3 License | 旗舰编码模型；不要沿用 Flash 的 MIT 标签 |
| [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) | 标称 2.4T 总 / 95B 激活 | Qwen3.8-Max License | 大规模部署资料；不要沿用 27B 的 Apache 标签 |

## 首页建议

初期精选 12 款：MiMo V2.6 Distill Qwen 9B、Qwen3.5 9B、Qwen3.8 27B、Qwen3.6 35B-A3B、Gemma 4 12B、Gemma 4 26B-A4B、Gemma 4 31B、Nemotron 3.5 Lightning、Qwen3-Coder-Next、Qwen3.8-Flash-Next、MiMo V2.6 Flash、GLM 5.3 Flash。

第一轮 GPU 实测优先讨论其中的 9B/12B/27B 与较小 MoE；具体实例和运行配置需要按框架、量化版本、上下文、并发与 GPU 配额确定。上架资料页与实际跑 benchmark 是两个不同优先级。

旧模型保留独立 URL，移到 Baselines，避免失去代际对比入口。Llama 3.1 8B 可作为老基线。Meta 当前官方可下载重点是 [Llama 4 Scout / Maverick](https://ai.meta.com/resources/models-and-libraries/llama-downloads/)，但它们属于 2025 年发布，不应包装成 2026 年新一批。

[Gemma 官方发布记录](https://ai.google.dev/gemma/docs/releases) 将 Gemma 4 12B Unified 的发布日期列为 2026-06-03；其他 Gemma 4 档位的初始发布日期与模型卡更新日期应分开存储。

## 网站录入前要补齐的字段

- 精确 model ID / revision、官方发布日（有证据才填）、数据复核日。
- 模型总参数、主干参数、激活参数、额外模块分别保存；不要从量化后 HF 自动统计反推架构参数。
- checkpoint 精度、原生/扩展上下文、模态、许可证名称和 LICENSE 链接。
- 官方部署文档与框架版本；Minimum / Recommended 继续保留待测试状态。
- 后续 SEO 可测试的题目：模型名 + VRAM requirements / minimum GPU / recommended GPU / vLLM / AWS / Azure；这只是选题假设，尚未验证搜索量。

"""Snapshot public model metadata without downloading weights or creating cloud resources."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
from urllib.request import urlopen


REPOS = [
    "XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",
    "google/gemma-4-12B-it",
    "Qwen/Qwen3.8-27B",
    "Qwen/Qwen3.8-Flash-Next",
    "XiaomiMiMo/MiMo-V2.6-Flash-RL",
    "zai-org/GLM-5.3-Flash",
]


def read_json(url):
    with urlopen(url, timeout=60) as response:
        return json.load(response)


def inspect(repo):
    info = read_json(f"https://huggingface.co/api/models/{repo}?blobs=true")
    revision = info["sha"]
    base = f"https://huggingface.co/{repo}/resolve/{revision}"
    config = read_json(f"{base}/config.json")
    text_config = config.get("text_config", config)
    filenames = {item["rfilename"] for item in info.get("siblings", [])}
    index = read_json(f"{base}/model.safetensors.index.json") if "model.safetensors.index.json" in filenames else {}
    weight_files = [item for item in info.get("siblings", []) if item["rfilename"].endswith(".safetensors") and "/" not in item["rfilename"]]
    file_bytes = sum(item["size"] for item in weight_files) if weight_files and all("size" in item for item in weight_files) else None
    quantization = config.get("quantization_config") or text_config.get("quantization_config") or {}
    return {
        "repo": repo,
        "revision": revision,
        "source": f"https://huggingface.co/{repo}/tree/{revision}",
        "gated": info.get("gated"),
        "architectures": config.get("architectures"),
        "model_type": config.get("model_type"),
        "configured_dtype": config.get("dtype", config.get("torch_dtype"))
        or text_config.get("dtype", text_config.get("torch_dtype")),
        "configured_context_tokens": text_config.get("max_position_embeddings"),
        "quantization": {
            key: quantization[key]
            for key in ["quant_method", "store_dtype", "fmt", "activation_scheme", "weight_block_size", "mxfp4_block_size"]
            if key in quantization
        },
        "tensor_metadata": info.get("safetensors"),
        "checkpoint_index_total_bytes": index.get("metadata", {}).get("total_size"),
        "root_safetensors_file_bytes": file_bytes,
        "checkpoint_shards": len(set(index.get("weight_map", {}).values())) if index else len(weight_files),
        "status": "not_run",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error("Output already exists; use a new filename to preserve earlier snapshots.")
    with ThreadPoolExecutor(max_workers=6) as pool:
        models = list(pool.map(inspect, REPOS))
    snapshot = {
        "schema_version": 1,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "evidence_type": "publisher_metadata_not_benchmark",
        "warning": "Checkpoint bytes are storage metadata, not measured VRAM. Packed tensor counts are not logical model parameter counts.",
        "models": models,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("x") as output:
        json.dump(snapshot, output, indent=2)
        output.write("\n")
    for model in models:
        size = model["root_safetensors_file_bytes"] or model["checkpoint_index_total_bytes"]
        size_label = f"{size / 1024**3:.2f} GiB stored" if size is not None else "size unknown"
        print(f"{model['repo']}: {model['revision'][:12]}, {size_label}, not run")


if __name__ == "__main__":
    main()

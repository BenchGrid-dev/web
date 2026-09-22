"use client";
import { useState } from "react";
import { ArrowUpRight, Cpu } from "lucide-react";
import Link from "next/link";
import { models, weightGB, formatGB } from "@/lib/models";
export function MemorySnapshot() {
  const [bits, setBits] = useState(16);
  const chartModels = ["gemma-3-4b", "qwen3-8b", "gemma-3-12b", "qwen3-32b"].map((slug) => models.find((m) => m.slug === slug)!);
  return (
    <div className="memory-snapshot">
      <div className="snapshot-head">
        <span className="eyebrow">
          <Cpu size={14} /> BASELINE MEMORY
        </span>
        <span className="tiny-label">ESTIMATE</span>
      </div>
      <div className="snapshot-heading">
        <h2>Compare weight memory</h2>
        <div className="precision-tabs" aria-label="Weight precision">
          {[16, 8, 4].map((n) => (
            <button
              key={n}
              onClick={() => setBits(n)}
              aria-pressed={bits === n}
            >
              {n}-bit
            </button>
          ))}
        </div>
      </div>
      <div className="memory-chart">
        {chartModels.map((m) => (
          <div className="chart-row" key={m.slug}>
            <div className="chart-label">
              <span>{m.name}</span>
              <span className="mono">
                {formatGB(weightGB(m.params!, bits))} <small>GB</small>
              </span>
            </div>
            <div className="bar-track">
              <div
                className={`memory-bar ${m.color}`}
                style={{ width: `${(weightGB(m.params!, bits) / 65.6) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="snapshot-foot">
        <span>Weights only · excludes KV cache & overhead</span>
        <Link href="/compare?models=qwen3-8b,gemma-3-12b,qwen3-32b" aria-label="Compare model memory">
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </div>
  );
}

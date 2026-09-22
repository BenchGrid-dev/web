"use client";
import { useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Model, formatGB, weightGB } from "@/lib/models";
export function MemoryCalculator({ model }: { model: Model }) {
  const [bits, setBits] = useState(16);
  const [capacity, setCapacity] = useState(24);
  if (model.params === null) {
    return <section className="calculator pending-calculator">
      <div className="calculator-title"><span className="eyebrow">DEPLOYMENT CONFIGURATION</span><span className="tiny-label">PENDING</span></div>
      <h2>GPU requirements</h2>
      <dl className="card-configs">
        <div className="config-option"><dt>Minimum</dt><dd><span className="config-placeholder">—</span><small>GPU / VRAM · pending</small></dd></div>
        <div className="config-option recommended"><dt>Recommended</dt><dd><span className="config-placeholder">—</span><small>GPU / VRAM · pending</small></dd></div>
      </dl>
      <p className="calculator-note">Memory estimates and tested configurations will appear here after checkpoint review and deployment testing.</p>
    </section>;
  }
  const weights = weightGB(model.params, bits);
  const percent = Math.min(100, (weights / capacity) * 100);
  return (
    <section className="calculator">
      <div className="calculator-title">
        <span className="eyebrow">MEMORY EXPLORER</span>
        <span className="tiny-label">CALCULATED · NOT BENCHMARKED</span>
      </div>
      <h2>
        Give your model
        <br />
        <span className="serif">some breathing room.</span>
      </h2>
      <div className="calculator-controls">
        <label>
          Weight precision
          <select
            value={bits}
            onChange={(e) => setBits(Number(e.target.value))}
          >
            <option value="16">16-bit / 2 bytes</option>
            <option value="8">8-bit / 1 byte</option>
            <option value="4">4-bit / 0.5 bytes</option>
          </select>
        </label>
        <label>
          Memory budget
          <select
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          >
            {[16, 24, 48, 80, 160, 320, 640, 1280].map((c) => (
              <option key={c} value={c}>
                {c} GB total
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="memory-total">
        <strong>
          {formatGB(weights)}
          <span> GB</span>
        </strong>
        <span>estimated weight storage</span>
      </div>
      <div className="budget-track">
        <div
          style={{ width: `${percent}%` }}
          className={weights >= capacity ? "over-budget" : ""}
        />
      </div>
      <div className="budget-labels">
        <span>
          {model.size} × {bits / 8} bytes
        </span>
        <span>{capacity} GB budget</span>
      </div>
      <div
        className={`budget-result ${weights >= capacity ? "over" : ""}`}
        aria-live="polite"
      >
        <Info size={17} />
        <div>
          <strong>
            {weights >= capacity
              ? "No room for serving overhead"
              : `${formatGB(capacity - weights)} GB left before overhead`}
          </strong>
          <p>
            {weights >= capacity
              ? "Weights meet or exceed this budget. Consider more memory or a supported lower-precision checkpoint."
              : "This is not a fit guarantee. KV cache, activations, quantization metadata, and the runtime still need memory."}
          </p>
        </div>
      </div>
      <p className="calculator-note">
        Decimal GB; nominal parameter counts where marked ~. Bit widths
        illustrate weight storage, not validated quantizations.{" "}
        <Link href="/guides/how-much-vram-do-you-need">
          Understand the estimate <ArrowUpRight size={12} />
        </Link>
      </p>
    </section>
  );
}

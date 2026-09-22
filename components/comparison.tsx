"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Link2, Check, Info } from "lucide-react";
import { models, formatGB, weightGB } from "@/lib/models";
import { ModelMark } from "./model-directory";
export function Comparison({
  initial,
  initialBits = 16,
  fixedModels = false,
}: {
  initial: string[];
  initialBits?: number;
  fixedModels?: boolean;
}) {
  const [selected, setSelected] = useState(initial);
  const [bits, setBits] = useState(initialBits);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const picked = selected.map((slug) => models.find((m) => m.slug === slug)!);
  function change(i: number, value: string) {
    const next = selected.map((s, idx) => (idx === i ? value : s));
    setSelected(next);
    setCopied(false);
    window.history.replaceState(
      null,
      "",
      `/compare?models=${next.join(",")}&bits=${bits}`,
    );
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/compare?models=${selected.join(",")}&bits=${bits}`,
      );
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <>
      <div className="comparison-toolbar">
        <div className="comparison-precision">
          <span>Weight precision</span>
          <div className="precision-tabs">
            {[16, 8, 4].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setBits(n);
                  setCopied(false);
                  if (!fixedModels) window.history.replaceState(
                    null,
                    "",
                    `/compare?models=${selected.join(",")}&bits=${n}`,
                  );
                }}
                aria-pressed={bits === n}
              >
                {n}-bit
              </button>
            ))}
          </div>
        </div>
        <button className="button outline" onClick={share}>
          {copied ? <Check size={15} /> : <Link2 size={15} />}{" "}
          {copied ? "Link copied" : "Copy comparison link"}
        </button>
      </div>
      {copyError && (
        <p role="status">
          Copy the current URL from your address bar to share this comparison.
        </p>
      )}
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <caption className="sr-only">
            Model specifications and calculated weight memory comparison
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="eyebrow">SIDE BY SIDE</span>
                <span className="comparison-label">
                  Same questions.
                  <br />
                  Different models.
                </span>
              </th>
              {picked.map((m, i) => (
                <th scope="col" key={i}>
                  {!fixedModels && <><label className="sr-only" htmlFor={`model-${i}`}>
                    Model {i + 1}
                  </label>
                  <select
                    id={`model-${i}`}
                    value={m.slug}
                    onChange={(e) => change(i, e.target.value)}
                  >
                    {models.map((option) => (
                      <option
                        key={option.slug}
                        value={option.slug}
                        disabled={
                          selected.includes(option.slug) &&
                          option.slug !== m.slug
                        }
                      >
                        {option.name}
                      </option>
                    ))}
                  </select></>}
                  <div className="compare-model-heading">
                    <ModelMark model={m} />
                    <div>
                      <span>{m.maker}</span>
                      <Link href={`/models/${m.slug}`}>
                        {m.name} <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="memory-comparison">
              <th scope="row">
                Weight memory estimate
                <small>{bits}-bit · weights only · decimal GB</small>
              </th>
              {picked.map((m, i) => (
                <td key={i}>
                  {m.params === null ? <span className="pending-estimate">Pending review</span> : <>
                  <strong>
                    {formatGB(weightGB(m.params, bits))}
                    <small> GB</small>
                  </strong>
                  <div className="comparison-bar">
                    <span
                      style={{
                        width: `${(weightGB(m.params, bits) / Math.max(...picked.map((p) => p.params === null ? 0 : weightGB(p.params, bits)))) * 100}%`,
                      }}
                    />
                  </div>
                  </>}
                </td>
              ))}
            </tr>
            {[
              ["Parameters", ...picked.map((m) => m.size)],
              ["Active parameters", ...picked.map((m) => m.active || (m.architecture.includes("MoE") ? "See model card" : m.size))],
              ["Context window", ...picked.map((m) => m.context)],
              ["Architecture", ...picked.map((m) => m.architecture)],
              ["License", ...picked.map((m) => m.license)],
              [
                "BenchGrid performance test",
                ...picked.map(() => "Not yet measured"),
              ],
            ].map(([label, ...values]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {values.map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Deployment perspective</th>
              {picked.map((m, i) => (
                <td className="comparison-takeaway" key={i}>
                  {m.takeaway}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Primary source</th>
              {picked.map((m, i) => (
                <td key={i}>
                  <a href={m.source} target="_blank" rel="noopener noreferrer">
                    Model card <ArrowUpRight size={13} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="comparison-disclaimer">
        <Info size={18} />
        <p>
          Lower weight memory does not mean better quality or faster inference.
          These calculations exclude serving overhead and do not confirm a
          working quantized checkpoint.{" "}
          <Link href="/methodology">Read the methodology.</Link>
        </p>
      </div>
    </>
  );
}

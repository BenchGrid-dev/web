"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Plus, Check, ArrowRight, X } from "lucide-react";
import { models, trendingModels, type Model, formatGB, weightGB } from "@/lib/models";
import { modelBrands } from "@/lib/brands";
export function ModelMark({ model }: { model: Model }) {
  const brand = modelBrands[model.family];
  if (!brand) return null;
  return (
    <span className={`model-mark${brand.layout ? ` model-mark--${brand.layout}` : ""}`} aria-hidden="true">
      <img src={brand.src} alt="" width={brand.layout === "wide" ? 108 : 36} height={36} />
    </span>
  );
}
export function ModelDirectory({ variant = "catalog" }: { variant?: "catalog" | "trending" }) {
  const isTrending = variant === "trending";
  const entries = isTrending ? trendingModels : models;
  const families = ["All models", ...new Set(models.map((m) => m.family))];
  const [family, setFamily] = useState("All models");
  const [scope, setScope] = useState("all");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const filtered = entries.filter(
    (m) =>
      (scope === "all" || (scope === "baseline" ? m.baseline : !m.baseline)) &&
      (family === "All models" || m.family === family) &&
      `${m.name} ${m.maker} ${m.tag}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function toggle(slug: string) {
    setSelection((s) =>
      s.includes(slug)
        ? s.filter((x) => x !== slug)
        : s.length < 3
          ? [...s, slug]
          : s,
    );
  }
  return (
    <section id="models" className={`directory-section ${isTrending ? "trending-directory" : "full-directory"}`}>
      <div className="section-heading">
        <div>
          <h2>{isTrending ? "Trending models" : "All models"} <span className="directory-count">{isTrending ? entries.length : filtered.length}</span></h2>
          {isTrending && <p className="trending-caption">Recent releases, picked by BenchGrid.</p>}
        </div>
        {isTrending ? <Link className="browse-models-link" href="/models">View all {models.length} models <ArrowRight size={16} /></Link> : <span className="section-caption">Select up to 3 models to compare</span>}
      </div>
      {!isTrending && <div className="directory-toolbar">
        <div className="family-tabs" aria-label="Filter by model family">
          {families.map((f) => (
            <button
              key={f}
              aria-pressed={family === f}
              onClick={() => setFamily(f)}
            >
              {f}
              {f === "All models" && <span>{models.length}</span>}
            </button>
          ))}
        </div>
        <label className="catalog-scope">Collection
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">All releases</option>
            <option value="current">Current collection</option>
            <option value="baseline">Baselines</option>
          </select>
        </label>
        <label className="search-input">
          <Search size={16} />
          <span className="sr-only">Search models</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a model…"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </label>
      </div>}
      <div className="model-grid" aria-live="polite">
        {filtered.map((m) => (
          <article className="model-card" key={m.slug}>
            <div className="card-top">
              <ModelMark model={m} />
              <span className="model-tag">{m.baseline ? "Baseline" : m.tag}</span>
            </div>
            <div className="model-maker">
              {m.maker} <span> / {m.architecture}</span>
            </div>
            <h3>
              <Link href={`/models/${m.slug}`}>
                {m.name}
                <ArrowUpRight size={20} />
              </Link>
            </h3>
            <p className="model-description">{m.description}</p>
            <dl className="card-specs">
              <div>
                <dt>Parameters</dt>
                <dd>
                  {m.size}
                  {m.active && <small> / {m.active} active</small>}
                </dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{m.context}</dd>
              </div>
            </dl>
            <dl className="card-configs" aria-label="Deployment configuration placeholders">
              <div className="config-option">
                <dt>Minimum</dt>
                <dd>
                  <span className="config-placeholder">—</span>
                  <small>GPU / VRAM · pending</small>
                </dd>
              </div>
              <div className="config-option recommended">
                <dt>Recommended</dt>
                <dd>
                  <span className="config-placeholder">—</span>
                  <small>GPU / VRAM · pending</small>
                </dd>
              </div>
            </dl>
            <div className="card-memory">
              <span>{m.params === null ? "Weight memory estimate" : "16-bit weight estimate"}</span>
              <span>
                {m.params === null ? <small>Pending</small> : <>{formatGB(weightGB(m.params))} <small>GB</small></>}
              </span>
            </div>
            <div className="card-bottom">
              <Link href={`/models/${m.slug}`}>
                View specs <ArrowRight size={15} />
              </Link>
              <button
                className={selection.includes(m.slug) ? "selected" : ""}
                disabled={!selection.includes(m.slug) && selection.length >= 3}
                onClick={() => toggle(m.slug)}
                aria-label={`${selection.includes(m.slug) ? "Remove" : "Add"} ${m.name} ${selection.includes(m.slug) ? "from" : "to"} comparison`}
                aria-pressed={selection.includes(m.slug)}
              >
                {selection.includes(m.slug) ? (
                  <Check size={15} />
                ) : (
                  <Plus size={15} />
                )}{" "}
                Compare
              </button>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={26} />
          <h3>No models found</h3>
          <p>Try a model family or a shorter search.</p>
          <button
            className="button dark"
            onClick={() => {
              setQuery("");
              setFamily("All models");
              setScope("all");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <p className="directory-note">
        Specifications from official model cards. Memory figures are calculated
        estimates, not measured VRAM.{" "}
        <Link href="/methodology">
          How to read the data <ArrowUpRight size={13} />
        </Link>
      </p>
      {selection.length > 0 && (
        <div className="compare-dock">
          <span>
            <strong>{selection.length}</strong> of 3 models selected
          </span>
          <button className="dock-clear" onClick={() => setSelection([])}>
            Clear
          </button>
          <Link
            className="button lime"
            href={`/compare?models=${selection.join(",")}`}
          >
            Compare models <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}

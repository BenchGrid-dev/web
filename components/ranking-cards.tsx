import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { rankingModels, type Ranking } from "@/lib/rankings";

export function RankingCards({ entries }: { entries: Ranking[] }) {
  return <div className="ranking-card-grid">{entries.map((entry) => {
    const models = rankingModels(entry);
    return <Link href={`/rankings/${entry.slug}`} className="ranking-card" key={entry.slug}>
      <div className="ranking-card-top"><span className={`ranking-label ranking-label--${entry.kind}`}>{entry.label}</span></div>
      <h3>{entry.title}</h3><p>{entry.question}</p>
      <div className="ranking-card-preview"><span>INCLUDES</span>{models.slice(0, 3).map((model) => <span key={model.slug}>{model.name}</span>)}</div>
      <div className="ranking-card-bottom"><span>{models.length} models · {entry.kind === "shortlist" ? "Unranked" : entry.kind === "calculated" ? "Weights only" : "Context tiers"}</span><ArrowRight size={16} /></div>
    </Link>;
  })}</div>;
}

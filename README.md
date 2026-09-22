# BenchGrid

A Next.js site for an independent open-model deployment directory. Built with the App Router, TypeScript, local DM Sans fonts, and Lucide icons.

## Run

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. `npm run build` creates the production build; `npm start` serves it locally. `npm run typecheck` checks TypeScript.

## Included

- Six curated Trending picks on the homepage, with a separate `/models` directory containing 20 current candidates and six baselines. Trending is an editorial selection, not a live popularity ranking.
- Search, dynamic family filters, current/baseline filtering, selection of up to three models, and shareable comparison URLs.
- Interactive 4/8/16-bit weight-memory estimates and memory-budget exploration.
- A Rankings hub with six source-linked lists: calculated weight storage, published context tiers, and compact / coding / multimodal / MoE shortlists. Performance and GPU-fit rankings remain pending real tests.
- Eight original deployment field notes and four curated comparison pages and a methodology / commercial disclosure page.
- Static model and guide pages, per-route metadata and canonicals, Open Graph / Twitter text metadata, JSON-LD, sitemap, robots, semantic HTML, and a custom 404.
- An optional read-only WebMCP model-comparison tool on browsers that expose `document.modelContext`.

## Data boundaries

No GPU benchmarks have been run. There are no synthetic latency, throughput, or cost-per-token results. Published specifications come from linked official model cards; memory figures are theoretical weight storage in decimal GB and exclude serving overhead. `~` marks nominal model sizes. MoE storage uses total, not active, parameters.

New research profiles use `params: null` until checkpoint parameter scope is reconciled. Their cards, calculators, comparisons, and WebMCP responses show a pending status rather than a numeric weight estimate. Minimum and recommended GPU configurations remain placeholders. `+` on a size indicates additional modules; detail pages explain each model's scope.

The provider links are normal outbound links, not affiliate links. There is no payment processing, tracking service, account system, or email collection. Public deployment is managed by the repository owner.

## Production deployment and indexing

The canonical origin defaults to `https://benchgrid.dev`. Set `NEXT_PUBLIC_SITE_URL=https://benchgrid.dev` explicitly in the deployment environment if desired. Install with `npm ci`, build with `npm run build`, and run with `npm start` (or use your host's Next.js integration). A container/reverse-proxy host can use `npm start -- --hostname 0.0.0.0`. Use Node.js 22 LTS.

Production builds enable indexing by default. Local development and Vercel preview builds emit `noindex, nofollow` and disallow crawling. Set `SITE_INDEXING=false` **at build time** for other staging hosts. Ensure production does not inherit that staging override, then rebuild. See `.env.example`.

`/compare` and the four curated `/compare/[slug]` pages are indexable. Custom `/compare?models=...&bits=...` views remain shareable but emit `noindex` and canonicalize to the comparison hub. Only curated, canonical paths appear in the sitemap; arbitrary model combinations are not generated as landing pages.

After deploying:

1. Attach `benchgrid.dev`, enable HTTPS, and redirect alternate hostnames to it.
2. Confirm `/robots.txt` allows crawling and references `https://benchgrid.dev/sitemap.xml`. Check page source for the production canonical and `index, follow` robots metadata.
3. Verify domain ownership in Google Search Console (DNS verification is suitable). Alternatively set `GOOGLE_SITE_VERIFICATION` to the supplied HTML verification token and rebuild.
4. Submit `/sitemap.xml` in Search Console. Indexing and ranking are controlled by search engines; deployment or a sitemap submission does not guarantee either.

A generated 1200×630 social image is served at `/opengraph-image`. Article pages include publication/update dates and structured data; all sources and related reading are linked in the rendered HTML. Keep future update dates tied to substantive content changes.

`npm run check:seo` checks the production build through a temporary local server: sitemap routes, canonical URLs, robots directives, structured data, internal links, social image, query variants, and 404s. Run after `npm run build`.

Configure analytics and actual affiliate URLs only after obtaining the relevant accounts. Update the commercial disclosure when affiliate or sponsor arrangements change.

## Content maintenance

- Catalog assembly, baseline records, Trending slugs, and review date: `lib/models.ts`
- New research profiles: `lib/latest-models.ts`
- Guide content and sources: `lib/guides.ts`, `lib/field-notes.ts`
- Ranking definitions, inclusion rules, and ordering: `lib/rankings.ts`
- Curated comparison pages: `lib/comparisons.ts`
- Metadata / origin handling: `lib/seo.ts`
- Visual system and breakpoints: `app/globals.css`

Source review: September 22, 2026. This is a curated initial collection, not a latest-model feed. Before adding performance results, record model revisions, workload, hardware, runtime, cache policy, failure counts, repeated measurements, and raw evidence.

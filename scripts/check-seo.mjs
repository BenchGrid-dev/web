import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const listener = createServer();
await new Promise((resolve) => listener.listen(0, '127.0.0.1', resolve));
const port = listener.address().port;
await new Promise((resolve) => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://benchgrid.dev').replace(/\/$/, '');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { env: { ...process.env, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stderr.on('data', (data) => { output += data; });
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2].replaceAll('&amp;', '&')]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map((m) => attrs(m[0]));
const meta = (html, key) => tags(html, 'meta').find((a) => a.name === key || a.property === key)?.content;
async function get(path) {
  const response = await fetch(`${base}${path}`, { headers: { 'user-agent': 'Googlebot' }, signal: AbortSignal.timeout(15000) });
  return { status: response.status, html: await response.text() };
}
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Server did not start: ${output}`)), 20000);
    server.once('error', (error) => { clearTimeout(timeout); reject(error); });
    server.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${output}`)); });
    server.stdout.on('data', (data) => { output += data; if (output.includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(robots.html, /Allow: \//);
  assert.ok(robots.html.includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.equal(urls.length, new Set(urls).size, 'Duplicate sitemap entries');
  const paths = urls.map((url) => { assert.equal(new URL(url).origin, origin); assert.equal(new URL(url).search, ''); return new URL(url).pathname; });
  assert.equal(paths.filter((path) => path.startsWith('/guides/')).length, 8);
  assert.equal(paths.filter((path) => path.startsWith('/compare/')).length, 4);
  assert.equal(paths.filter((path) => path.startsWith('/models/')).length, 26);
  assert.equal(paths.filter((path) => path.startsWith('/rankings/')).length, 6);
  const titles = new Set();
  const internalLinks = new Set();
  const images = new Set();
  for (let index = 0; index < paths.length; index += 6) {
    await Promise.all(paths.slice(index, index + 6).map(async (path) => {
      const { status, html } = await get(path);
      assert.equal(status, 200, path);
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
      assert.ok(title, `Missing title: ${path}`);
      assert.ok(!titles.has(title), `Duplicate title: ${path}`); titles.add(title);
      assert.ok(meta(html, 'description'), `Missing description: ${path}`);
      const canonical = tags(html, 'link').filter((tag) => tag.rel === 'canonical');
      assert.equal(canonical.length, 1, `Canonical count: ${path}`);
      assert.equal(new URL(canonical[0].href).href, new URL(`${origin}${path}`).href, path);
      assert.match(meta(html, 'robots'), /^index, follow$/, path);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, `H1 count: ${path}`);
      assert.ok(meta(html, 'og:image')?.startsWith(origin), `Missing social image: ${path}`);
      const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.ok(data.length, `Missing JSON-LD: ${path}`);
      const structured = data.flatMap(([, json]) => JSON.parse(json));
      if (path.startsWith('/rankings/')) {
        const table = tags(html, 'table').find((tag) => tag['data-ranking-kind']);
        assert.ok(table, `Missing ranking table: ${path}`);
        const rows = tags(html, 'tr').filter((tag) => tag['data-model-slug']);
        const slugs = rows.map((tag) => tag['data-model-slug']);
        assert.ok(rows.length >= 5, `Incomplete ranking: ${path}`);
        assert.equal(slugs.length, new Set(slugs).size, `Duplicate model: ${path}`);
        for (const slug of slugs) assert.ok(paths.includes(`/models/${slug}`), `Unknown model: ${slug}`);
        const list = structured.find((item) => item['@type'] === 'CollectionPage')?.mainEntity;
        assert.equal(list?.numberOfItems, rows.length, `List count: ${path}`);
        assert.deepEqual(list.itemListElement.map((item) => new URL(item.url).pathname), slugs.map((slug) => `/models/${slug}`), `Visible/schema order: ${path}`);
        const kind = table['data-ranking-kind'];
        if (kind === 'shortlist') {
          assert.equal(list.itemListOrder, 'https://schema.org/ItemListUnordered');
          assert.ok(rows.every((row) => row['data-sort-value'] === undefined), `Invented score: ${path}`);
          const names = list.itemListElement.map((item) => item.name);
          assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'en')), `Alphabetical shortlist: ${path}`);
        } else {
          const values = rows.map((row) => Number(row['data-sort-value']));
          assert.ok(values.every((value) => Number.isFinite(value) && value > 0));
          assert.deepEqual(values, [...values].sort((a, b) => kind === 'calculated' ? a - b : b - a), `Metric ordering: ${path}`);
          assert.equal(list.itemListOrder, `https://schema.org/ItemListOrder${kind === 'calculated' ? 'Ascending' : 'Descending'}`);
          if (kind === 'calculated') assert.deepEqual(values, [8, 16, 16.4, 24, 65.6, 618], 'Baseline 16-bit arithmetic');
        }
      }
      for (const { href } of tags(html, 'a')) if (href?.startsWith('/') && !href.startsWith('//')) internalLinks.add(href.split('#')[0]);
      for (const { src } of tags(html, 'img')) if (src?.startsWith('/brands/')) images.add(src);
    }));
  }
  for (const path of internalLinks) {
    if (paths.includes(path)) continue;
    assert.equal((await get(path)).status, 200, `Broken internal link: ${path}`);
  }
  for (const path of images) assert.equal((await fetch(`${base}${path}`)).status, 200, path);
  for (const query of ['?bits=4', '?models=qwen3-8b,llama-3-1-8b', '?models=unknown&bits=garbage', '?models=qwen3-8b&models=llama-3-1-8b']) {
    const { status, html } = await get(`/compare${query}`);
    assert.equal(status, 200);
    assert.equal(meta(html, 'robots'), 'noindex, follow');
    assert.equal(tags(html, 'link').find((tag) => tag.rel === 'canonical')?.href, `${origin}/compare`);
  }
  for (const path of ['/compare/not-a-real-comparison', '/guides/not-a-real-note', '/models/not-a-real-model', '/rankings/not-a-real-ranking']) assert.equal((await get(path)).status, 404, path);
  const og = await fetch(`${base}/opengraph-image`);
  assert.equal(og.status, 200);
  assert.match(og.headers.get('content-type'), /image\/png/);
  const png = Buffer.from(await og.arrayBuffer());
  assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
  console.log(`SEO checks passed: ${paths.length} sitemap pages, ${internalLinks.size} internal links, ${images.size} brand assets, custom comparisons, 404s, and 1200×630 social image.`);
} finally {
  server.kill('SIGTERM');
}

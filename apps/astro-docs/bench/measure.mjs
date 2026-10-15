/**
 * Static-site runtime benchmark: ubean SSG vs Astro, measured in the same browser.
 *
 * Both sites are served as plain static files by `node:http` (no compression, no
 * caching headers) so the only variables are the artifacts themselves. For each
 * page the script collects:
 *
 *   - network: transferred bytes per resource, request count, per-type breakdown;
 *   - paint:  TTFB / FCP / LCP / CLS / TBT via CDP `Performance` + PerformanceObserver;
 *   - main thread: long-task total and count, script eval time, JS heap.
 *
 * Usage: node bench/measure.mjs --site ubean:4173 --site astro:4174 --out result.json
 */
import { createServer } from 'node:http';
import { createReadStream, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8'
};

function parseArgs(argv) {
  const sites = [];
  let out = 'bench/result.json';
  let runs = 3;
  let pagesFile = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--site') {
      const [name, dir, port] = argv[++index].split(':');
      sites.push({ name, dir: path.resolve(dir), port: Number(port) });
    } else if (arg === '--out') {
      out = argv[++index];
    } else if (arg === '--runs') {
      runs = Number(argv[++index]);
    } else if (arg === '--pages') {
      pagesFile = argv[++index];
    }
  }

  return { sites, out, runs, pagesFile };
}

function serve(dir, port) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let filePath = path.join(dir, decodeURIComponent(url.pathname));

    try {
      if (statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    } catch {
      filePath = path.join(dir, '404.html');
    }

    let body;

    try {
      body = readFileSync(filePath);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }

    res.writeHead(200, {
      'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream',
      'content-length': body.byteLength,
      'cache-control': 'no-store'
    });
    res.end(body);
  });

  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

const OBSERVER_SNIPPET = `
window.__bench = { lcp: 0, cls: 0, longTasks: [], fcp: 0, ttfb: 0 };

window.addEventListener('load', () => {
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) window.__bench.ttfb = nav.responseStart;
});

new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    window.__bench.lcp = entry.startTime;
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });

new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) window.__bench.cls += entry.value;
  }
}).observe({ type: 'layout-shift', buffered: true });

new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-contentful-paint') window.__bench.fcp = entry.startTime;
  }
}).observe({ type: 'paint', buffered: true });

new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    window.__bench.longTasks.push(entry.duration);
  }
}).observe({ type: 'longtask', buffered: true });
`;

async function measurePage(browser, origin, urlPath, runs) {
  const samples = [];

  for (let run = 0; run < runs; run += 1) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const client = await context.newCDPSession(page);

    await client.send('Performance.enable');
    await page.addInitScript(OBSERVER_SNIPPET);

    const requests = [];

    page.on('response', async response => {
      const request = response.request();

      try {
        const body = await response.body();
        requests.push({
          url: response.url(),
          status: response.status(),
          type: request.resourceType(),
          bytes: body.byteLength
        });
      } catch {
        requests.push({ url: response.url(), status: response.status(), type: request.resourceType(), bytes: 0 });
      }
    });

    const navigation = await page.goto(`${origin}${urlPath}`, { waitUntil: 'load', timeout: 60000 });

    // Give the page a moment to hydrate and for late LCP/CLS entries to land.
    await page.waitForTimeout(2500);

    const metrics = await client.send('Performance.getMetrics');
    const metricMap = Object.fromEntries(metrics.metrics.map(entry => [entry.name, entry.value]));
    const bench = await page.evaluate(() => window.__bench);

    const transfer = requests.reduce((sum, request) => sum + request.bytes, 0);
    const byType = {};

    for (const request of requests) {
      byType[request.type] = byType[request.type] ?? { count: 0, bytes: 0 };
      byType[request.type].count += 1;
      byType[request.type].bytes += request.bytes;
    }

    const longTasks = bench?.longTasks ?? [];

    samples.push({
      htmlBytes: (await navigation.body()).byteLength,
      transferBytes: transfer,
      requests: requests.length,
      byType,
      jsBytes: byType.script?.bytes ?? 0,
      cssBytes: byType.stylesheet?.bytes ?? 0,
      ttfb: bench?.ttfb ?? 0,
      fcp: bench?.fcp ?? 0,
      lcp: bench?.lcp ?? 0,
      cls: bench?.cls ?? 0,
      longTaskTotal: longTasks.reduce((sum, value) => sum + value, 0),
      longTaskCount: longTasks.length,
      scriptDuration: (metricMap.ScriptDuration ?? 0) * 1000,
      taskDuration: (metricMap.TaskDuration ?? 0) * 1000,
      heapUsed: metricMap.JSHeapUsedSize ?? 0,
      resources: requests
        .map(request => ({ url: request.url.replace(origin, ''), type: request.type, bytes: request.bytes }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 12)
    });

    await context.close();
  }

  const keys = Object.keys(samples[0]);
  const median = {};

  for (const key of keys) {
    if (key === 'byType' || key === 'resources') {
      continue;
    }

    const values = samples.map(sample => sample[key]).sort((a, b) => a - b);
    median[key] = values[Math.floor(values.length / 2)];
  }

  median.byType = samples[0].byType;
  // Resources come from the run whose transfer size is the median, so the list
  // describes the run the other numbers were taken from.
  const medianTransfer = median.transferBytes;
  median.resources = samples.reduce((best, sample) =>
    Math.abs(sample.transferBytes - medianTransfer) < Math.abs(best.transferBytes - medianTransfer) ? sample : best
  ).resources;
  median.samples = samples;

  return median;
}

const { sites, out, runs, pagesFile } = parseArgs(process.argv.slice(2));

const PAGES = pagesFile
  ? JSON.parse(readFileSync(pagesFile, 'utf8'))
  : ['/', '/components/button', '/overview/quick-start', '/components', '/releases', '/zh/components/button'];

const servers = await Promise.all(sites.map(site => serve(site.dir, site.port)));
const browser = await chromium.launch();
const result = { runs, pages: {}, generatedAt: new Date().toISOString() };

for (const pagePath of PAGES) {
  result.pages[pagePath] = {};

  for (const site of sites) {
    process.stdout.write(`${site.name} ${pagePath} ... `);
    result.pages[pagePath][site.name] = await measurePage(browser, `http://localhost:${site.port}`, pagePath, runs);
    const m = result.pages[pagePath][site.name];
    console.log(
      `html=${(m.htmlBytes / 1024).toFixed(0)}KB transfer=${(m.transferBytes / 1024).toFixed(0)}KB ` +
        `req=${m.requests} fcp=${m.fcp.toFixed(0)}ms lcp=${m.lcp.toFixed(0)}ms cls=${m.cls.toFixed(4)} ` +
        `tbt=${m.longTaskTotal.toFixed(0)}ms script=${m.scriptDuration.toFixed(0)}ms`
    );
  }
}

await browser.close();
await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));

const { writeFileSync } = await import('node:fs');
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(`\nwrote ${out}`);

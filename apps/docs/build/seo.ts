import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectDocsRoutes } from './docs-routes';

/**
 * Post-build SEO generator (T5.3). ubean@0.4.1 auto-registers `/sitemap.xml`
 * and `/robots.txt` as runtime routes but excludes them from prerender output
 * (`DEFAULT_PRERENDER_EXCLUDE`), so an SSG deploy would 404 them. This script
 * writes both files into `dist/public` after `ubean build`.
 *
 * Hostname comes from `DOCS_SITE_URL` (default: production origin).
 */
const SITE_URL = (process.env.DOCS_SITE_URL || 'https://veanui.com').replace(/\/+$/u, '');
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(appRoot, 'dist/public');

function escapeXml(value: string): string {
  return value.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');
}

/** Alternate hreflang links for a route across locales (`prefix_except_default`). */
function alternatesFor(route: string): { hreflang: string; path: string }[] {
  const zhPath = route === '/' ? '/zh' : `/zh${route}`;

  return [
    { hreflang: 'en', path: route },
    { hreflang: 'zh-Hans', path: zhPath },
    { hreflang: 'x-default', path: route }
  ];
}

function buildSitemapXml(routes: string[]): string {
  const lastmod = new Date().toISOString();
  const urls = routes.map(route => {
    const links = alternatesFor(route)
      .map(
        alternate =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(`${SITE_URL}${alternate.path}`)}"/>`
      )
      .join('\n');

    return [
      '  <url>',
      `    <loc>${escapeXml(`${SITE_URL}${route}`)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      `    <priority>${route === '/' || route === '/zh' ? '1.0' : '0.8'}</priority>`,
      links,
      '  </url>'
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n');
}

function buildRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
}

async function main(): Promise<void> {
  const routes = await collectDocsRoutes(appRoot);

  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(outDir, 'sitemap.xml'), buildSitemapXml(routes), 'utf8'),
    writeFile(path.join(outDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
  ]);

  console.log(`[seo] sitemap.xml (${routes.length} urls) + robots.txt written to dist/public`);
}

main().catch(error => {
  console.error('[seo] failed:', error);
  process.exitCode = 1;
});

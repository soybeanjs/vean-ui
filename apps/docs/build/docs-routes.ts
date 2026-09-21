import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { resolveContentRoutePath } from '../src/shared/content-route';

/** locale code -> content directory name (aligned with i18n locale codes). */
export const CONTENT_LOCALES = ['en', 'zh'] as const;

/**
 * Static (non-content) pages that must be prerendered / listed in the sitemap.
 * Mirrors the `definePage` routes under `src/pages`.
 */
export const STATIC_ROUTES = ['/', '/releases', '/aria', '/components', '/playground', '/theme-editor'] as const;

export function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

export { resolveContentRoutePath };

async function collectMarkdownSlugs(directoryPath: string, baseDir: string): Promise<string[]> {
  if (!existsSync(directoryPath)) {
    return [];
  }

  const entries = await readdir(directoryPath, { withFileTypes: true });
  const nestedSlugs = await Promise.all(
    entries.map(async entry => {
      const resolvedPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownSlugs(resolvedPath, baseDir);
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [toPosixPath(path.relative(baseDir, resolvedPath)).replace(/\.md$/u, '')];
      }

      return [];
    })
  );

  return nestedSlugs.flat();
}

async function collectLocaleSlugs(rootDir: string, locale: string): Promise<string[]> {
  const dir = path.join(rootDir, 'src/content', locale);
  return collectMarkdownSlugs(dir, dir);
}

/**
 * Collect concrete prerender routes from markdown files under `src/content`.
 * Dynamic catch-all / param routes are not expanded by `prerender.all`, so every
 * content slug must be listed explicitly (mirrors the official ubean docs site).
 * Non-English locales get their `/zh`-prefixed mirror (`prefix_except_default`).
 */
export async function collectContentRoutes(rootDir: string): Promise<string[]> {
  const routes: string[] = [];

  for (const locale of CONTENT_LOCALES) {
    const dir = path.join(rootDir, 'src/content', locale);
    const slugs = await collectMarkdownSlugs(dir, dir);
    const prefix = locale === 'en' ? '' : `/${locale}`;

    for (const slug of slugs) {
      routes.push(`${prefix}${resolveContentRoutePath(slug)}`);
    }
  }

  return [...new Set(routes)];
}

/**
 * Prerender include routes（ubean@0.4.5 起由 SSG 渲染器的 `expandRoutes` 自动
 * 展开 i18n 多语言镜像）：静态页 + 默认语言内容 + 仅 zh 独有的内容页。
 * `/zh` 镜像不再手工生成 —— `prefix_except_default` 策略下框架会为每个无前缀
 * 路由补 `/zh` 变体（含 6 个 zh-only 组件页需显式保留，因为 expandRoutes 只
 * 展开已收集路由的镜像）。
 */
export async function collectPrerenderRoutes(rootDir: string): Promise<string[]> {
  const [enSlugs, zhSlugs] = await Promise.all([
    collectLocaleSlugs(rootDir, CONTENT_LOCALES[0]),
    collectLocaleSlugs(rootDir, CONTENT_LOCALES[1])
  ]);
  const zhOnlySlugs = zhSlugs.filter(slug => !enSlugs.includes(slug));

  const routes = [
    ...STATIC_ROUTES,
    ...enSlugs.map(resolveContentRoutePath),
    ...zhOnlySlugs.map(slug => `/zh${resolveContentRoutePath(slug)}`)
  ];

  return [...new Set(routes)].sort((left, right) => left.localeCompare(right));
}

/**
 * Full prerender / sitemap route list: static pages + content routes + `/zh`
 * mirrors of the static pages.
 */
export async function collectDocsRoutes(rootDir: string): Promise<string[]> {
  const contentRoutes = await collectContentRoutes(rootDir);
  const zhMirrors = STATIC_ROUTES.map(route => (route === '/' ? '/zh' : `/zh${route}`));

  return [...new Set([...STATIC_ROUTES, ...zhMirrors, ...contentRoutes])].sort((left, right) =>
    left.localeCompare(right)
  );
}

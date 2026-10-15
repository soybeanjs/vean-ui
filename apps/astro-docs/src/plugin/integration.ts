import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { collectRoutes, localizedPath } from './routes';
import { writeSearchIndex } from './search-index';

/**
 * The docs site is a fully static mirror of the ubean build: the route table is
 * generated from the *same* markdown tree and the same slug -> URL mapping, so
 * `astro build` emits one HTML file per route with the identical URL set to
 * `apps/docs/dist/public`.
 *
 * Two responsibilities:
 *
 * 1. inject the single catch-all route — every concrete URL is produced by
 *    `getStaticPaths()` inside `src/pages/[...doc].astro`. Injecting 238 static
 *    patterns that all point at the same entrypoint would be slower and redundant.
 * 2. write `__search.json` after the build, matching the index the ubean build
 *    emits (a built-in `@ubean/content` feature) so the two artifacts are
 *    comparable byte-for-byte in shape.
 */
export function docsRoutes(): AstroIntegration {
  return {
    name: 'vean-docs-routes',
    hooks: {
      'astro:config:setup': async ({ injectRoute, logger }) => {
        const routes = await collectRoutes();
        const unique = new Set(routes.map(route => localizedPath(route)));

        injectRoute({ pattern: '/[...doc]', entrypoint: 'src/pages/[...doc].astro', prerender: true });

        logger.info(`injected catch-all route for ${unique.size} prerendered pages`);
      },
      'astro:build:done': async ({ dir, logger }) => {
        // `fileURLToPath` is a static import on purpose: a dynamic `import()` inside
        // this hook runs after Astro closes the Vite module runner and throws
        // "Vite module runner has been closed".
        const count = await writeSearchIndex(fileURLToPath(dir));

        logger.info(`wrote __search.json with ${count} entries`);
      }
    }
  };
}

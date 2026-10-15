/**
 * Content slug (relative to `{locale}` content dir, no `.md`) -> public route path.
 *
 * The mapping mirrors the shell pages under `src/pages`:
 * - `ui/components/<slug>`       -> `/components/<slug>`
 * - `ui/<slug>`                  -> `/overview/<slug>`
 * - `<section>/components/<slug>` -> `/<section>/<slug>` (chart)
 * - `<section>/<slug>`           -> `/<section>/<slug>`
 * - trailing `index` collapses to its directory root (`cli/index` -> `/cli`)
 *
 * Shared by the SSG preroute collector (`build/docs-routes.ts`) and the
 * client-side content search, so indexed hits always lead to real routes.
 */
export function resolveContentRoutePath(inputSlug: string): string {
  const slug = inputSlug.replace(/\/index$/u, '').replace(/^index$/u, '');
  const uiComponentsMatch = slug.match(/^ui\/components\/(.+)$/u);

  if (uiComponentsMatch) {
    return `/components/${uiComponentsMatch[1]}`;
  }

  // Peripheral packages keep their component docs under `<section>/components/`
  // but expose them as single-segment `/<section>/:name` pages (see
  // `pages/chart/[name].vue`), so the `components` segment must be dropped.
  const sectionComponentsMatch = slug.match(/^([^/]+)\/components\/(.+)$/u);

  if (sectionComponentsMatch) {
    return `/${sectionComponentsMatch[1]}/${sectionComponentsMatch[2]}`;
  }

  if (slug === 'ui') {
    return '/overview';
  }

  if (slug.startsWith('ui/')) {
    return `/overview/${slug.slice('ui/'.length)}`;
  }

  return `/${slug}`;
}

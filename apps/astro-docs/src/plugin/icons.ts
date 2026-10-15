import { createRequire } from 'node:module';
import { iconToSVG } from '@iconify/utils';
import lucide from '@iconify-json/lucide/icons.json' with { type: 'json' };
import mdi from '@iconify-json/mdi/icons.json' with { type: 'json' };

/**
 * Build-time icon rendering.
 *
 * The ubean docs resolve icons at runtime through `@iconify/vue` (component
 * `<SIcon icon="lucide:rocket">`) — no icon data is shipped, and there is no
 * `@iconify-json/*` dependency at all, so the icon sets are *not* in that bundle.
 * The server-rendered markup is `<svg data-vean-icon>` with **empty contents**.
 *
 * Astro's static output cannot defer to a runtime resolver without shipping icon
 * data, so this module inlines the real SVG at build time instead: the icons land
 * in the HTML, no icon JSON enters the client bundle. That keeps the comparison
 * honest — Astro trades HTML bytes for zero icon-runtime JS, and the report says
 * so rather than pretending the two artifacts are shaped the same.
 *
 * `iconToSVG` is used from `@iconify/utils` (already in the workspace, not a new
 * dependency of the shipped site — this module only runs at build time).
 */
const collections: Record<string, { icons: Record<string, unknown>; width?: number; height?: number }> = {
  lucide: lucide as never,
  mdi: mdi as never
};

const require = createRequire(import.meta.url);

/** Guard so a missing collection fails loudly at build time instead of rendering nothing. */
export function hasCollection(prefix: string): boolean {
  return prefix in collections;
}

export interface RenderIconOptions {
  size?: string;
  class?: string;
  /** Forwarded to the `<svg>` element verbatim. */
  attrs?: Record<string, string>;
}

/**
 * Render `lucide:rocket` to an inline `<svg>` string.
 *
 * Returns an empty string for an unknown icon so a typo degrades to a missing
 * glyph instead of failing the whole build (the ubean site behaves the same way
 * at runtime).
 */
export function renderIcon(name: string, options: RenderIconOptions = {}): string {
  const [prefix, ...rest] = name.split(':');
  const iconName = rest.join(':');
  const collection = collections[prefix];
  const icon = collection?.icons[iconName];

  if (!icon) {
    return '';
  }

  // Icon entries in `@iconify-json/*` carry only `body`; the set's grid size lives on
  // the collection root (24x24 for both lucide and mdi). `iconToSVG` falls back to its
  // own 16x16 default when the icon has no size, which would clip the art — so the
  // collection dimensions are folded in here, matching what `@iconify/vue` receives
  // from the Iconify API at runtime.
  const { body, attributes } = iconToSVG({
    ...(icon as Record<string, unknown>),
    width: collection.width ?? 24,
    height: collection.height ?? 24
  } as never);

  const attrs = Object.entries({
    ...attributes,
    width: options.size ?? '1.25em',
    height: options.size ?? '1.25em',
    ...(options.attrs ?? {})
  })
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
    .join(' ');

  const className = options.class ? ` class="${options.class}"` : '';

  return `<svg ${attrs}${className} data-vean-icon>${body}</svg>`;
}

/** Escape hatch for callers that need the raw JSON of a collection at build time. */
export function loadCollection(prefix: string): unknown {
  try {
    return require(`@iconify-json/${prefix}/icons.json`);
  } catch {
    return undefined;
  }
}

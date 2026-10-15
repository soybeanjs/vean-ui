import type { ApiLayerSection, ApiRow, ApiSymbolSection } from './api';
import { renderDataTableHtml } from './data-table';

/**
 * Static markup for the generated API tables.
 *
 * Mirrors `apps/docs/src/components/component-api.vue`: one `<section>` per package
 * layer (UI / Aria / Chart / Admin), one card per symbol, and a `<DataTable>` per
 * non-empty entity. Rendered at build time as HTML because the content is fixed —
 * the ubean site ships the whole table runtime (and a type-preview registry) to the
 * client for the same output.
 */

const LAYER_TITLE_KEY: Record<string, string> = {
  ui: 'api.ui_layer',
  aria: 'api.aria_layer',
  chart: 'api.chart_layer',
  admin: 'api.admin_layer'
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;');
}

function counts(symbol: ApiSymbolSection, t: (key: string) => string): string {
  const entries: string[] = [];

  if (symbol.propsRows.length) entries.push(`${symbol.propsRows.length} ${t('api.props')}`);
  if (symbol.emitsRows.length) entries.push(`${symbol.emitsRows.length} ${t('api.emits')}`);
  if (symbol.slotsRows.length) entries.push(`${symbol.slotsRows.length} ${t('api.slots')}`);

  return entries.map(entry => `<span>${escapeHtml(entry)}</span>`).join('');
}

function entityBlock(
  title: string,
  preset: 'props' | 'emits' | 'slots',
  rows: ApiRow[],
  t: (key: string) => string
): string {
  if (!rows.length) {
    return '';
  }

  return (
    '<div class="space-y-3">' +
    `<h5 class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">${escapeHtml(title)}</h5>` +
    renderDataTableHtml(preset, rows, t) +
    '</div>'
  );
}

function symbolCard(symbol: ApiSymbolSection, t: (key: string) => string): string {
  return (
    '<div data-vean-collapsible-root data-state="open" data-vean-card-root data-header-visible="true" ' +
    'data-footer-visible="false" class="flex flex-col items-stretch rounded-md border bg-card text-foreground ' +
    'shadow-sm text-sm divide-y divide-border docs-card overflow-hidden">' +
    '<div data-vean-card-header class="flex items-center justify-between flex-wrap px-4 py-3">' +
    '<div data-vean-card-title-root class="flex items-center gap-2">' +
    '<h3 data-vean-card-title class="font-semibold tracking-tight m-0 text-base">' +
    `<h4 class="scroll-mt-24 text-lg font-semibold tracking-[-0.02em] text-foreground"><span>${escapeHtml(
      symbol.displayName
    )}</span></h4></h3></div>` +
    `<div class="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">${counts(
      symbol,
      t
    )}</div>` +
    '</div>' +
    '<div data-vean-card-content class="px-4 py-3"><div class="space-y-5">' +
    entityBlock(t('api.props'), 'props', symbol.propsRows, t) +
    entityBlock(t('api.emits'), 'emits', symbol.emitsRows, t) +
    entityBlock(t('api.slots'), 'slots', symbol.slotsRows, t) +
    '</div></div></div>'
  );
}

/** Whole `## API` block body: every layer section, in the order `api.ts` returned them. */
export function renderApiTablesHtml(layers: ApiLayerSection[], t: (key: string) => string): string {
  return (
    '<div class="space-y-8">' +
    layers
      .map(
        layer =>
          '<section class="space-y-5">' +
          '<div class="flex flex-wrap items-center gap-3 border-b border-border/60 pb-4">' +
          `<h3 class="scroll-mt-24 text-2xl font-bold tracking-[-0.03em] text-foreground">${escapeHtml(
            t(LAYER_TITLE_KEY[layer.key] ?? layer.key)
          )}</h3>` +
          `<span class="text-sm font-medium text-muted-foreground">${layer.symbols.length}</span></div>` +
          layer.symbols.map(symbol => symbolCard(symbol, t)).join('') +
          '</section>'
      )
      .join('') +
    '</div>'
  );
}

import type { ApiRow } from './api';

/**
 * Renders the API table markup as a plain HTML string.
 *
 * The ubean site renders these tables with the Vue `STable`/`SBadge` components, which
 * pulls the whole table runtime plus a type-preview context into every component page's
 * client bundle. Here the same `data-vean-*` markup is emitted at build time: the shared
 * `@vean/ui` CSS (`presetUi({ uiCSS: true })`) styles it identically, and the page needs
 * no JavaScript for it.
 *
 * Deliberately dropped from the ubean output: the `TypeReference` hover/click type preview
 * (needs the ~12 MB cross-component API registry) and the `sticky`/arbitrary-variant hover
 * cosmetics on `<thead>`/`<tr>`.
 */

type Preset = 'props' | 'emits' | 'slots';

interface Column {
  key: 'name' | 'type' | 'parameters' | 'defaultValue' | 'description';
  titleKey: string;
  minWidth: number;
}

const COLUMN_MIN_WIDTH: Record<string, number> = {
  name: 144,
  type: 176,
  parameters: 176,
  defaultValue: 136,
  description: 240
};

function columnsFor(preset: Preset): Column[] {
  if (preset === 'props') {
    return [
      { key: 'name', titleKey: 'api.columns.prop_name', minWidth: 144 },
      { key: 'type', titleKey: 'api.columns.type', minWidth: 176 },
      { key: 'defaultValue', titleKey: 'api.columns.default', minWidth: 136 },
      { key: 'description', titleKey: 'api.columns.description', minWidth: 240 }
    ];
  }

  return [
    { key: 'name', titleKey: preset === 'emits' ? 'api.columns.emit_name' : 'api.columns.slot_name', minWidth: 144 },
    { key: 'parameters', titleKey: 'api.columns.parameters', minWidth: 176 },
    { key: 'description', titleKey: 'api.columns.description', minWidth: 240 }
  ];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;');
}

function cell(minWidth: number, inner: string): string {
  return (
    `<td data-vean-table-cell class="box-border p-1.75 border-s border-border first:border-s-0" ` +
    `style="min-width:${minWidth}px;text-align:start;">${inner}</td>`
  );
}

function nameCell(row: ApiRow, minWidth: number): string {
  return cell(
    minWidth,
    `<div class="flex flex-wrap items-center gap-2"><div data-vean-badge-root class="relative inline-block">` +
      `<div class="code-btn">${escapeHtml(row.name)}</div></div></div>`
  );
}

function chipCell(value: string | undefined, minWidth: number): string {
  return cell(minWidth, `<div class="code-btn-outline"><span>${escapeHtml(value ?? '—')}</span></div>`);
}

function defaultCell(row: ApiRow, minWidth: number): string {
  const value = row.default;

  if (value === undefined || value === '') {
    return cell(
      minWidth,
      '<div class="flex flex-wrap items-center gap-2"><span class="text-sm text-muted-foreground">—</span></div>'
    );
  }

  return cell(
    minWidth,
    `<div class="flex flex-wrap items-center gap-2"><div class="code-btn-outline">${escapeHtml(value)}</div></div>`
  );
}

function descriptionCell(row: ApiRow, minWidth: number): string {
  return cell(
    minWidth,
    `<div class="max-w-[22rem] whitespace-pre-wrap break-words py-1 text-muted-foreground">${escapeHtml(
      row.description
    )}</div>`
  );
}

function rowHtml(preset: Preset, row: ApiRow, columns: Column[]): string {
  const cells = columns
    .map(column => {
      switch (column.key) {
        case 'name':
          return nameCell(row, column.minWidth);
        case 'type':
          return chipCell(row.type, column.minWidth);
        case 'parameters':
          return chipCell(row.parameters, column.minWidth);
        case 'defaultValue':
          return defaultCell(row, column.minWidth);
        default:
          return descriptionCell(row, column.minWidth);
      }
    })
    .join('');

  return (
    '<tr data-vean-table-row class="bg-card border-b" data-row data-level="1">' +
    cells +
    '</tr>'
  );
}

/** `<DataTable preset="…" :data="[…]" />` from the markdown, rendered to static markup. */
export function renderDataTableHtml(preset: Preset, rows: ApiRow[], t: (key: string) => string): string {
  const columns = columnsFor(preset);

  const head = columns
    .map(
      column =>
        `<th data-vean-table-head class="box-border bg-muted text-foreground relative font-medium p-1.75" ` +
        `style="min-width:${column.minWidth}px;text-align:start;" colspan="1" rowspan="1" aria-sort="none">` +
        `<span>${escapeHtml(t(column.titleKey))}</span></th>`
    )
    .join('');

  const body = rows.map(row => rowHtml(preset, row, columns)).join('');

  return (
    '<div class="min-w-0 overflow-x-auto"><div data-vean-table-root class="relative overflow-hidden rounded-[--rounded] ' +
    'text-xs bg-muted [--rounded:--radius] px-0.875 pb-0.875" dir="ltr">' +
    '<div data-vean-table-scroll class="h-full overflow-auto">' +
    '<table data-vean-table-content class="min-w-full w-max border-spacing-0" role="table">' +
    `<thead data-vean-table-header class="sticky top-0 start-0 z-10"><tr data-vean-table-row class="bg-card border-b">${head}</tr></thead>` +
    `<tbody data-vean-table-body>${body}</tbody>` +
    '</table></div></div></div>'
  );
}

/** Column `min-width` used by both the markdown `<DataTable>` and the generated API tables. */
export { COLUMN_MIN_WIDTH };

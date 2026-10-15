import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { DOCS_ROOT } from './examples';

const API_ROOT = path.join(DOCS_ROOT, 'src/generated/api');
const API_LOCALE_ROOT = path.join(DOCS_ROOT, 'src/generated/api-locales');

export interface ApiRow {
  name: string;
  required?: boolean;
  default?: string;
  type?: string;
  parameters?: string;
  description: string;
  descriptionKey?: string | null;
}

export interface ApiSymbolSection {
  key: string;
  name: string;
  displayName: string;
  propsRows: ApiRow[];
  emitsRows: ApiRow[];
  slotsRows: ApiRow[];
}

export interface ApiLayerSection {
  key: string;
  symbols: ApiSymbolSection[];
}

interface Entity {
  kind: string;
  name: string;
  type?: string;
  description?: string;
  sourcePath?: string;
  typeParameters?: string[];
  members?: {
    name: string;
    required: boolean;
    description: string;
    default: unknown;
    type?: string;
    referencedTypes?: ReferencedType[];
    descriptionKey?: string | null;
  }[];
  callables?: {
    name: string;
    required?: boolean;
    description: string;
    parameters?: string;
    descriptionKey?: string | null;
  }[];
}

interface ReferencedType {
  name: string;
  type: string;
  sourcePath: string;
  typeParameters?: string[];
}

interface ApiDocument {
  component: string;
  symbols: Record<string, { props?: Entity; emits?: Entity; slots?: Entity }>;
}

/** Which package a component document came from (`ui`, `aria`, `chart`, ...). */
const packageByComponent = new Map<string, string>();
let indexLoaded = false;

async function loadIndex(): Promise<void> {
  if (indexLoaded) {
    return;
  }

  indexLoaded = true;

  let packages: string[] = [];

  try {
    packages = (await readdir(API_ROOT, { withFileTypes: true }))
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch {
    return;
  }

  for (const pkg of packages) {
    const dir = path.join(API_ROOT, pkg);
    const files = await readdir(dir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        packageByComponent.set(file.slice(0, -5), pkg);
      }
    }
  }
}

const documentCache = new Map<string, ApiDocument | null>();

async function loadDocument(component: string): Promise<ApiDocument | null> {
  const cached = documentCache.get(component);

  if (cached !== undefined) {
    return cached;
  }

  await loadIndex();

  const pkg = packageByComponent.get(component);
  let document: ApiDocument | null = null;

  if (pkg) {
    try {
      document = JSON.parse(await readFile(path.join(API_ROOT, pkg, `${component}.json`), 'utf8')) as ApiDocument;
    } catch {
      document = null;
    }
  }

  documentCache.set(component, document);

  return document;
}

/**
 * Generated API translations, keyed by the `descriptionKey` stored in the JSON
 * (`api.generated.<file>.<symbol>.<layer>.members.<name>`). The `zh` locale reads
 * `zh-CN.json` — the generator names files by language tag, the site by locale code.
 */
const localeCache = new Map<string, Record<string, unknown>>();

async function loadApiLocale(locale: string): Promise<Record<string, unknown>> {
  const cached = localeCache.get(locale);

  if (cached) {
    return cached;
  }

  const fileName = locale === 'zh' ? 'zh-CN' : locale;
  let table: Record<string, unknown> = {};

  try {
    table = JSON.parse(await readFile(path.join(API_LOCALE_ROOT, `${fileName}.json`), 'utf8')) as Record<
      string,
      unknown
    >;
  } catch {
    table = {};
  }

  localeCache.set(locale, table);

  return table;
}

function readMessage(table: Record<string, unknown>, key: string | null | undefined): string | null {
  if (!key) {
    return null;
  }

  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }

    return undefined;
  }, table);

  return typeof value === 'string' && value ? value : null;
}

function formatDefault(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}

/**
 * Mirrors `isUiSymbol` in `apps/docs/src/components/tables/generated-api.ts`: a symbol
 * belongs to the styled UI layer when any of its entities lives under `packages/ui/src`.
 * The generator emits paths relative to the repo root, so UI entities start with
 * `packages/ui/src/` while aria entities start with `packages/aria/`.
 */
function isUiSymbol(symbol: { props?: Entity; emits?: Entity; slots?: Entity }): boolean {
  return [symbol.props, symbol.emits, symbol.slots]
    .filter((entry): entry is Entity => Boolean(entry))
    .some(entry => entry.sourcePath?.startsWith('packages/ui/src/') ?? false);
}

/** `ui`/`chart`/`admin` components are re-exported with an `S` prefix. */
const PACKAGE_PREFIX: Record<string, string> = { ui: 'S', chart: 'S', admin: 'S' };

function toPackageDisplayName(symbolName: string, pkg: string): string {
  const prefix = PACKAGE_PREFIX[pkg];

  if (!prefix || symbolName.startsWith(prefix)) {
    return symbolName;
  }

  return `${prefix}${symbolName}`;
}

function formatDisplayName(name: string, typeParameters: string[]): string {
  return typeParameters.length ? `${name}<${typeParameters.join(', ')}>` : name;
}

/**
 * The generator already resolved each declaration's own type parameters, so the
 * entity's `typeParameters` are re-attached verbatim here.
 */
function resolveTypeParameters(typeParameters: string[] | undefined): string[] {
  return typeParameters ?? [];
}

/**
 * Collapses `import("pkg").Name` fragments to the bare type name so the rendered
 * cell reads like the API docs rather than a module signature. The ubean build does
 * this by re-reading the original sources (`getSourceMemberType`), which is out of
 * scope here — the shorthand is close enough for a visual comparison.
 */
function formatTypeText(value: string | undefined): string {
  if (!value) {
    return '—';
  }

  return value.replace(/import\((?:"|')([^"']+)(?:"|')\)\./g, '');
}

function getMemberType(entity: Entity, member: NonNullable<Entity['members']>[number]): string {
  const matched = member.referencedTypes?.find(
    referenced => referenced.type === member.type || member.type === referenced.name
  );

  if (matched) {
    return formatDisplayName(matched.name, resolveTypeParameters(matched.typeParameters));
  }

  return formatTypeText(member.type);
}

function getCallableParameters(entity: Entity, parameters: string | undefined): string {
  if (!parameters) {
    return '—';
  }

  if (entity.kind === 'emits') {
    const normalized = parameters.replace(/^\[(.+)\]$/u, '$1');
    const match = normalized.match(/^[^:]+:\s*(.+)$/);

    return formatTypeText(match?.[1] ?? normalized);
  }

  const slotMatch = parameters.match(/^\(\(props:\s*(.+?)\)\s*=>\s*any\)\s*\|\s*undefined$/);

  if (slotMatch) {
    return formatTypeText(slotMatch[1]);
  }

  if (parameters === '(() => any) | undefined') {
    return '—';
  }

  return formatTypeText(parameters);
}

function createRows(entity: Entity | undefined, locale: Record<string, unknown>): ApiRow[] {
  if (!entity) {
    return [];
  }

  if (entity.kind === 'props') {
    return (entity.members ?? []).map(member => ({
      name: member.name,
      required: member.required,
      default: formatDefault(member.default),
      type: getMemberType(entity, member),
      description: readMessage(locale, member.descriptionKey) ?? member.description ?? '—',
      descriptionKey: member.descriptionKey
    }));
  }

  return (entity.callables ?? []).map(callable => ({
    name: callable.name,
    required: callable.required,
    parameters: getCallableParameters(entity, callable.parameters),
    description: readMessage(locale, callable.descriptionKey) ?? callable.description ?? '—',
    descriptionKey: callable.descriptionKey
  }));
}

/**
 * Mirrors `getComponentApiSections` in `apps/docs/src/components/tables/generated-api.ts`:
 * the styled UI layer and the aria layer are rendered as separate sections, and the
 * symbol display name gains the package's `S` prefix when it does not have it yet.
 */
export async function loadComponentApiSections(component: string, locale: string): Promise<ApiLayerSection[]> {
  const document = await loadDocument(component);

  if (!document) {
    return [];
  }

  const messages = await loadApiLocale(locale);
  const pkg = packageByComponent.get(component) ?? 'ui';
  const entries = Object.entries(document.symbols);

  const sections: ApiSymbolSection[] = entries.map(([symbolName, symbol]) => {
    const anchor = symbol.props ?? symbol.emits ?? symbol.slots;
    const displayName = isUiSymbol(symbol) || pkg !== 'ui' ? toPackageDisplayName(symbolName, pkg) : symbolName;

    return {
      key: symbolName,
      name: symbolName,
      displayName: formatDisplayName(displayName, resolveTypeParameters(anchor?.typeParameters)),
      propsRows: createRows(symbol.props, messages),
      emitsRows: createRows(symbol.emits, messages),
      slotsRows: createRows(symbol.slots, messages)
    };
  });

  if (pkg !== 'ui') {
    return [{ key: pkg, symbols: sections }];
  }

  const uiSymbols = entries
    .filter(([, symbol]) => isUiSymbol(symbol))
    .map(([name]) => sections.find(section => section.key === name)!);
  const ariaSymbols = entries
    .filter(([, symbol]) => !isUiSymbol(symbol))
    .map(([name]) => sections.find(section => section.key === name)!);

  return [
    { key: 'ui', symbols: uiSymbols },
    { key: 'aria', symbols: ariaSymbols }
  ].filter(layer => layer.symbols.length > 0);
}

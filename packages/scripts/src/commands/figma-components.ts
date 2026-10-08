import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { isJsonObject, readJsonObject } from '../shared/json';
import type { JsonObject } from '../shared/json';

/**
 * The component prop vocabulary, projected from the generated API data
 * (`pnpm sui gen api`) for the Figma package in docs/design/figma.md.
 *
 * This is deliberately **not** a variant matrix. The API data describes each
 * symbol's props, and `@soybeanjs/cva` recipes constrain those props with
 * compound variants (a `solid` + `circle` button has no shadow, for instance)
 * that never appear in the type surface. So what ships here is the closed value
 * set of every multi-valued prop — the vocabulary a designer builds Figma
 * variant properties from — with the recipe's cross-constraints left to the
 * components themselves, which remain the source of truth.
 */

/** the generated API directory this reads, relative to the repo root. */
export const FIGMA_API_DIR = 'apps/docs/src/generated/api/ui';

/** component name → prop name → the literal values the generated API reports. */
export type FigmaComponentProps = Record<string, Record<string, string[]>>;

/** a component API document, keyed by its file name without the extension. */
export type ComponentApiDocument = {
  name: string;
  value: JsonObject;
};

const STRING_LITERAL = /'([^']*)'/g;

/**
 * whether a resolved type is a union of string literals.
 *
 * The whole type must be the union — `'a' | 'b' | SomeInterface` is rejected —
 * so an open set is never mistaken for a closed one. Types are single-line in
 * the generated data, which `.` relies on.
 */
function isLiteralUnion(resolvedType: string): boolean {
  return /^'[^']*'(?:\s*\|\s*'[^']*')+$/.test(resolvedType.trim());
}

function unionValues(resolvedType: string): string[] {
  return Array.from(resolvedType.matchAll(STRING_LITERAL), match => match[1] ?? '');
}

/**
 * every resolved type reported for a prop, in priority order.
 *
 * The direct `type` string comes first because it is the authoritative one; the
 * referenced ones fill in aliased unions (a prop declared as `ThemeColor` has an
 * empty `type` string but carries the union under `referencedTypes`).
 */
function resolvedTypes(member: JsonObject): string[] {
  const referenced = Array.isArray(member.referencedTypes) ? member.referencedTypes.filter(isJsonObject) : [];
  const candidates: unknown[] = [member.type, ...referenced.map(entry => entry.resolvedType)];

  return candidates.filter((candidate): candidate is string => typeof candidate === 'string');
}

/** the closed value set of one prop, or `null` when the prop has no union type. */
function memberValues(member: JsonObject): string[] | null {
  const union = resolvedTypes(member).find(isLiteralUnion);

  return union ? unionValues(union) : null;
}

function symbolProps(symbol: JsonObject): Record<string, string[]> {
  const props = symbol.props;

  if (!isJsonObject(props) || !Array.isArray(props.members)) {
    return {};
  }

  return props.members.filter(isJsonObject).reduce<Record<string, string[]>>((accumulator, member) => {
    const name = typeof member.name === 'string' ? member.name : '';
    const values = name === '' ? null : memberValues(member);

    return values ? { ...accumulator, [name]: values } : accumulator;
  }, {});
}

/** union the props of every symbol of a family (`Button`, `ButtonGroup`, `ButtonIcon`). */
function documentProps(document: JsonObject): Record<string, string[]> {
  const symbols = document.symbols;

  if (!isJsonObject(symbols)) {
    return {};
  }

  return Object.values(symbols).filter(isJsonObject).map(symbolProps).reduce(mergeProps, {});
}

function mergeProps(accumulator: Record<string, string[]>, props: Record<string, string[]>): Record<string, string[]> {
  return Object.entries(props).reduce(
    (merged, [name, values]) => ({ ...merged, [name]: Array.from(new Set([...(merged[name] ?? []), ...values])) }),
    accumulator
  );
}

/**
 * drop single-valued props (nothing to vary) and order everything by name, so
 * the output is stable regardless of the API data's own ordering.
 */
function closedValueSets(props: Record<string, string[]>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(props)
      .filter(([, values]) => values.length > 1)
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

/** project the generated API documents into a component → prop → values map. */
export function collectComponentProps(documents: ComponentApiDocument[]): FigmaComponentProps {
  return Object.fromEntries(
    documents
      .map(({ name, value }) => [name, closedValueSets(documentProps(value))] as const)
      .filter(([, props]) => Object.keys(props).length > 0)
      .sort(([left], [right]) => left.localeCompare(right))
  );
}

/** read every generated API document of the UI package. */
export async function readComponentApiDocuments(rootDir: string): Promise<ComponentApiDocument[]> {
  const apiDir = path.join(rootDir, FIGMA_API_DIR);
  const fileNames = await readdir(apiDir).catch(() => null);

  if (!fileNames) {
    throw new Error(`[sui gen figma] ${FIGMA_API_DIR} is missing. Run \`pnpm sui gen api\` first.`);
  }

  const componentFiles = fileNames
    .filter(fileName => fileName.endsWith('.json') && fileName !== 'index.json')
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    componentFiles.map(async fileName => ({
      name: fileName.slice(0, -'.json'.length),
      value: await readJsonObject(path.join(apiDir, fileName))
    }))
  );
}

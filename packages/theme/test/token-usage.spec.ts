import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALPHA_TOKENS, LITERAL_DEFAULTS, PALETTE_LEVELS, ROLE_RAMP_ROLES, SEMANTIC_TOKENS } from '../src/index';

/**
 * The token naming contract, enforced across the workspace (docs/theme.md §4.4,
 * acceptance §7-14): the **theme engine's** token vocabulary is unprefixed —
 * `--background`, `--card`, `--radius`, `--chart-1` — so a `var(--vean-background)`
 * is a stale reference. The prefix removal is scoped to that layer: the library's
 * own component-scoped variables (`--vean-sidebar-width`, `--vean-layout-header-height`,
 * `--vean-scrollbar-*`, aria's measurement variables) keep the `--vean-` namespace,
 * which is why this scan only flags *token* names and not the prefix itself. A stale reference is an invalid computed value, so the declaration
 * is dropped **silently** (that is how the docs' chart series once ended up
 * stroked with `stroke: none`); this scan keeps the realignment from drifting
 * back one file at a time.
 *
 * The palette layer (`--indigo-500`, `--white`) and third-party namespaces
 * (`--color-*`, `--un-*`, `--ts-*`) are never flagged; the storage key and the
 * style element id (`__VEAN_THEME`, `vean-theme`) are not variables at all and
 * are out of scope. `docs/theme.md` (outside the scanned roots) is where the
 * migration quotes the pre-realignment names.
 *
 * Scanned: the packages' sources and the docs app's authored files. Skipped:
 * `apps/docs/src/generated` (derived data, may quote pre-v2 code).
 */

/** the workspace root: walk up from the runner's cwd until the workspace file shows up. */
const findRoot = (): string => {
  let dir = process.cwd();

  while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
    const parent = dirname(dir);

    if (parent === dir) {
      throw new Error('workspace root not found');
    }

    dir = parent;
  }

  return dir;
};

const ROOT = findRoot();

/** the authored surfaces: what a consumer reads and copies. */
const SCANNED = ['packages/aria/src', 'packages/ui/src', 'packages/unocss/src', 'apps/docs/src'];

/** derived data, not hand-written: the generator may embed old snippets. */
const SKIPPED = ['apps/docs/src/generated'];

/**
 * The color-format scan adds the engine itself: the naming scan has to exclude it
 * (its literal table *is* the bare `var(--radius)` form), but its own examples and
 * comments should still show the unified color shape. Test fixtures stay out on
 * purpose — a spec may hold an off-format value to prove the parser normalises it.
 */
const COLOR_SCANNED = [...SCANNED, 'packages/theme/src'];

const SUFFIXES = ['.ts', '.vue', '.md', '.css'];

/** the engine prefix that the realignment removed. */
const LEGACY_PREFIX = 'vean';

/** every token name the legacy prefixed form would have used. */
const LEGACY_NAMES = new Set<string>(
  [
    ...SEMANTIC_TOKENS,
    ...Object.keys(LITERAL_DEFAULTS),
    ...ALPHA_TOKENS.map(token => `${token}-alpha`),
    ...ROLE_RAMP_ROLES.flatMap(role => PALETTE_LEVELS.map(level => `${role}-${level}`))
  ].map(token => `${LEGACY_PREFIX}-${token}`)
);

const filesUnder = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return filesUnder(path);
    }

    return SUFFIXES.some(suffix => entry.name.endsWith(suffix)) ? [path] : [];
  });

/** `file:line var(--vean-token)` for every legacy-prefixed reference. */
const legacyReferencesIn = (file: string): string[] =>
  readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) =>
      [...line.matchAll(/var\(--([\w-]+)/gu)]
        .map(match => match[1] as string)
        .filter(name => LEGACY_NAMES.has(name))
        .map(name => `${relative(ROOT, file)}:${index + 1} var(--${name})`)
    );

/**
 * The unified color format (§4.1): percentage-bearing components carry a
 * `%`, so a complete color is literally the channel triple plus its function
 * wrapper — `hsl(238.732 83.529% 66.667%)`, `oklch(60% 0.2 250)`, `0 0% 100%` —
 * with no unitless/percentage mix to normalise. The `HSLColor` / `OKLCHColor`
 * types enforce it for typed literals; this catches the untyped ones (prose, data
 * tables, fixtures) before they teach a reader the wrong shape.
 *
 * Variable references (`hsl(var(--x) / 1)`), placeholders (`oklch(...)`) and
 * the type declarations themselves (`hsl(${number} …)`) are skipped.
 */
const offFormatColorsIn = (file: string): string[] =>
  readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, index) =>
      [...line.matchAll(/\b(hsl|oklch)\(([^)]*)\)/gu)]
        .filter(([, , body]) => (body as string).trim() !== '')
        .filter(([, , body]) => !(body as string).includes('var(') && !(body as string).includes('...'))
        .filter(([, , body]) => !(body as string).includes('${'))
        .filter(([, family, body]) => {
          const parts = (body as string).split('/')[0]?.trim().split(/\s+/u) ?? [];

          return family === 'hsl'
            ? parts.length >= 3 && (!parts[1]?.endsWith('%') || !parts[2]?.endsWith('%'))
            : !parts[0]?.endsWith('%');
        })
        .map(([literal]) => `${relative(ROOT, file)}:${index + 1} ${literal}`)
    );

describe('token naming contract (§4.4 / acceptance §7-14)', () => {
  it('references every token unprefixed (no legacy --vean-* references)', () => {
    const violations = SCANNED.flatMap(dir => filesUnder(join(ROOT, dir)))
      .filter(file => !SKIPPED.some(skip => file.includes(skip)))
      .flatMap(legacyReferencesIn);

    expect(violations).toEqual([]);
  });

  it('keeps the literal layer free of the legacy prefix in its own emitted form', () => {
    // 字面量层是唯一在源码里就写 `var(--radius)` 的地方（`calc(var(--radius) * k)`）：
    // 它是裸名契约的"正例"，改名前这里必须已经是裸名，否则整条半径刻度指向不存在的变量
    const prefixed = Object.entries(LITERAL_DEFAULTS)
      .filter(([, value]) => value.includes(`${LEGACY_PREFIX}-`))
      .map(([token]) => token);

    expect(prefixed).toEqual([]);
  });

  it('writes color literals in the unified percentage format', () => {
    const violations = COLOR_SCANNED.flatMap(dir => filesUnder(join(ROOT, dir)))
      .filter(file => !SKIPPED.some(skip => file.includes(skip)))
      .flatMap(offFormatColorsIn);

    expect(violations).toEqual([]);
  });
});

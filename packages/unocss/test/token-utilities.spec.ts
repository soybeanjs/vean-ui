import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createGenerator } from 'unocss';
import {
  ALPHA_TOKENS,
  LITERAL_DEFAULTS,
  PALETTE_KEYS,
  PALETTE_LEVELS,
  ROLE_RAMP_ROLES,
  SEMANTIC_TOKENS
} from '@vean/theme';
import { presetUi } from '../src/preset';

/**
 * The utility-resolution contract, enforced across the authored surfaces.
 *
 * UnoCSS **drops an unknown class silently**: no error, no warning, just a
 * missing declaration. That makes a stale token name (`bg-surface` after the
 * realignment, `bg-destructive-subtle` once the status roles were reduced)
 * invisible in review and in the type checker — the element simply renders
 * unstyled. This scan collects every utility in the library and the docs app
 * whose value is a real token name and asserts the adapter resolves each one.
 *
 * Not a duplicate of `@vean/theme`'s naming scan: that one proves the *names*
 * in the source are the current vocabulary; this one proves the *adapter* can
 * turn them into CSS (a name can be current and still unmapped — e.g. a token
 * added to `semantic.ts` but missing from a `theme.colors` family).
 */

/** the workspace root: walk up from the runner's cwd until the workspace file shows up. */
const findRoot = (): string => {
  let dir = process.cwd();

  while (!readdirSync(dir).includes('pnpm-workspace.yaml')) {
    const parent = dirname(dir);

    if (parent === dir) {
      throw new Error('workspace root not found');
    }

    dir = parent;
  }

  return dir;
};

const ROOT = findRoot();

/** the authored surfaces that write token utilities. */
const SCANNED = ['packages/ui/src', 'apps/docs/src'];

/** the utility prefixes whose value is a color / radius token. */
const PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'ring-offset',
  'fill',
  'stroke',
  'outline',
  'divide',
  'caret',
  'decoration',
  'shadow',
  'from',
  'via',
  'to'
];

const CANDIDATE = new RegExp(`\\b((?:${PREFIXES.join('|')})-[a-z][\\w-]*)`, 'g');

/**
 * CSS property names that read like a utility (`border-radius: …` in a
 * declaration or a comment). They are matched by the scan but are not classes.
 */
const NOT_A_UTILITY = new Set(['border-radius', 'border-width', 'border-color', 'text-align', 'shadow-color']);

/** every name the adapter can resolve a color for. */
const KNOWN = new Set<string>([
  ...SEMANTIC_TOKENS,
  ...ALPHA_TOKENS,
  ...Object.keys(LITERAL_DEFAULTS),
  ...ROLE_RAMP_ROLES.flatMap(role => PALETTE_LEVELS.map(level => `${role}-${level}`)),
  ...PALETTE_KEYS.flatMap(palette => PALETTE_LEVELS.map(level => `${palette}-${level}`)),
  'white',
  'black'
]);

const sourcesUnder = (dir: string): string[] =>
  readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap(entry => {
    const path = `${dir}/${entry.name}`;

    if (entry.isDirectory()) {
      return sourcesUnder(path);
    }

    return /\.(ts|vue)$/.test(entry.name) ? [readFileSync(join(ROOT, path), 'utf8')] : [];
  });

describe('utility resolution contract', () => {
  it('resolves every token utility the library and the docs use', async () => {
    const candidates = new Set<string>();

    SCANNED.flatMap(sourcesUnder).forEach(source =>
      [...source.matchAll(CANDIDATE)].forEach(([, utility]) => {
        const value = (utility as string).replace(new RegExp(`^(?:${PREFIXES.join('|')})-`), '');

        if (KNOWN.has(value) && !NOT_A_UTILITY.has(utility as string)) {
          candidates.add(utility as string);
        }
      })
    );

    const uno = await createGenerator({ presets: presetUi({}) } as never);
    const { css } = await uno.generate([...candidates].join(' '), { preflights: false });
    // 按选择器整体匹配（`.bg-card{`），不用子串：`text-destructive` 是
    // `text-destructive-foreground` 的子串，子串判定会让一条死类名蒙混过关
    const emitted = [...css.matchAll(/^\.([A-Za-z0-9_-]+)/gm)].map(match => match[1] as string);
    const unresolved = [...candidates].filter(utility => !emitted.includes(utility));

    // 扫描器本身也要有"确实扫到了东西"的下界，否则规则写错会静默变成空断言
    expect(candidates.size).toBeGreaterThan(50);
    expect(unresolved).toEqual([]);
  });
});

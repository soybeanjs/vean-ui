import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createGenerator } from 'unocss';
import { presetUi } from '@vean/unocss';
import { anchorVariants } from '../../../src/styles/anchor';
import { buttonIconVariants, buttonVariants } from '../../../src/styles/button';
import { hoverCardVariants } from '../../../src/styles/hover-card';
import { inputOtpVariants } from '../../../src/styles/input-otp';
import { navMenuVariants } from '../../../src/styles/nav-menu';
import { selectVariants } from '../../../src/styles/select';
import { toggleVariants } from '../../../src/styles/toggle';
import { treeNavVariants } from '../../../src/styles/tree-nav';

/**
 * The size vector owns every dimension it declares.
 *
 * UnoCSS emits one rule per utility and orders them by **escaped class name**
 * (lexicographic), not by value or intent — so `h-8` always beats `h-6`, `h-10`
 * and `h-12`, and `my-1` always beats `my-0.5`. A base/shape class that repeats a
 * property the `size` ladder also sets therefore wins for whichever rungs happen
 * to sort below it, and the ladder silently goes dead for those rungs.
 *
 * This spec scans the recipes and fails when the same slot declares the same
 * property twice: once outside the `size` ladder (slots / other variant branches)
 * and once inside it. Deliberate overrides use `!` (important) and are exempt,
 * because important wins the cascade regardless of order.
 */
const STYLES_DIR = path.join(process.cwd(), 'src/styles');
const SIZE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** a size-vector token: optional variant prefix + one dimension utility */
const DIMENSION_UTILITY =
  /^(min-h|max-h|h|min-w|max-w|w|size|p|px|py|pt|pb|ps|pe|pl|pr|-?m|-?mx|-?my|-?mt|-?mb|-?ms|-?me|-?ml|-?mr|gap|gap-x|gap-y|space-x|space-y|text)-(?:[\d.]+|\[[^\]]+\]|(?:\d?xs|sm|base|lg|\d?xl))$/;

const stripComments = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, block => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (match, head: string) => head + ' '.repeat(match.length - head.length));

const blockEnd = (source: string, openAt: number): number => {
  const open = source[openAt];
  const close = open === '{' ? '}' : open === '(' ? ')' : ']';
  let depth = 0;

  for (let i = openAt; i < source.length; i += 1) {
    const char = source[i];

    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      i += 1;

      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i += 1;
        i += 1;
      }

      continue;
    }

    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;

      if (depth === 0) return i;
    }
  }

  return source.length;
};

interface Entry {
  key: string;
  valueAt: number;
  endAt: number;
  text: string;
}

/** the `key: value` entries directly inside the object that opens at `openAt` */
const objectEntries = (source: string, openAt: number): Entry[] => {
  const end = blockEnd(source, openAt);
  const entries: Entry[] = [];
  let cursor = openAt + 1;

  while (cursor < end) {
    const keyMatch = /(^|[\s,{])(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*/g;
    keyMatch.lastIndex = cursor;

    const matched = keyMatch.exec(source);

    if (!matched || matched.index >= end) break;

    const key = matched[2] ?? matched[3] ?? matched[4];
    const valueAt = matched.index + matched[0].length;
    const closesBlock = '{['.includes(source[valueAt]);

    let endAt: number;

    if (closesBlock) {
      endAt = blockEnd(source, valueAt);
    } else {
      let scan = valueAt;

      while (scan < end && source[scan] !== ',') scan += 1;
      endAt = scan - 1;
    }

    entries.push({ key, valueAt, endAt, text: source.slice(valueAt, endAt + 1) });
    cursor = endAt + 1;
  }

  return entries;
};

/** the object opening at the first `<key>: {` in the source */
const sectionAt = (source: string, key: string): number => {
  const matched = new RegExp(`(^|[^A-Za-z])${key}\\s*:\\s*\\{`).exec(source);

  return matched ? source.indexOf('{', matched.index + matched[0].length - 1) : -1;
};

const classLiterals = (text: string): string[] =>
  [...text.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*)"|`([^`]*)`/g)].map(m => m[1] ?? m[2] ?? m[3] ?? '');

interface Token {
  prefix: string;
  property: string;
  raw: string;
}

/** the size-vector tokens of a slot expression, keeping any variant prefix */
const dimensionTokens = (text: string): Token[] => {
  const tokens: Token[] = [];

  for (const literal of classLiterals(text)) {
    for (const raw of literal.split(/\s+/)) {
      if (!raw || raw.startsWith('!')) continue;

      const parts = raw.split(':');
      const utility = parts.pop() ?? '';
      const matched = DIMENSION_UTILITY.exec(utility);

      if (!matched) continue;

      tokens.push({ prefix: parts.join(':'), property: `${matched[1]}|${parts.join(':')}`, raw });
    }
  }

  return tokens;
};

interface Conflict {
  file: string;
  slot: string;
  property: string;
  outside: string;
  ladder: string[];
}

const scanRecipe = (file: string, source: string): Conflict[] => {
  const variantsAt = sectionAt(source, 'variants');

  if (variantsAt < 0) return [];

  const slotsAt = sectionAt(source, 'slots');
  const slots: Record<string, string> =
    slotsAt >= 0 ? Object.fromEntries(objectEntries(source, slotsAt).map(e => [e.key, e.text])) : { root: '""' };

  const sizeEntry = objectEntries(source, variantsAt).find(e => e.key === 'size');

  if (!sizeEntry || source[sizeEntry.valueAt] !== '{') return [];

  const ladder = new Map<string, Record<string, string>>();

  for (const size of objectEntries(source, sizeEntry.valueAt)) {
    if (!SIZE_KEYS.includes(size.key as (typeof SIZE_KEYS)[number])) continue;

    const perSlot: Record<string, string> =
      source[size.valueAt] === '{'
        ? Object.fromEntries(objectEntries(source, size.valueAt).map(e => [e.key, e.text]))
        : { root: size.text };

    ladder.set(size.key, perSlot);
  }

  if (ladder.size === 0) return [];

  const conflicts: Conflict[] = [];
  /** branch declarations that apply independently of `size` (e.g. `shape`) */
  const outside: { slot: string; text: string; origin: string }[] = Object.entries(slots).map(([slot, text]) => ({
    slot,
    text,
    origin: `slots.${slot}`
  }));

  for (const variant of objectEntries(source, variantsAt)) {
    if (variant.key === 'size' || source[variant.valueAt] !== '{') continue;

    for (const branch of objectEntries(source, variant.valueAt)) {
      const perSlot =
        source[branch.valueAt] === '{'
          ? objectEntries(source, branch.valueAt).map(e => [e.key, e.text] as const)
          : ([['root', branch.text]] as const);

      for (const [slot, text] of perSlot) outside.push({ slot, text, origin: `variants.${variant.key}.${branch.key}` });
    }
  }

  for (const declared of outside) {
    const outsideTokens = dimensionTokens(declared.text);

    if (outsideTokens.length === 0) continue;

    for (const [size, perSlot] of ladder) {
      const ladderText = perSlot[declared.slot];

      if (!ladderText) continue;

      const ladderTokens = dimensionTokens(ladderText);

      for (const token of outsideTokens) {
        const clash = ladderTokens.filter(
          candidate => candidate.property === token.property && candidate.raw !== token.raw
        );

        if (clash.length === 0) continue;

        conflicts.push({
          file,
          slot: `${declared.origin} × size=${size}`,
          property: token.property,
          outside: token.raw,
          ladder: clash.map(candidate => candidate.raw)
        });
      }
    }
  }

  return conflicts;
};

const generate = async (classes: string): Promise<string> => {
  const uno = await createGenerator({ presets: presetUi({}) as never });
  const { css } = await uno.generate(classes, { preflights: false });

  return css;
};

const escapeClass = (className: string): string => className.replace(/[.!\\/[\]]/g, char => `\\${char}`);

const bodyOf = (css: string, className: string): string => {
  const at = css.indexOf(`.${escapeClass(className)}{`);

  if (at < 0) return '';

  const open = css.indexOf('{', at);
  const close = css.indexOf('}', open);

  return open < 0 || close < 0 ? '' : css.slice(open + 1, close);
};

/** which of `classes` wins `property` in the real preset (important first, then emission order) */
const winningClass = async (classes: string[], property: string): Promise<string | undefined> => {
  const unique = [...new Set(classes.flatMap(value => value.split(/\s+/)).filter(Boolean))];

  if (unique.length === 0) return undefined;

  const css = await generate(unique.join(' '));
  const declares = (className: string): boolean => new RegExp(`(^|;)\\s*${property}\\s*:`).test(bodyOf(css, className));
  const declaring = unique.filter(declares);
  const important = declaring.filter(className => bodyOf(css, className).includes('!important'));
  const pool = important.length > 0 ? important : declaring;

  return pool.sort((a, b) => css.indexOf(`.${escapeClass(a)}{`) - css.indexOf(`.${escapeClass(b)}{`)).at(-1);
};

describe('size vector — no property is declared twice', () => {
  it('keeps the size ladder the only source of the dimensions it controls', () => {
    const files = fs.readdirSync(STYLES_DIR).filter(name => name.endsWith('.ts'));
    const conflicts: Conflict[] = [];
    let scanned = 0;

    for (const file of files) {
      const source = stripComments(fs.readFileSync(path.join(STYLES_DIR, file), 'utf8'));
      const found = scanRecipe(file, source);

      if (found.length > 0) scanned += 1;
      conflicts.push(...found);
    }

    // the scan must actually parse the recipes; a silently broken parser would
    // otherwise let this spec pass with zero coverage
    expect(files.length).toBeGreaterThan(80);
    expect(scanned).toBe(0);

    const report = conflicts.map(
      conflict =>
        `${conflict.file} → ${conflict.slot} → ${conflict.property}: outside=${conflict.outside} ladder=${conflict.ladder.join('|')}`
    );

    expect(report).toEqual([]);
  });
});

describe('size vector — the ladder wins the cascade', () => {
  it('gives square/circle buttons the size row of the height column', async () => {
    const rows = [
      { size: 'xs', box: ['h-6', 'w-6'] },
      { size: 'sm', box: ['h-7', 'w-7'] },
      { size: 'md', box: ['h-8', 'w-8'] },
      { size: 'lg', box: ['h-9', 'w-9'] },
      { size: 'xl', box: ['h-10', 'w-10'] },
      { size: '2xl', box: ['h-12', 'w-12'] }
    ] as const;
    const failures: string[] = [];

    for (const { size, box } of rows) {
      for (const shape of ['square', 'circle'] as const) {
        const classes = buttonVariants({ size, shape }).split(/\s+/);
        const toggle = toggleVariants({ size, shape }).split(/\s+/);

        if ((await winningClass(classes, 'height')) !== box[0]) failures.push(`button ${size}/${shape} height`);
        if ((await winningClass(classes, 'width')) !== box[1]) failures.push(`button ${size}/${shape} width`);
        if ((await winningClass(classes, 'padding')) !== 'p-0') failures.push(`button ${size}/${shape} padding`);
        if ((await winningClass(toggle, 'height')) !== box[0]) failures.push(`toggle ${size}/${shape} height`);
        if ((await winningClass(toggle, 'width')) !== box[1]) failures.push(`toggle ${size}/${shape} width`);
        if ((await winningClass(toggle, 'padding')) !== 'p-0') failures.push(`toggle ${size}/${shape} padding`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('keeps the icon-button variant sizing to its icon', async () => {
    const failures: string[] = [];
    const rows = [
      { size: 'xs', padding: 'p-0.75' },
      { size: 'md', padding: 'p-1' },
      { size: '2xl', padding: 'p-1.75' }
    ] as const;

    for (const { size, padding } of rows) {
      const classes = buttonIconVariants({ size }).split(/\s+/);

      // `fitContent: true` owns the box (w-fit/h-fit) and keeps its own padding,
      // which is the touch target of an icon-only button.
      if ((await winningClass(classes, 'height')) !== 'h-fit') failures.push(`icon ${size} height`);
      if ((await winningClass(classes, 'width')) !== 'w-fit') failures.push(`icon ${size} width`);
      if ((await winningClass(classes, 'padding')) !== padding) failures.push(`icon ${size} padding`);
    }

    expect(failures).toEqual([]);
  });

  it('lets the ladder drive the widths, gaps and offsets it owns', async () => {
    const failures: string[] = [];
    const check = async (label: string, classes: string, property: string, expected: string): Promise<void> => {
      const winner = await winningClass([classes], property);

      if (winner !== expected) failures.push(`${label}: ${property} → ${winner}, expected ${expected}`);
    };

    await check('hover-card xs width', hoverCardVariants({ size: 'xs' }).popup, 'width', 'w-48');
    await check('select 2xl separator margin', selectVariants({ size: '2xl' }).separator, 'margin-top', 'my-1.75');
    await check('anchor xs root gap', anchorVariants({ size: 'xs' }).root, 'gap', 'gap-0.5');
    await check('anchor 2xl link gap', anchorVariants({ size: '2xl' }).link, 'gap', 'gap-3.5');
    await check('anchor xs indicator', anchorVariants({ size: 'xs' }).indicator, 'width', 'size-1');
    await check('input-otp 2xl caret', inputOtpVariants({ size: '2xl' }).caret, 'height', 'h-7');
    await check('tree-nav lg item padding', treeNavVariants({ size: 'lg' }).item, 'padding-top', 'py-1.5');
    await check('nav-menu xs subTrigger gap', navMenuVariants({ size: 'xs' }).subTrigger, 'gap', 'gap-1.5');

    expect(failures).toEqual([]);
  });
});

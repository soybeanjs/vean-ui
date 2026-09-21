import { describe, expect, it } from 'vitest';
import { createGenerator } from 'unocss';
import { presetUi } from '@vean/unocss';
import type { ThemeSize } from '@/theme';
import { fieldMinSize, fieldSize } from '../../../src/styles/_field';

/**
 * The control ladder (docs/space-control-scale.md §1.6).
 *
 * `fieldSize` / `fieldMinSize` are the library's control-height policy: one row per
 * size, with height + horizontal padding + gap + text from the same rung. The heights
 * are plain numeric heights (24/28/32/36/40/48px on the 4px grid) and only padding/gap
 * read a theme variable (`calc(var(--spacing-unit) * k)`). This test renders every row
 * through the real preset and pins those values, so a silent 1px drift in the ladder
 * fails here instead of showing up in the browser.
 */

const generate = async (classes: string): Promise<string> => {
  const uno = await createGenerator({ presets: presetUi({}) as never });
  const { css } = await uno.generate(classes, { preflights: false });

  return css.replace(/\n+/g, ' ');
};

/**
 * the documented ladder: height / padding-x / gap px per size, plus the type rung.
 *
 * The size column is a plain `text-*` class (no theme variable behind it since
 * decision #25): `xs`→`2xs`, `sm`→`xs`, `md`→`sm` … and the resolved values are
 * UnoCSS's own tuples plus the three small rungs the adapter adds.
 */
const LADDER: { size: ThemeSize; height: number; padding: number; gap: number; text: string }[] = [
  { size: 'xs', height: 24, padding: 6, gap: 4, text: 'text-2xs' },
  { size: 'sm', height: 28, padding: 8, gap: 6, text: 'text-xs' },
  { size: 'md', height: 32, padding: 10, gap: 8, text: 'text-sm' },
  { size: 'lg', height: 36, padding: 12, gap: 10, text: 'text-base' },
  { size: 'xl', height: 40, padding: 14, gap: 12, text: 'text-lg' },
  { size: '2xl', height: 48, padding: 16, gap: 14, text: 'text-xl' }
];

/**
 * the spacing-grid value of a px length (`px-2.5` → `calc(... * 2.5)`): coefficient
 * 1 emits the bare unit reference, the same rule the adapter uses.
 */
/** the resolved font size of a type rung: our three rungs, then UnoCSS's own scale. */
const TYPE_SCALE: Record<string, string> = {
  'text-2xs': '0.625rem',
  'text-xs': '0.75rem',
  'text-sm': '0.875rem',
  'text-base': '1rem',
  'text-lg': '1.125rem',
  'text-xl': '1.25rem'
};

const fontSizeOf = (utility: string): string => TYPE_SCALE[utility] as string;

const gridValue = (px: number): string => {
  const coefficient = px / 4;

  return coefficient === 1 ? 'var(--spacing-unit)' : `calc(var(--spacing-unit) * ${coefficient})`;
};

describe('control ladder — one row per size', () => {
  it('renders the documented height / padding / gap / text per size', async () => {
    const failures: string[] = [];

    for (const { size, height, padding, gap, text } of LADDER) {
      const css = await generate(fieldSize[size]);
      const expected = [
        `height:${height / 16}rem`,
        `padding-left:${gridValue(padding)}`,
        `padding-right:${gridValue(padding)}`,
        `gap:${gridValue(gap)}`,
        `font-size:${fontSizeOf(text)}`
      ];
      const missing = expected.filter(declaration => !css.includes(declaration));

      if (missing.length > 0) {
        failures.push(`${size}: missing ${JSON.stringify(missing)} in ${css}`);
      }

      expect(fieldSize[size], `${size}: text token`).toContain(text);
    }

    expect(failures).toEqual([]);
  });

  it('keeps `fieldMinSize` on the same rows with `min-h-*`', async () => {
    const failures: string[] = [];

    for (const { size, height } of LADDER) {
      const keep = `min-height:${height / 16}rem`;

      if (!(await generate(fieldMinSize[size])).includes(keep)) {
        failures.push(`${size}: ${keep}`);
      }

      // 与 `fieldSize` 同值，只换成最小高度
      expect(fieldMinSize[size]).toBe(fieldSize[size].replace(/^h-/, 'min-h-'));
    }

    expect(failures).toEqual([]);
  });

  it('takes heights from UnoCSS’s numeric grid and padding/gap from the theme unit', async () => {
    const css = await generate(fieldSize.md);

    // 高度：数字 height 刻度（读 `theme.height`，随 `size` 的根字号缩放），不经过间距单位
    expect(css).toContain('height:2rem');
    // padding / gap：间距族的网格单位
    expect(css).toContain('padding-left:calc(var(--spacing-unit) * 2.5)');
    expect(css).toContain('gap:calc(var(--spacing-unit) * 2)');
    // 字号不进主题：`text-sm` 直接取 UnoCSS 的元组
    expect(css).toContain('font-size:0.875rem');
    // 控件高度不是刻度族（docs/space-control-scale.md §3.1）：这些类名不产出任何声明
    const removed = await generate('h-control-md min-h-control-md size-control-md');

    expect(removed).not.toContain('control-');
  });
});

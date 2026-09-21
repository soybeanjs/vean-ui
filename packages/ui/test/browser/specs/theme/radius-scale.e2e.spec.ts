import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { renderComponent } from '../../shared/render';

/**
 * The radius ladder in a real engine (docs/theme.md §3.11, space-control-scale.md §2.2).
 *
 * The bug this guards can only be seen here: a negative `border-radius` is an
 * invalid computed value, so the declaration is dropped and the browser silently
 * renders `0` — the emitted CSS is valid text either way. Under the old
 * "seed ± offset" ladder, `radius: 'xs'` made `rounded-2xs`/`rounded-xs` compute to
 * `0px` (sharp corners), which no assertion on the emitted strings would catch.
 *
 * The fixture styles itself with `var(--radius-*)` inline instead of the
 * `rounded-*` utilities: UnoCSS classes that only appear in a spec file are not
 * generated into the test stylesheet, and the variable chain is what this test is
 * actually about (the utility → variable mapping is covered in @vean/unocss).
 */

const rungs = ['2xs', 'xs', 'sm', 'md', 'lg', 'none'] as const;

const RungProbe = defineComponent({
  name: 'RadiusRungProbe',
  setup() {
    return () =>
      h(
        'div',
        { 'data-probe': 'root' },
        rungs.map(rung =>
          h('div', {
            'data-rung': rung,
            style: `border-radius: var(--radius-${rung}); width: 10px; height: 10px; background: currentColor`
          })
        )
      );
  }
});

/** the computed `border-radius` of each rung, in px (`0` when the declaration was dropped). */
const radiiOf = (): Record<string, number> => {
  const of = (rung: string): number => {
    const node = document.querySelector(`[data-rung="${rung}"]`);

    return node ? parseFloat(getComputedStyle(node).borderRadius) || 0 : Number.NaN;
  };

  return Object.fromEntries(rungs.map(rung => [rung, of(rung)])) as Record<string, number>;
};

describe('radius ladder (e2e)', () => {
  it('computes a positive, increasing radius at every preset — including the smallest', async () => {
    // `2xs` / `xs` are the presets whose bottom rungs used to collapse to `0px`
    for (const radius of ['2xs', 'xs', 'md', '2xl'] as const) {
      const { unmount } = await renderComponent(RungProbe, { withTheme: { radius } });
      const radii = radiiOf();

      expect(radii['2xs'], `${radius}: rounded-2xs`).toBeGreaterThan(0);
      expect(radii.xs, `${radius}: rounded-xs`).toBeGreaterThan(radii['2xs'] as number);
      expect(radii.sm, `${radius}: rounded-sm`).toBeGreaterThan(radii.xs as number);
      expect(radii.md, `${radius}: rounded-md`).toBeGreaterThan(radii.sm as number);
      expect(radii.lg, `${radius}: rounded-lg`).toBeGreaterThan(radii.md as number);
      // 刻度与极值仍然分离：`none` 是真正的直角
      expect(radii.none, `${radius}: rounded-none`).toBe(0);

      unmount();
    }
  });

  it('keeps the default seed on the documented px values', async () => {
    const { unmount } = await renderComponent(RungProbe, { withTheme: {} });
    const radii = radiiOf();

    // 默认种子 0.5rem（8px）：2 / 4 / 6 / 8 / 10px，逐档落在 0.125rem 网格上
    expect(radii['2xs']).toBe(2);
    expect(radii.xs).toBe(4);
    expect(radii.sm).toBe(6);
    expect(radii.md).toBe(8);
    expect(radii.lg).toBe(10);

    unmount();
  });
});

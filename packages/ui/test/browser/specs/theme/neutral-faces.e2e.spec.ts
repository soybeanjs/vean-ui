import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { renderComponent } from '../../shared/render';

/**
 * 中性交互面的**实测色差**契约（docs/design/theme.md §3.2 / §3.9）。
 *
 * `muted` / `accent` / `secondary` 同档（对齐 shadcn 默认）之后，"静止实心 fill → 交互实心 fill"
 * 这类配方会渲染成**完全相同的颜色**，而类名字符串依然正确 —— 只有真实引擎能看出来。
 * 所以这里断言计算后的**有效背景色**（自身 background 在其不透明祖先上的 alpha 复合）之差：
 * 任意相邻态 Δ = 0 都视为坏味道（`toggle.soft` 的 ON/OFF、斑马纹表格行的 hover 都曾踩这条）。
 *
 * 探针刻意用内联 `hsl(var(--token) / alpha)` 复刻配方的取值，而不是挂载真实组件：
 * 量的是**令牌层**的色差（组件的类名契约由 `test/specs/styles/neutral-faces.spec.ts` 守），
 * 这样既不依赖组件状态机的时序，也不依赖“规格文件里独有的 UnoCSS 工具类是否被生成”。
 */

type Rgba = readonly [number, number, number, number];
type Rgb = readonly [number, number, number];

const parseRgb = (value: string): Rgba => {
  const numbers = (value.match(/[\d.]+/g) ?? []).map(Number);
  const [r = 0, g = 0, b = 0, a = 1] = numbers;

  return [r, g, b, a];
};

const composite = (foreground: Rgba, background: Rgba): Rgb => {
  const alpha = foreground[3];

  return [0, 1, 2].map(index => foreground[index] * alpha + (background[index] ?? 0) * (1 - alpha)) as unknown as Rgb;
};

/** the effective (composited) background colour of a probe, over its first opaque ancestor. */
const effectiveColor = (selector: string): Rgb => {
  const node = document.querySelector<HTMLElement>(selector);

  if (!node) {
    throw new Error(`missing probe: ${selector}`);
  }

  const own = parseRgb(getComputedStyle(node).backgroundColor);
  let ancestor = node.parentElement;

  while (ancestor) {
    const background = parseRgb(getComputedStyle(ancestor).backgroundColor);

    if (background[3] === 1) {
      return composite(own, background);
    }

    ancestor = ancestor.parentElement;
  }

  return composite(own, [255, 255, 255, 1]);
};

const deltaOf = (a: Rgb, b: Rgb): number => Math.max(...a.map((channel, index) => Math.abs(channel - (b[index] ?? 0))));

/**
 * the provider writes the token block on mount; reading computed colours before that
 * lands makes every `hsl(var(--…))` declaration drop (unset `var()` → invalid), and two
 * dropped declarations compare equal — a Δ = 0 that is really "no theme yet".
 */
const waitForThemeTokens = async (): Promise<void> => {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()) {
      return;
    }

    await new Promise(resolve => {
      setTimeout(resolve, 16);
    });
  }

  throw new Error('theme token block was not applied');
};

/**
 * the ladder the recipes use: rest `accent/40` → hover `accent/60` → on `accent`,
 * laid out on the page surface so the composites match the real context.
 */
const LADDER = [
  { probe: 'rest', style: 'background: hsl(var(--muted) / 0.4)' },
  { probe: 'hover', style: 'background: hsl(var(--accent) / 0.6)' },
  { probe: 'on', style: 'background: hsl(var(--accent))' }
] as const;

const LadderProbe = defineComponent({
  name: 'NeutralLadderProbe',
  setup() {
    return () =>
      h(
        'div',
        { 'data-probe': 'page', style: 'background: hsl(var(--background))' },
        LADDER.map(rung => h('div', { 'data-probe': rung.probe, style: `${rung.style}; width: 40px; height: 8px` }))
      );
  }
});

const SidebarSurfaceProbe = defineComponent({
  name: 'SidebarSurfaceProbe',
  setup() {
    return () =>
      h('div', { 'data-probe': 'sidebar-surface', style: 'background: hsl(var(--sidebar))' }, [
        h('div', {
          'data-probe': 'sidebar-accent-face',
          style: 'background: hsl(var(--sidebar-accent)); width: 40px; height: 8px'
        }),
        h('div', {
          'data-probe': 'sidebar-wash',
          style: 'background: hsl(var(--sidebar-accent-foreground) / 0.1); width: 40px; height: 8px'
        })
      ]);
  }
});

describe('neutral interaction faces (e2e)', () => {
  it('keeps the neutral interaction ladder a real, monotonic step in both modes', async () => {
    const { unmount } = await renderComponent(LadderProbe, { withTheme: {} });
    const dark = document.documentElement.classList.contains('dark');

    await waitForThemeTokens();

    try {
      (['light', 'dark'] as const).forEach(mode => {
        document.documentElement.classList.toggle('dark', mode === 'dark');

        const rest = effectiveColor('[data-probe="rest"]');
        const hover = effectiveColor('[data-probe="hover"]');
        const on = effectiveColor('[data-probe="on"]');

        // 同档折叠后唯一可用的中性阶梯：洗色 → 半透明 → 实心，逐级变“重”
        // （亮色下是渐深，暗色下是渐亮——方向由底色决定，所以只断言单调性）。
        //
        // 刻度上限是这条设计的固有属性：亮色页面底 `{b}.50` 与填充 `{b}.100` 只差 6 个
        // sRGB 单位，三档平分后不可能每档都 ≥3。所以**状态判据是 OFF → ON**（≥3），
        // hover 只要求“不是 Δ = 0”（细步，落在 `card` 白底上时约 4）。
        expect(deltaOf(rest, on), `${mode}: rest ${rest} vs on ${on}`).toBeGreaterThanOrEqual(3);
        expect(deltaOf(rest, hover), `${mode}: rest ${rest} vs hover ${hover}`).toBeGreaterThan(0);

        const monotonic = (rest[0] < hover[0] && hover[0] < on[0]) || (rest[0] > hover[0] && hover[0] > on[0]);

        expect(monotonic, `${mode}: rest ${rest} / hover ${hover} / on ${on}`).toBe(true);
      });
    } finally {
      document.documentElement.classList.toggle('dark', dark);
      unmount();
    }
  });

  it('keeps a visible sidebar interaction wash in dark mode', async () => {
    const { unmount } = await renderComponent(SidebarSurfaceProbe, { withTheme: {} });

    await waitForThemeTokens();
    document.documentElement.classList.add('dark');

    try {
      const surface = effectiveColor('[data-probe="sidebar-surface"]');
      const accentFace = effectiveColor('[data-probe="sidebar-accent-face"]');
      const wash = effectiveColor('[data-probe="sidebar-wash"]');

      // 暗色 `--sidebar` 与 `--sidebar-accent` 同值：实心交互面与静止面同色（Δ = 0），
      // 这正是 `tree-menu` 不能再用 `bg-sidebar-accent` 的原因。
      expect(deltaOf(surface, accentFace)).toBe(0);
      expect(deltaOf(surface, wash), `wash ${wash} vs surface ${surface}`).toBeGreaterThanOrEqual(3);
    } finally {
      document.documentElement.classList.remove('dark');
      unmount();
    }
  });
});

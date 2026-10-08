import { describe, expect, it } from 'vitest';
import { anchorVariants } from '@/styles/anchor';
import { buttonVariants } from '@/styles/button';
import { stepperVariants } from '@/styles/stepper';
import { tableVariants } from '@/styles/table';
import { toggleVariants } from '@/styles/toggle';
import { toggleGroupVariants } from '@/styles/toggle-group';

/**
 * 中性交互面的样式契约。
 *
 * 填充族按 **角色 × 强弱** 分档：`muted`（静态弱化面）与 `accent`（瞬时交互面）**同档**
 * （对齐 shadcn 默认，docs/design/theme.md §3.2），`secondary`（静态实心填充）定在强档
 * （亮 `{b}.200` / 暗 `{b}.800`）。同档折叠之后，中性交互面靠**同一填充的 alpha 阶梯**承担
 * 可见性：静止 `accent/40`（或 `card` / 透明）→ hover `accent/60` → 选中 / 按压 `accent`。
 *
 * **按钮族不走这条阶梯**（docs/design/theme.md §3.2 的 alpha 阶梯由 toggle / toggle-group / anchor /
 * pagination 承担）：无底色形态的 hover **直接升到实心** `accent`（`color="secondary"` 用实心
 * `secondary`），按压回落到前景角色的 alpha 洗色；`solid` / `soft` 的静止面本身就是实心填充。
 *
 * 这组断言守住三件事：两族各自的类名形状稳定；**静止弱面与交互面相邻时必须是洗色**
 * （`toggle.soft` / `toggle-group.soft` / 斑马纹行）——一旦静止面退回实心 `bg-muted`，它与
 * `accent` 同色，交互态会渲染成 Δ = 0（实测色差由
 * `packages/ui/test/browser/specs/theme/neutral-faces.e2e.spec.ts` 守）；
 * 以及**强档填充与它旁边的发丝线不能撞色**（`secondary` 与 `border` 同为 `{b}.200`）。
 */
describe('neutral interaction faces', () => {
  describe('button', () => {
    // 无底色形态：静止是 `card` / 透明，hover 升到自己的实心填充，按压缩回前景 alpha 洗色。
    it('lifts the fill-less neutral shapes onto their own solid fill', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        (['ghost', 'outline', 'dashed'] as const).forEach(variant => {
          const cls = buttonVariants({ color, variant });

          expect(cls, `${color}/${variant}`).toContain(`data-[normal]:hover:bg-${color}`);
          expect(cls, `${color}/${variant}`).toContain(`data-[normal]:active:bg-${color}-foreground/`);
          expect(cls, `${color}/${variant}`).toContain(`text-${color}-foreground`);
        });
      });
    });

    // 实心 / 洗色形态：静止面就是填充本身，文字与按压面都跟着同一个角色走。
    it('keeps the neutral solid and soft rests on their own fill', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        (['solid', 'soft'] as const).forEach(variant => {
          const cls = buttonVariants({ color, variant });

          expect(cls, `${color}/${variant}`).toContain(`bg-${color}`);
          expect(cls, `${color}/${variant}`).toContain(`text-${color}-foreground`);
          expect(cls, `${color}/${variant}`).toContain(`data-[normal]:active:bg-${color}-foreground/`);
        });
      });
    });
  });

  describe('toggle', () => {
    it('uses the same ladder for the neutral rest / hover / on faces', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        (['ghost', 'soft'] as const).forEach(variant => {
          const cls = toggleVariants({ color, variant });

          expect(cls, `${color}/${variant}`).toContain('data-[state=off]:hover:bg-accent/60');
          expect(cls, `${color}/${variant}`).toContain('data-[state=on]:bg-accent');
          expect(cls, `${color}/${variant}`).toContain('data-[state=on]:text-accent-foreground');
          expect(cls, `${color}/${variant}`).not.toContain('bg-accent-foreground/10');
          expect(cls, `${color}/${variant}`).not.toContain('bg-secondary-foreground/10');
        });

        // soft 的静止面必须是洗色：实心静止面与 `data-[state=on]:bg-accent` 同色，OFF / ON 无差别
        expect(toggleVariants({ color, variant: 'soft' }), color).toContain('bg-muted/40');
      });

      const outline = toggleVariants({ color: 'accent', variant: 'outline' });

      expect(outline).toContain('hover:bg-accent/60');
      expect(outline).toContain('data-[state=on]:bg-accent');
    });

    it('uses the same ladder in the group recipe', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        (['ghost', 'soft'] as const).forEach(variant => {
          const { item } = toggleGroupVariants({ color, variant });

          expect(item, `${color}/${variant}`).toContain('data-[state=off]:hover:bg-accent/60');
          expect(item, `${color}/${variant}`).toContain('data-[state=on]:bg-accent');
          expect(item, `${color}/${variant}`).not.toContain('bg-accent-foreground/10');
          expect(item, `${color}/${variant}`).not.toContain('bg-secondary-foreground/10');
        });

        expect(toggleGroupVariants({ color, variant: 'soft' }).item, color).toContain('bg-muted/40');
      });
    });
  });

  describe('table', () => {
    it('keeps the zebra rest a muted wash so the row hover stays visible', () => {
      // 斑马纹偶数行的静止面与行 hover 的 `accent` 同档：实心斑马纹会让偶数行的 hover Δ = 0
      const stripe = tableVariants({ striped: true }).row;

      expect(stripe).toContain('data-[row]:even:bg-muted/40');
      expect(tableVariants({}).row).toContain('hover:bg-accent');
    });
  });

  describe('anchor', () => {
    it('puts the neutral active face on the accent fill', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        const { link } = anchorVariants({ color });

        expect(link, color).toContain('data-[state=active]:bg-accent');
        expect(link, color).toContain('data-[state=active]:text-accent-foreground');
        expect(link, color).not.toContain('bg-accent-foreground/10');
        expect(link, color).not.toContain('bg-secondary-foreground/10');
      });
    });
  });

  describe('the neutral static fills stay static', () => {
    it('never paints muted or secondary as a hover / open face', () => {
      (['accent', 'secondary'] as const).forEach(color => {
        (['ghost', 'outline', 'dashed', 'soft'] as const).forEach(variant => {
          const cls = buttonVariants({ color, variant });

          expect(cls, `${color}/${variant}`).not.toContain('hover:bg-muted');
          expect(cls, `${color}/${variant}`).not.toContain('hover:bg-secondary/');
        });
      });
    });
  });

  describe('the strong static fill never doubles as a hairline', () => {
    it('keeps the neutral completed separator off the secondary fill', () => {
      // `secondary` 定在强档（亮 `{b}.200`），与未完成态分隔线的 `bg-border`（同为 `{b}.200`）
      // **同值**：用 `bg-secondary` 会让 stepper 的完成度在亮色下 Δ = 0。
      // 这一档取角色的可读中性色（与它的 title / description 同一个 token）。
      const classes = stepperVariants({ color: 'secondary' }).separator.split(/\s+/);

      expect(classes).toContain('group-data-[state=completed]:bg-secondary-foreground');
      expect(classes).not.toContain('group-data-[state=completed]:bg-secondary');
    });
  });
});

import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { page, userEvent } from 'vitest/browser';
import { SCollapsibleContent, SCollapsibleTrigger } from '@/components/collapsible';
import SCollapsible from '@/components/collapsible/collapsible.vue';
import { recordAnimationStarts, waitForMountWindow } from '../../shared/animation';
import { renderComponent } from '../../shared/render';

/**
 * Collapsible e2e — the real collapse keyframes.
 *
 * The happy-dom unit spec (`packages/ui/test/specs/components/collapsible.spec.ts`)
 * has no style engine, so it can only observe the inline `animation-name` the
 * measurement pass leaves behind. Whether the browser actually runs the
 * `collapsible-up` / `collapsible-down` keyframes needs a real browser, and the
 * case that used to break is a content that is already open when it first mounts
 * (`defaultOpen`, a `default-expanded` tree branch, a deep selection): the
 * measurement froze `animation-name` at mount and never released it, so the first
 * collapse snapped shut with no motion at all.
 */
const PANEL_STYLE = 'height:48px';

function createHarness(defaultOpen: boolean) {
  return defineComponent({
    name: 'CollapsibleE2EHarness',
    setup() {
      return () =>
        h(
          SCollapsible,
          { defaultOpen },
          {
            default: () => [
              h(SCollapsibleTrigger, null, { default: () => 'Toggle panel' }),
              h(SCollapsibleContent, null, { default: () => h('div', { style: PANEL_STYLE }, 'Panel body') })
            ]
          }
        );
    }
  });
}

function contentElement(): HTMLElement {
  const element = document.querySelector<HTMLElement>('[data-vean-collapsible-content]');

  if (!element) {
    throw new Error('expected the collapsible content to be rendered');
  }

  return element;
}

describe('SCollapsible (e2e)', () => {
  describe('collapse motion', () => {
    it('animates the collapse of a content that mounted already open', async () => {
      const { unmount } = await renderComponent(createHarness(true));

      const trigger = page.getByRole('button', { name: 'Toggle panel' });
      await expect.element(page.getByText('Panel body')).toBeVisible();
      await waitForMountWindow();

      const starts = recordAnimationStarts(contentElement());

      await userEvent.click(trigger);
      await expect.poll(() => starts).toContain('collapsible-up');

      // Releasing the mount freeze must not replay the enter keyframe: the panel
      // is already open on first paint, so only the exit keyframe may have run.
      expect(starts).not.toContain('collapsible-down');

      unmount();
    });

    it('animates both directions for a content that mounted closed', async () => {
      const { unmount } = await renderComponent(createHarness(false));

      const starts = recordAnimationStarts(contentElement());

      await userEvent.click(page.getByRole('button', { name: 'Toggle panel' }));
      await expect.element(page.getByText('Panel body')).toBeVisible();
      await expect.poll(() => starts).toContain('collapsible-down');

      await userEvent.click(page.getByRole('button', { name: 'Toggle panel' }));
      await expect.poll(() => starts).toContain('collapsible-up');

      unmount();
    });
  });
});

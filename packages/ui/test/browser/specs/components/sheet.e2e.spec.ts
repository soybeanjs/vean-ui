import { beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import SSheet from '@/components/sheet/sheet.vue';
import { renderComponent } from '../../shared/render';

/**
 * Sheet e2e — fullscreen geometry against a real browser.
 *
 * Fullscreen on a sheet is a CSS contract, not a behavioural one: the headless
 * popup already carries `data-fullscreen`, and `sheetVariants` is what has to
 * turn that attribute into a viewport-filling box. `sheetVariants` drops the
 * inherited dialog `popup` slot (`extendIgnore`), so the panel only fills the
 * viewport if the recipe re-declares the fullscreen overrides itself — and only
 * if those overrides out-rank the per-side size caps.
 *
 * The happy-dom spec (`packages/ui/test/specs/components/sheet.spec.ts`) can
 * only assert that the class strings are attached; it never resolves the
 * cascade, so a recipe whose overrides lose to `sm:max-w-sm` or
 * `max-h-[calc(100dvh-2rem)]` still passes there. These tests measure the
 * rendered box and the reset radius, so exactly that regression fails here.
 */
describe('SSheet (e2e)', () => {
  const slots = {
    trigger: '<button type="button">Open Sheet</button>',
    default: '<p>Sheet body text</p>'
  };

  /** Wide enough that the horizontal panel's `sm:max-w-sm` cap is in play. */
  beforeEach(async () => {
    await page.viewport(1024, 768);
  });

  function popup(): HTMLElement {
    const found = document.querySelector<HTMLElement>('[data-vean-dialog-popup]');

    if (!found) {
      throw new Error('expected the sheet popup to be rendered');
    }

    return found;
  }

  function viewportSize(): { width: number; height: number } {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  }

  /** A `1px` allowance absorbs sub-pixel layout rounding only. */
  const covers = (measured: number, expected: number): boolean => measured >= expected - 1;

  /**
   * Wait until the enter animation has parked the panel on its edge.
   *
   * The panel slides in from its own edge, so right after `open` it is already
   * visible and already at its final size while still translated off-screen.
   * Interacting then clicks the coordinates the target occupied a frame earlier
   * — landing on the overlay instead of the button — so every test settles the
   * panel first. Polling for "fully inside the viewport" is robust to the
   * animation not having started yet.
   */
  async function waitForPanelToSettle(): Promise<void> {
    const { width, height } = viewportSize();

    await expect
      .poll(() => {
        const box = popup().getBoundingClientRect();

        return box.left >= -1 && box.top >= -1 && box.right <= width + 1 && box.bottom <= height + 1;
      })
      .toBe(true);
  }

  it('fills the viewport when the fullscreen toggle is pressed on a horizontal panel', async () => {
    const { unmount } = await renderComponent(SSheet, {
      props: { title: 'Fullscreen Sheet', showFullscreen: true, side: 'right' },
      slots
    });

    await userEvent.click(page.getByRole('button', { name: 'Open Sheet' }));
    await expect.element(page.getByRole('dialog')).toBeVisible();
    await waitForPanelToSettle();

    const { width, height } = viewportSize();

    // Guard: at rest the panel is edge-anchored (`w-3/4` capped by
    // `sm:max-w-sm`), so it must NOT already span the viewport. Without this the
    // fullscreen assertion below could pass for the wrong reason.
    await expect.poll(() => popup().getBoundingClientRect().width).toBeLessThan(width - 1);

    await userEvent.click(page.getByRole('button', { name: 'Fullscreen' }));

    await expect.poll(() => popup().hasAttribute('data-fullscreen')).toBe(true);
    await expect.poll(() => covers(popup().getBoundingClientRect().width, width)).toBe(true);
    await expect.poll(() => covers(popup().getBoundingClientRect().height, height)).toBe(true);
    // `end-0` plus a released `max-width`: the panel now reaches the start edge.
    await expect.poll(() => popup().getBoundingClientRect().left).toBeLessThan(1);
    // The anchored corner radius would leave rounded corners inside the viewport.
    await expect.poll(() => getComputedStyle(popup()).borderRadius).toBe('0px');

    unmount();
  });

  it('lifts the viewport height cap on a vertical panel in fullscreen', async () => {
    const { unmount } = await renderComponent(SSheet, {
      props: { open: true, fullscreen: true, side: 'bottom', title: 'Fullscreen Sheet' },
      slots
    });

    await expect.element(page.getByRole('dialog')).toBeVisible();
    await waitForPanelToSettle();

    const { width, height } = viewportSize();

    // A non-fullscreen bottom panel is capped by
    // `max-h-[var(--vean-drawer-max-height,calc(100dvh-2rem))]`, which is what
    // this case regresses to if `data-[fullscreen]:max-h-none` is missing.
    await expect.poll(() => covers(popup().getBoundingClientRect().height, height)).toBe(true);
    await expect.poll(() => covers(popup().getBoundingClientRect().width, width)).toBe(true);
    // `bottom-0` plus the full height: the panel now reaches the top edge.
    await expect.poll(() => popup().getBoundingClientRect().top).toBeLessThan(1);

    unmount();
  });
});

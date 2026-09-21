import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import SDrawer from '@/components/drawer/drawer.vue';
import { renderComponent } from '../../shared/render';

/**
 * Drawer drag e2e — real pointer drags against a real browser.
 *
 * Locks the regression-prone gesture contracts: swipe dismissal closes an
 * UNCONTROLLED drawer (the dialog binds the internal `isOpen` mirror), snap
 * release settles on another snap point, the overlay tracks only the drag
 * towards close, and a nested child drawer keeps its own swipe gesture.
 */

function dispatchPointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  x: number,
  y: number,
  target?: EventTarget
) {
  (target ?? window).dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      buttons: type === 'pointerup' ? 0 : 1
    })
  );
}

async function drag(from: { x: number; y: number }, to: { x: number; y: number }, steps = 8) {
  const startTarget = document.elementFromPoint(from.x, from.y) ?? undefined;

  dispatchPointer('pointerdown', from.x, from.y, startTarget);

  for (let step = 1; step <= steps; step += 1) {
    dispatchPointer(
      'pointermove',
      from.x + ((to.x - from.x) * step) / steps,
      from.y + ((to.y - from.y) * step) / steps
    );
    await new Promise(resolve => setTimeout(resolve, 16));
  }

  dispatchPointer('pointerup', to.x, to.y);
  await new Promise(resolve => setTimeout(resolve, 60));
}

function getPopups() {
  return Array.from(document.querySelectorAll('[data-vean-drawer-popup]')) as HTMLElement[];
}

function popupDragPoint(popup: HTMLElement) {
  const rect = popup.getBoundingClientRect();

  return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + 16) };
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('SDrawer drag (e2e)', () => {
  it('closes an uncontrolled drawer via drag-to-dismiss', async () => {
    const { unmount } = await renderComponent(SDrawer, {
      props: { title: 'Drag Close' },
      slots: {
        trigger: '<button type="button">Open Drawer</button>',
        default: '<div>Drawer body text</div>'
      }
    });

    document.querySelector<HTMLButtonElement>('[data-vean-drawer-trigger]')?.click();
    await sleep(600);

    const popup = getPopups()[0];

    expect(popup).toBeTruthy();

    const from = popupDragPoint(popup);

    await drag(from, { x: from.x, y: from.y + 400 });
    await sleep(600);

    expect(getPopups()).toHaveLength(0);

    unmount();
  });

  it('settles on another snap point when released near it', async () => {
    const { unmount } = await renderComponent(SDrawer, {
      props: {
        open: true,
        title: 'Snap Drag',
        snapPoints: [0.5, 0.9]
      },
      slots: { default: '<div v-for="i in 40" :key="i" class="h-8">Item</div>' }
    });

    await sleep(600);

    const popup = getPopups()[0];
    const overlay = document.querySelector('[data-vean-overlay]') as HTMLElement | null;

    expect(popup).toBeTruthy();
    expect(overlay).toBeTruthy();

    // The overlay is fully visible at rest on any snap point.
    expect(window.getComputedStyle(overlay!).opacity).toBe('1');

    const initialOffset = Number.parseFloat(popup.style.getPropertyValue('--vean-drawer-snap-point-offset'));

    expect(initialOffset).toBeGreaterThan(0);

    const from = popupDragPoint(popup);

    // Drag well above the drawer so the 0.9 snap point is the nearest settle target.
    await drag(from, { x: from.x, y: Math.max(from.y - 500, 40) });
    await sleep(700);

    const settledOffset = Number.parseFloat(getPopups()[0]!.style.getPropertyValue('--vean-drawer-snap-point-offset'));

    expect(settledOffset).toBeLessThan(initialOffset);

    unmount();
  });

  it('ignores drags while the drawer is fullscreen', async () => {
    const { unmount } = await renderComponent(SDrawer, {
      props: {
        open: true,
        fullscreen: true,
        title: 'Fullscreen Drag',
        snapPoints: [0.5, 1]
      },
      slots: { default: '<div v-for="i in 40" :key="i" class="h-8">Item</div>' }
    });

    await sleep(600);

    const popup = getPopups()[0];

    expect(popup).toBeTruthy();

    const viewportHeight = document.documentElement.clientHeight;

    expect(Math.round(popup.getBoundingClientRect().top)).toBeLessThan(1);
    expect(Math.round(popup.getBoundingClientRect().height)).toBeGreaterThanOrEqual(viewportHeight - 1);

    const from = popupDragPoint(popup);

    dispatchPointer('pointerdown', from.x, from.y, document.elementFromPoint(from.x, from.y) ?? undefined);

    // Far enough to dismiss an ordinary drawer — 400px against a 25% threshold on
    // a 768px viewport — and driven in steps so the velocity stays under the
    // fast-swipe threshold too.
    for (let step = 1; step <= 8; step += 1) {
      dispatchPointer('pointermove', from.x, from.y + step * 50);
      await sleep(16);
    }

    // Mid-drag: a frozen panel has not moved and reports no gesture.
    expect(popup.style.getPropertyValue('--vean-drawer-swipe-movement-y')).toBe('');
    expect(popup.getAttribute('data-vean-swiping')).toBeNull();
    expect(Math.round(popup.getBoundingClientRect().top)).toBeLessThan(1);

    dispatchPointer('pointerup', from.x, from.y + 400);
    await sleep(400);

    // Still open and still covering the viewport; the drag-to-dismiss above is
    // what the same gesture does when the drawer is not fullscreen.
    expect(getPopups()).toHaveLength(1);
    expect(Math.round(getPopups()[0]!.getBoundingClientRect().top)).toBeLessThan(1);

    unmount();
  });

  it('carries the snap offset var from the first painted frame on open', async () => {
    // Regression: the debounced first height measurement left the snap offset
    // var unset for ~150ms, so the entry animation played at the unmeasured
    // resting position before flashing into the active snap point.
    const { unmount } = await renderComponent(SDrawer, {
      props: { open: true, title: 'First Frame Snap', snapPoints: [0.25, 0.5, 0.75] },
      slots: { default: '<div v-for="i in 40" :key="i" class="h-8">Item</div>' }
    });

    const popup = getPopups()[0]!;

    const firstFrameOffset = Number.parseFloat(popup.style.getPropertyValue('--vean-drawer-snap-point-offset'));

    expect(firstFrameOffset).not.toBeNaN();

    await sleep(700);

    const settledOffset = Number.parseFloat(getPopups()[0]!.style.getPropertyValue('--vean-drawer-snap-point-offset'));

    expect(settledOffset).toBeCloseTo(firstFrameOffset, 0);

    unmount();
  });

  it('settles a controlled v-model:snap-point drawer on the dragged snap point', async () => {
    // Regression: the compact layer bound the forwarded listeners to the popup
    // instead of the root, so `update:snapPoint` never reached the parent and
    // the controlled snap point always snapped back to its initial value.
    const seenSnapPoints: (number | string | null)[] = [];

    const ControlledSnapHarness = defineComponent({
      name: 'DrawerControlledSnapHarness',
      setup() {
        const snapPoint = ref<number | string | null>(0.5);

        return () =>
          h(
            SDrawer,
            {
              open: true,
              snapPoints: [0.25, 0.5, 0.75],
              snapPoint: snapPoint.value,
              'onUpdate:snapPoint': (value: number | string | null) => {
                seenSnapPoints.push(value);
                snapPoint.value = value;
              },
              title: 'Controlled Snap'
            },
            {
              default: () => Array.from({ length: 40 }, (_, index) => h('div', { key: index }, 'Item'))
            }
          );
      }
    });

    const { unmount } = await renderComponent(ControlledSnapHarness);

    await sleep(700);

    // the controlled 0.5 snap point must not be clobbered on open
    expect(seenSnapPoints).toHaveLength(0);

    const popup = getPopups()[0]!;
    const popupHeightValue = Number.parseFloat(popup.style.getPropertyValue('--vean-drawer-height'));
    const expectedOffset = (fraction: number) => popupHeightValue - fraction * window.innerHeight;

    expect(Number.parseFloat(popup.style.getPropertyValue('--vean-drawer-snap-point-offset'))).toBeCloseTo(
      expectedOffset(0.5),
      0
    );

    const from = popupDragPoint(popup);

    // drag down 25% of the viewport: 0.5 -> 0.25
    await drag(from, { x: from.x, y: from.y + Math.round(window.innerHeight * 0.25) });
    await sleep(700);

    expect(seenSnapPoints.at(-1)).toBe(0.25);
    expect(Number.parseFloat(getPopups()[0]!.style.getPropertyValue('--vean-drawer-snap-point-offset'))).toBeCloseTo(
      expectedOffset(0.25),
      0
    );

    unmount();
  });

  it('fades the overlay while dragging towards close and restores it on release', async () => {
    const { unmount } = await renderComponent(SDrawer, {
      props: {
        open: true,
        title: 'Overlay Drag',
        snapPoints: [0.5, 0.9]
      },
      slots: { default: '<div v-for="i in 40" :key="i" class="h-8">Item</div>' }
    });

    await sleep(600);

    const overlay = document.querySelector('[data-vean-overlay]') as HTMLElement;

    const popup = getPopups()[0];
    const from = popupDragPoint(popup);

    // Drag down but release before the dismiss threshold: the overlay must
    // dim during the drag and return to full opacity on settle.
    dispatchPointer('pointerdown', from.x, from.y, document.elementFromPoint(from.x, from.y) ?? undefined);

    const midY = from.y + 120;

    dispatchPointer('pointermove', from.x, from.y + 60);
    await sleep(16);
    dispatchPointer('pointermove', from.x, midY);
    await sleep(60);

    const dimmed = Number.parseFloat(window.getComputedStyle(overlay).opacity);

    expect(dimmed).toBeLessThan(1);

    dispatchPointer('pointerup', from.x, midY);
    await sleep(700);

    expect(Number.parseFloat(window.getComputedStyle(overlay).opacity)).toBe(1);

    unmount();
  });

  it('keeps a nested child drawer draggable and dismissible', async () => {
    // Regression: `nested` must not disable the child drawer's own swipe gesture.
    const NestedHarness = defineComponent({
      name: 'DrawerNestedHarness',
      setup() {
        const nestedOpen = ref(false);

        return () =>
          h(
            SDrawer,
            { title: 'Parent Drawer' },
            {
              trigger: () => h('button', { type: 'button' }, 'Open Parent'),
              default: () => [
                h(
                  'button',
                  {
                    type: 'button',
                    'data-child-opener': '',
                    onClick: () => (nestedOpen.value = true)
                  },
                  'Open Child'
                ),
                h(
                  SDrawer,
                  {
                    nested: true,
                    open: nestedOpen.value,
                    'onUpdate:open': (value: boolean) => (nestedOpen.value = value),
                    title: 'Child Drawer'
                  },
                  { default: () => 'Child content' }
                )
              ]
            }
          );
      }
    });

    const { unmount } = await renderComponent(NestedHarness);

    document.querySelector<HTMLButtonElement>('[data-vean-drawer-trigger]')?.click();
    await sleep(600);

    expect(getPopups()).toHaveLength(1);

    document.querySelector<HTMLButtonElement>('[data-child-opener]')?.click();
    await sleep(600);

    expect(getPopups()).toHaveLength(2);

    const child = getPopups().at(-1)!;
    const from = popupDragPoint(child);

    await drag(from, { x: from.x, y: from.y + 400 });
    await sleep(600);

    expect(getPopups()).toHaveLength(1);

    unmount();
  });

  it('reopens after a swipe dismissal closes it', async () => {
    // Regression: a swipe dismissal must sync the uncontrolled `open` state,
    // otherwise the next trigger click assigns `true` to an already-`true`
    // value and the drawer never reopens.
    const { unmount } = await renderComponent(SDrawer, {
      props: { title: 'Reopen Drawer' },
      slots: {
        trigger: '<button type="button">Open Reopen</button>',
        default: '<div>Reopen content</div>'
      }
    });

    const trigger = document.querySelector<HTMLButtonElement>('[data-vean-drawer-trigger]');

    trigger?.click();
    await sleep(600);
    expect(getPopups()).toHaveLength(1);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);

    await drag(from, { x: from.x, y: from.y + 400 });
    await sleep(600);
    expect(getPopups()).toHaveLength(0);

    trigger?.click();
    await sleep(600);
    expect(getPopups()).toHaveLength(1);

    unmount();
  });

  it('anchors the bottom edge and grows in height when dragged upwards', async () => {
    // Regression: dragging a bottom drawer past its resting edge used to lift
    // it and expose the overlay through a gap; the overflow now stretches the
    // popup instead and springs back on release.
    const { unmount } = await renderComponent(SDrawer, {
      props: { open: true, title: 'Overshoot Drawer' },
      slots: { default: '<div style="height:400px">Overshoot content</div>' }
    });

    await sleep(600);

    const popup = getPopups()[0]!;
    const initialHeight = popup.getBoundingClientRect().height;
    const from = popupDragPoint(popup);

    dispatchPointer('pointerdown', from.x, from.y, document.elementFromPoint(from.x, from.y) ?? undefined);
    dispatchPointer('pointermove', from.x, from.y - 100);
    await sleep(16);
    dispatchPointer('pointermove', from.x, from.y - 200);
    await sleep(60);

    const rect = popup.getBoundingClientRect();

    expect(rect.bottom).toBeGreaterThanOrEqual(window.innerHeight - 0.5);
    expect(rect.height).toBeGreaterThan(initialHeight + 4);

    dispatchPointer('pointerup', from.x, from.y - 200);
    await sleep(700);

    expect(Math.abs(popup.getBoundingClientRect().height - initialHeight)).toBeLessThan(2);

    unmount();
  });

  it('restores the parent drawer when a nested drawer closes via a button', async () => {
    // Regression: only a swipe release restored the parent's nested scale; a
    // button close skipped the `close` event entirely.
    const NestedButtonHarness = defineComponent({
      name: 'DrawerNestedButtonHarness',
      setup() {
        const nestedOpen = ref(false);

        return () =>
          h(
            SDrawer,
            { title: 'Parent Drawer' },
            {
              trigger: () => h('button', { type: 'button' }, 'Open Parent'),
              default: () => [
                h(
                  'button',
                  {
                    type: 'button',
                    'data-child-opener': '',
                    onClick: () => (nestedOpen.value = true)
                  },
                  'Open Child'
                ),
                h(
                  SDrawer,
                  {
                    nested: true,
                    open: nestedOpen.value,
                    'onUpdate:open': (value: boolean) => (nestedOpen.value = value),
                    title: 'Child Drawer'
                  },
                  {
                    default: () =>
                      h(
                        'button',
                        {
                          type: 'button',
                          'data-child-closer': '',
                          onClick: () => (nestedOpen.value = false)
                        },
                        'Close Child'
                      )
                  }
                )
              ]
            }
          );
      }
    });

    const { unmount } = await renderComponent(NestedButtonHarness);

    document.querySelector<HTMLButtonElement>('[data-vean-drawer-trigger]')?.click();
    await sleep(600);

    const parent = getPopups()[0]!;

    expect(parent.style.getPropertyValue('--vean-drawer-nested-scale')).toBe('');

    document.querySelector<HTMLButtonElement>('[data-child-opener]')?.click();
    await sleep(600);

    expect(Number.parseFloat(parent.style.getPropertyValue('--vean-drawer-nested-scale'))).toBeLessThan(1);

    document.querySelector<HTMLButtonElement>('[data-child-closer]')?.click();
    await sleep(600);

    expect(getPopups()).toHaveLength(1);
    expect(parent.style.getPropertyValue('--vean-drawer-nested-scale')).toBe('');

    unmount();
  });
});

import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { page, userEvent } from 'vitest/browser';
import SDrawer from '@/components/drawer/drawer.vue';
import {
  HEIGHT_VAR,
  MOVEMENT_Y_VAR,
  SNAP_OFFSET_VAR,
  getPopups,
  itemSlots,
  popupDragPoint,
  popupHeight,
  readMovementY,
  renderControlledDrawer,
  sleep,
  slowVerticalSwipe,
  snapOffsetFor,
  timedSwipe
} from '../../shared/drawer';
import { renderComponent } from '../../shared/render';

/**
 * Drawer snap-point release contracts, ported from Base UI's `DrawerRoot.test.tsx`
 * snap suite to the Vean model.
 *
 * Model divergences that are deliberate (asserted per our docs, not Base UI's):
 * - there is no cancellable close event, so Base UI's `eventDetails.cancel()`
 *   scenarios have no counterpart;
 * - the active snap point is NOT reset on close — it persists across reopen and
 *   `defaultSnapPoint` only fills in when none is active (see drawer context).
 */
describe('SDrawer snap points (e2e)', () => {
  const SNAP_POINTS = [0.25, 0.5, 0.9];

  async function renderSnapDrawer(initialSnapPoint: number | null, snapPoints: number[] = SNAP_POINTS) {
    const handles = await renderControlledDrawer(
      { snapPoints, title: 'Snap Drawer' },
      { open: true, snapPoint: initialSnapPoint, slots: itemSlots(40) }
    );

    await sleep(600);

    return handles;
  }

  it('keeps the resting snap point on a slow low-velocity drag near it', async () => {
    const { snapPointChanges, unmount } = await renderSnapDrawer(0.5);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);
    const restOffset = snapOffsetFor(popup, 0.5);

    await slowVerticalSwipe(from, 30);
    await sleep(400);

    expect(snapPointChanges).toEqual([]);
    expect(Number.parseFloat(popup.style.getPropertyValue(SNAP_OFFSET_VAR))).toBeCloseTo(restOffset, 0);
    expect(getPopups()).toHaveLength(1);

    unmount();
  });

  it('settles on the nearest snap point when a slow drag ends in its basin', async () => {
    const { snapPointChanges, unmount } = await renderSnapDrawer(0.5);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);
    const targetOffset = snapOffsetFor(popup, 0.25);

    // Drag down towards the larger offset of the 0.25 snap point.
    await slowVerticalSwipe(from, Math.round(targetOffset - snapOffsetFor(popup, 0.5)));
    await sleep(700);

    expect(snapPointChanges).toContain(0.25);
    expect(Number.parseFloat(getPopups()[0]!.style.getPropertyValue(SNAP_OFFSET_VAR))).toBeCloseTo(targetOffset, 0);

    unmount();
  });

  it('dismisses when a slow snap-point drag ends closer to closed', async () => {
    const { openChanges, unmount } = await renderSnapDrawer(0.25);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);

    // End 30px above the closed position: nearer to closed than to any snap point.
    await slowVerticalSwipe(from, Math.round(popupHeight(popup) - snapOffsetFor(popup, 0.25) - 30));
    await sleep(700);

    expect(openChanges).toContain(false);
    expect(getPopups()).toHaveLength(0);

    unmount();
  });

  it('dismisses on a fast downward flick from a snap point', async () => {
    const { openChanges, unmount } = await renderSnapDrawer(0.5);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);

    // 30px in the 16ms release window: release velocity ~1.9px/ms, far above the 0.5px/ms fast-swipe threshold.
    await timedSwipe([
      { type: 'down', x: from.x, y: from.y, time: 1000 },
      { type: 'move', x: from.x, y: from.y + 10, time: 1010 },
      { type: 'move', x: from.x, y: from.y + 60, time: 1020 },
      { type: 'up', x: from.x, y: from.y + 90, time: 1035 }
    ]);
    await sleep(700);

    expect(openChanges).toContain(false);
    expect(getPopups()).toHaveLength(0);

    unmount();
  });

  it('damps the movement past the fully-open snap point with square-root resistance', async () => {
    // A popup shorter than the viewport rests at offset 0 for the `1` snap point,
    // so a 150px upward drag overshoots by exactly 150px into the damped zone.
    const { unmount } = await renderControlledDrawer(
      { snapPoints: [1], title: 'Overshoot Drawer' },
      { open: true, slots: { default: () => h('div', { style: 'height:300px' }, 'Body') } }
    );

    await sleep(600);

    const popup = getPopups()[0]!;

    expect(Number.parseFloat(popup.style.getPropertyValue(SNAP_OFFSET_VAR))).toBeCloseTo(0, 0);

    const from = popupDragPoint(popup);

    await timedSwipe([
      { type: 'down', x: from.x, y: from.y, time: 1000 },
      { type: 'move', x: from.x, y: from.y - 1, time: 1010 },
      { type: 'move', x: from.x, y: from.y - 150, time: 1050 }
    ]);

    expect(readMovementY(popup)).toBeCloseTo(-Math.sqrt(150), 3);
    // The popup stays anchored to the bottom edge; the overshoot grows its height instead.
    expect(popup.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(window.innerHeight - 1);

    await timedSwipe([{ type: 'up', x: from.x, y: from.y - 150, time: 1060 }]);
    await sleep(400);

    // Released without a dismiss: the movement var is cleared and the drawer stays open.
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');
    expect(getPopups()).toHaveLength(1);

    unmount();
  });

  it('keeps the active snap point across close and reopen', async () => {
    const { unmount } = await renderComponent(SDrawer, {
      props: { title: 'Persist Drawer', snapPoints: [0.25, 0.5] },
      slots: {
        trigger: '<button type="button">Open Persist</button>',
        default: '<div v-for="i in 40" :key="i" class="h-8">Item</div>'
      }
    });

    await sleep(300);

    const trigger = page.getByRole('button', { name: 'Open Persist' });

    await trigger.click();
    await sleep(600);

    const popup = getPopups()[0]!;
    const from = popupDragPoint(popup);
    const settledOffset = snapOffsetFor(popup, 0.5);

    await slowVerticalSwipe(from, -Math.round(snapOffsetFor(popup, 0.25) - settledOffset));
    await sleep(700);

    expect(Number.parseFloat(getPopups()[0]!.style.getPropertyValue(SNAP_OFFSET_VAR))).toBeCloseTo(settledOffset, 0);

    await userEvent.keyboard('{Escape}');
    await sleep(700);
    expect(getPopups()).toHaveLength(0);

    await trigger.click();
    await sleep(600);

    expect(Number.parseFloat(getPopups()[0]!.style.getPropertyValue(SNAP_OFFSET_VAR))).toBeCloseTo(settledOffset, 0);

    unmount();
  });

  it('reports the measured height var for every resolved snap point', async () => {
    const { unmount } = await renderSnapDrawer(0.25);

    const popup = getPopups()[0]!;
    const height = popupHeight(popup);

    expect(height).toBeGreaterThan(0);
    expect(Number.parseFloat(popup.style.getPropertyValue(HEIGHT_VAR))).toBe(height);
    // The viewport clamp keeps the fully-open point at the popup height, not beyond it.
    expect(snapOffsetFor(popup, 0.9)).toBeGreaterThanOrEqual(0);

    unmount();
  });
});

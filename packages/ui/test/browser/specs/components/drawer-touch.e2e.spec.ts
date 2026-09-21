import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { MOVEMENT_Y_VAR, dispatchTouch, getPopups, renderControlledDrawer, sleep } from '../../shared/drawer';

/**
 * Touch scroll-arbitration contracts, ported from Base UI's `DrawerViewport.test.tsx`
 * arbitration suite to the popup-owned capture-phase touchmove pipeline.
 *
 * Synthetic touch events cannot make the browser actually scroll, so "native
 * scrolling wins" is asserted from the pipeline's observable decisions: the
 * move is left un-prevented and the popup never starts swiping.
 */
describe('SDrawer touch scroll arbitration (e2e)', () => {
  function center(rect: DOMRect) {
    return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
  }

  async function renderScrollDrawer(slots?: Record<string, () => unknown>) {
    const handles = await renderControlledDrawer(
      { title: 'Scroll Drawer' },
      {
        open: true,
        slots: slots ?? {
          default: () =>
            h('div', { 'data-scroll-box': '', style: 'height:200px;overflow-y:auto' }, [
              h('div', { style: 'height:800px' }, 'Scrollable body')
            ])
        }
      }
    );

    await sleep(600);

    return handles;
  }

  function scrollBox() {
    const box = document.querySelector<HTMLElement>('[data-scroll-box]');

    if (!box) throw new Error('scroll box not rendered');

    return box;
  }

  it('claims a touch drag at the scroll-top edge and starts swiping the drawer', async () => {
    const { unmount } = await renderScrollDrawer();

    const popup = getPopups()[0]!;
    const box = scrollBox();
    const point = center(box.getBoundingClientRect());

    dispatchTouch('touchstart', box, [point], { timeStamp: 1000 });

    const firstMove = dispatchTouch('touchmove', box, [{ ...point, y: point.y + 8 }], {
      timeStamp: 1010
    });

    expect(firstMove.defaultPrevented).toBe(true);

    dispatchTouch('touchmove', box, [{ ...point, y: point.y + 30 }], { timeStamp: 1030 });
    await sleep(50);

    expect(popup.getAttribute('data-vean-swiping')).toBe('true');
    expect(Number.parseFloat(popup.style.getPropertyValue(MOVEMENT_Y_VAR))).toBeGreaterThan(0);

    unmount();
  });

  it('leaves every touch on a fullscreen drawer to the browser', async () => {
    const { unmount, openChanges } = await renderControlledDrawer(
      { title: 'Fullscreen Drawer', fullscreen: true },
      { open: true, slots: { default: () => h('p', 'Drawer body') } }
    );

    await sleep(600);

    const popup = getPopups()[0]!;
    const point = center(popup.getBoundingClientRect());

    dispatchTouch('touchstart', popup, [point], { timeStamp: 1000 });

    const move = dispatchTouch('touchmove', popup, [{ ...point, y: point.y + 30 }], { timeStamp: 1030 });

    // A frozen drawer never claims the touch, so the capture-phase pipeline stays
    // out of the way instead of absorbing a move that cannot drag anything.
    expect(move.defaultPrevented).toBe(false);

    dispatchTouch('touchend', popup, [{ ...point, y: point.y + 30 }], { timeStamp: 1060 });
    await sleep(50);

    expect(popup.getAttribute('data-vean-swiping')).toBeNull();
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');
    expect(openChanges).toEqual([]);

    unmount();
  });

  it('leaves the gesture to the scroller when content is mid-scroll', async () => {
    const { unmount } = await renderScrollDrawer();

    const popup = getPopups()[0]!;
    const box = scrollBox();
    const point = center(box.getBoundingClientRect());

    box.scrollTop = 100;

    dispatchTouch('touchstart', box, [point], { timeStamp: 1000 });

    const move = dispatchTouch('touchmove', box, [{ ...point, y: point.y + 30 }], {
      timeStamp: 1030
    });

    expect(move.defaultPrevented).toBe(false);
    expect(popup.hasAttribute('data-vean-swiping')).toBe(false);
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');

    unmount();
  });

  it('keeps driving a claimed drag through a non-cancelable touchmove', async () => {
    const { unmount } = await renderScrollDrawer();

    const popup = getPopups()[0]!;
    const box = scrollBox();
    const point = center(box.getBoundingClientRect());

    dispatchTouch('touchstart', box, [point], { timeStamp: 1000 });
    dispatchTouch('touchmove', box, [{ ...point, y: point.y + 30 }], { timeStamp: 1030 });

    const claimedMovement = Number.parseFloat(popup.style.getPropertyValue(MOVEMENT_Y_VAR));

    expect(claimedMovement).toBeGreaterThan(0);

    // The browser has already committed the gesture to the drawer; the pipeline
    // keeps feeding it even when the move arrives non-cancelable.
    const blockedMove = dispatchTouch('touchmove', box, [{ ...point, y: point.y + 60 }], {
      timeStamp: 1050,
      cancelable: false
    });

    expect(blockedMove.defaultPrevented).toBe(false);
    expect(Number.parseFloat(popup.style.getPropertyValue(MOVEMENT_Y_VAR))).toBeGreaterThan(claimedMovement);

    unmount();
  });

  it('yields the gesture to a dominant cross-axis scroll over scrollable content', async () => {
    const { unmount } = await renderScrollDrawer({
      default: () => [
        h('div', { 'data-scroll-box': '', style: 'height:120px;overflow-y:auto' }, [
          h('div', { style: 'height:600px' }, 'Vertical body')
        ]),
        h('div', { 'data-h-scroll-box': '', style: 'width:200px;height:60px;overflow-x:auto' }, [
          h('div', { style: 'width:800px;height:40px' }, 'Wide body')
        ])
      ]
    });

    const popup = getPopups()[0]!;
    const horizontalBox = document.querySelector<HTMLElement>('[data-h-scroll-box]')!;
    const point = center(horizontalBox.getBoundingClientRect());

    dispatchTouch('touchstart', horizontalBox, [point], { timeStamp: 1000 });

    // The cross axis wins by slop + bias: 30px horizontal vs 4px vertical.
    const move = dispatchTouch('touchmove', horizontalBox, [{ x: point.x + 30, y: point.y + 4 }], {
      timeStamp: 1010
    });

    expect(move.defaultPrevented).toBe(false);
    expect(popup.hasAttribute('data-vean-swiping')).toBe(false);
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');

    unmount();
  });

  it('never starts a swipe from a range input', async () => {
    const { unmount } = await renderScrollDrawer({
      default: () => h('input', { type: 'range', 'data-range-input': '', style: 'width:200px' })
    });

    const popup = getPopups()[0]!;
    const input = document.querySelector<HTMLElement>('[data-range-input]')!;
    const point = center(input.getBoundingClientRect());

    dispatchTouch('touchstart', input, [point], { timeStamp: 1000 });

    const move = dispatchTouch('touchmove', input, [{ ...point, y: point.y + 30 }], {
      timeStamp: 1030
    });

    expect(move.defaultPrevented).toBe(false);
    expect(popup.hasAttribute('data-vean-swiping')).toBe(false);
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');

    unmount();
  });

  it('leaves a two-finger touchmove to the browser', async () => {
    const { unmount } = await renderScrollDrawer();

    const popup = getPopups()[0]!;
    const box = scrollBox();
    const point = center(box.getBoundingClientRect());

    dispatchTouch('touchstart', box, [point], { timeStamp: 1000 });

    const pinch = dispatchTouch(
      'touchmove',
      box,
      [
        { ...point, y: point.y + 8 },
        { x: point.x + 40, y: point.y + 8 }
      ],
      { timeStamp: 1010 }
    );

    expect(pinch.defaultPrevented).toBe(false);
    expect(popup.hasAttribute('data-vean-swiping')).toBe(false);
    expect(popup.style.getPropertyValue(MOVEMENT_Y_VAR)).toBe('');

    unmount();
  });
});

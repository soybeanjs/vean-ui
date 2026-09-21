import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { DialogFullscreen } from '@vean/aria/dialog';
import { DrawerPopup, DrawerRoot, DrawerRootNested, DrawerViewport } from '@vean/aria/drawer';
import SDrawer from '@/components/drawer/drawer.vue';

function mockRect(element: Element, rect: { x?: number; y?: number; width?: number; height?: number }) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: rect.x ?? 0,
      y: rect.y ?? 0,
      top: rect.y ?? 0,
      left: rect.x ?? 0,
      right: (rect.x ?? 0) + (rect.width ?? 0),
      bottom: (rect.y ?? 0) + (rect.height ?? 0),
      width: rect.width ?? 0,
      height: rect.height ?? 0,
      toJSON: () => ({})
    })
  });
}

function mockPointerCapture(element: Element) {
  let capturedPointerId: number | null = null;

  Object.defineProperty(element, 'setPointerCapture', {
    configurable: true,
    value: (pointerId: number) => {
      capturedPointerId = pointerId;
    }
  });

  Object.defineProperty(element, 'hasPointerCapture', {
    configurable: true,
    value: (pointerId: number) => capturedPointerId === pointerId
  });

  Object.defineProperty(element, 'releasePointerCapture', {
    configurable: true,
    value: (pointerId: number) => {
      if (capturedPointerId === pointerId) {
        capturedPointerId = null;
      }
    }
  });
}

function dispatchPointerEvent(target: EventTarget, type: string, init: PointerEventInit) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe('SDrawer', () => {
  const slots = {
    trigger: '<button type="button">Open Drawer</button>',
    default: '<div data-content>Drawer content</div>'
  };

  describe('rendering', () => {
    it('renders drawer content when open', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer Title',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Drawer Title');
      expect(wrapper.text()).toContain('Drawer content');

      wrapper.unmount();
    });

    it('renders the trigger slot', () => {
      const wrapper = mount(SDrawer, {
        props: { title: 'Drawer' },
        slots,
        attachTo: document.body
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toContain('Open Drawer');

      wrapper.unmount();
    });

    it('renders a handle by default', async () => {
      const wrapper = mount(SDrawer, {
        props: { open: true, title: 'Drawer', portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-handle]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('exposes drawer data attributes on chrome slots', async () => {
      const wrapper = mount(SDrawer, {
        props: { open: true, title: 'Drawer Title', portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-drawer-trigger]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-drawer-header]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-drawer-title]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-drawer-content]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-drawer-close]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies custom class to popup', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          class: 'my-drawer',
          portalProps: { disabled: true },
          title: 'Drawer'
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('.my-drawer').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('moves focus into the dialog when opened from the trigger', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          title: 'Bottom Drawer Title'
        },
        slots: {
          trigger: '<button type="button">Open</button>',
          default: '<div>Drawer Content</div>'
        },
        attachTo: document.body
      });

      await wrapper.get('button').trigger('click');
      await nextTick();
      await nextTick();

      const popup = document.body.querySelector('[role="dialog"]');

      expect(popup).toBeTruthy();
      expect(document.activeElement).toBe(popup);
      expect(document.activeElement?.closest('[aria-hidden="true"]')).toBeNull();

      wrapper.unmount();
    });

    it('does not enter snap-point release logic when snapPoints are omitted', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          title: 'Bottom Drawer Title'
        },
        slots: {
          trigger: '<button type="button">Open</button>',
          default: '<div>Drawer Content</div>'
        },
        attachTo: document.body
      });

      await wrapper.get('button').trigger('click');
      await nextTick();
      await nextTick();

      const popup = document.body.querySelector('[data-vean-drawer-popup]') as HTMLElement | null;

      expect(popup).toBeTruthy();

      if (!popup) {
        wrapper.unmount();
        return;
      }

      mockPointerCapture(popup);
      mockRect(popup, { width: 320, height: 300 });

      dispatchPointerEvent(popup, 'pointerdown', { clientY: 100, pointerId: 1 });
      dispatchPointerEvent(popup, 'pointermove', { clientY: 220, pointerId: 1 });
      popup.style.transform = 'matrix(1, 0, 0, 1, 0, 120)';

      expect(() => {
        dispatchPointerEvent(popup, 'pointerup', { clientY: 220, pointerId: 1 });
      }).not.toThrow();

      await nextTick();
      await nextTick();

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('renders with dialog role when open', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Accessible Drawer',
          description: 'A description for screen readers',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('fullscreen state', () => {
    it('leaves the popup out of fullscreen by default', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeUndefined();

      wrapper.unmount();
    });

    it('enters fullscreen from the uncontrolled default', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          defaultFullscreen: true,
          title: 'Drawer',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      // Before the wiring fix this stayed out of fullscreen: the absent Boolean
      // prop was cast to `false` on the way down, so `DialogRoot` read a
      // controlled `false` and ignored `defaultFullscreen` entirely.
      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();

      wrapper.unmount();
    });

    it('follows the controlled fullscreen prop', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      await wrapper.setProps({ fullscreen: true });

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();

      await wrapper.setProps({ fullscreen: false });

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeUndefined();

      wrapper.unmount();
    });

    it('keeps the state uncontrolled and re-emits update:fullscreen', async () => {
      // The drawer renders no fullscreen control of its own, so flipping an
      // *uncontrolled* state requires a consumer to place the dialog's
      // `DialogFullscreen` inside the drawer. It shares the drawer's dialog root
      // context, which is exactly the path `update:fullscreen` has to travel —
      // and it only repaints while the state stays uncontrolled.
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          portalProps: { disabled: true }
        },
        slots: { ...slots, default: () => h(DialogFullscreen) },
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();
      expect(wrapper.emitted('update:fullscreen')![0][0]).toBe(true);

      wrapper.unmount();
    });

    it('applies the same uncontrolled default to a nested child drawer', async () => {
      // `DrawerRootNested` forwards its whole prop object, so a cast `false`
      // there would pin the child to a controlled non-fullscreen state while the
      // parent was left untouched.
      const Harness = defineComponent({
        name: 'NestedDrawerHarness',
        setup() {
          return () =>
            h(
              SDrawer,
              { open: true, title: 'Parent Drawer', portalProps: { disabled: true } },
              {
                default: () =>
                  h(
                    SDrawer,
                    { nested: true, open: true, title: 'Child Drawer', portalProps: { disabled: true } },
                    { default: () => h(DialogFullscreen) }
                  )
              }
            );
        }
      });

      const wrapper = mount(Harness, { attachTo: document.body });

      await nextTick();
      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.findAll('[data-vean-drawer-popup]').map(node => node.attributes('data-fullscreen'))).toEqual([
        undefined,
        ''
      ]);

      wrapper.unmount();
    });

    it('keeps the root primitive uncontrolled when fullscreen is absent', async () => {
      // `DrawerRoot` is a public primitive: a consumer can compose `DrawerPopup`
      // and a toggle by hand, and then `fullscreen` never passes through another
      // layer holding the key — so this layer has to carry its own
      // `undefined` default rather than rely on an upstream one.
      const wrapper = mount(DrawerRoot, {
        props: { open: true },
        slots: { default: () => h(DrawerPopup, {}, { default: () => h(DialogFullscreen) }) },
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();

      wrapper.unmount();
    });

    it('keeps the nested root primitive uncontrolled when fullscreen is absent', async () => {
      const wrapper = mount(DrawerRoot, {
        props: { open: true },
        slots: {
          default: () =>
            h(
              DrawerRootNested,
              { open: true },
              {
                default: () => h(DrawerPopup, {}, { default: () => h(DialogFullscreen) })
              }
            )
        },
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();

      wrapper.unmount();
    });

    it('does not capture the forced fullscreen height as the content height', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

      // Model the browser: fullscreen forces the box to the viewport, while the
      // resting box is only as tall as its content.
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get(this: HTMLElement) {
          return this.getAttribute('data-fullscreen') === null ? 178 : 768;
        }
      });

      try {
        const wrapper = mount(SDrawer, {
          props: { open: true, title: 'Drawer', portalProps: { disabled: true } },
          slots,
          attachTo: document.body
        });

        await nextTick();
        await nextTick();

        const heightVar = () => wrapper.find('[data-vean-drawer-popup]').attributes('style') ?? '';

        expect(heightVar()).toMatch(/--vean-drawer-height:\s*178px/);

        await wrapper.setProps({ open: false });
        await nextTick();
        await wrapper.setProps({ fullscreen: true, open: true });
        await nextTick();
        await nextTick();

        // The panel is viewport-sized while fullscreen, but that size is forced
        // by the style rather than measured from the content.
        expect(heightVar()).toMatch(/--vean-drawer-height:\s*178px/);

        await wrapper.setProps({ open: false });
        await nextTick();
        await wrapper.setProps({ fullscreen: false, open: true });
        await nextTick();
        await nextTick();

        // The published height is what the box reads back as its own height, so a
        // captured 768 here would pin the panel to the viewport for good.
        expect(heightVar()).toMatch(/--vean-drawer-height:\s*178px/);

        wrapper.unmount();
      } finally {
        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, 'offsetHeight', descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
        }
      }
    });

    it('resets the uncontrolled fullscreen state when the drawer reopens', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          portalProps: { disabled: true }
        },
        slots: { ...slots, default: () => h(DialogFullscreen) },
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-fullscreen')).toBeDefined();

      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      await nextTick();

      const popup = wrapper.find('[data-vean-drawer-popup]');

      expect(popup.attributes('data-fullscreen')).toBeUndefined();
      expect(popup.attributes('data-vean-snap-points')).toBe('true');
      expect(wrapper.emitted('update:fullscreen')!.at(-1)).toEqual([false]);

      wrapper.unmount();
    });
  });

  describe('fullscreen snapping', () => {
    it('switches snapping off while the drawer is fullscreen', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          fullscreen: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-drawer-popup]');

      // Fullscreen fixes the panel's size to the viewport, so a resting snap
      // point below "fully open" would translate it back down and leave the half
      // beyond the anchored edge off-screen. Both the flag and the box cap the
      // panel is measured against have to drop with it.
      expect(popup.attributes('data-vean-snap-points')).toBe('false');
      expect(popup.attributes('style')).not.toContain('--vean-drawer-max-height');

      wrapper.unmount();
    });

    it('keeps snapping on when the drawer is not fullscreen', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-drawer-popup]');

      expect(popup.attributes('data-vean-snap-points')).toBe('true');
      expect(popup.attributes('style')).toContain('--vean-drawer-max-height');

      wrapper.unmount();
    });

    it('follows an in-context fullscreen toggle when deciding whether snapping is active', async () => {
      // The toggle lives in the dialog's state machine, which is why the drawer
      // root owns the value: a snapshot of the prop alone would leave snapping on
      // for a panel that is already rendering fullscreen.
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          portalProps: { disabled: true }
        },
        slots: { ...slots, default: () => h(DialogFullscreen) },
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-drawer-popup]');

      expect(popup.attributes('data-vean-snap-points')).toBe('true');

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(popup.attributes('data-fullscreen')).toBeDefined();
      expect(popup.attributes('data-vean-snap-points')).toBe('false');
      expect(popup.attributes('style')).not.toContain('--vean-drawer-max-height');

      wrapper.unmount();
    });

    it('does not cycle snap levels from the handle while fullscreen', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          fullscreen: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          snapPoint: 0.5,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-handle]').trigger('click');
      // The handle defers its cycle behind `DOUBLE_TAP_TIMEOUT` (120ms) so a long
      // press can still cancel it.
      await new Promise(resolve => setTimeout(resolve, 200));

      // Fullscreen has no snap levels to walk, so the handle must not rewrite
      // `snapPoint` behind the scenes and leave the drawer resting elsewhere once
      // fullscreen is switched off.
      expect(wrapper.emitted('update:snapPoint')).toBeUndefined();

      wrapper.unmount();
    });

    it('reports no snap-point offsets on the viewport while fullscreen', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 600 });

      const innerHeightSpy = vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);

      try {
        const wrapper = mount(DrawerRoot, {
          props: { open: true, side: 'bottom', snapPoints: [0.5, 1] },
          slots: { default: () => h(DrawerViewport, {}, { default: () => h(DrawerPopup) }) },
          attachTo: document.body
        });

        await nextTick();
        await nextTick();

        const viewport = wrapper.find('[data-vean-drawer-viewport]');

        // 0.5 of 768 = 384 high, so the 600px box rests 216px down; 1 resolves to
        // the whole box and rests flush.
        expect(viewport.attributes('data-vean-snap-points')).toBe('true');
        expect(viewport.attributes('data-vean-snap-points-offset')).toBe('216,0');

        await wrapper.setProps({ fullscreen: true });
        await nextTick();

        // A fullscreen drawer publishes no offsets, so a consumer reading the pair
        // of attributes never sees positions that are not being applied.
        expect(viewport.attributes('data-vean-snap-points')).toBe('false');
        expect(viewport.attributes('data-vean-snap-points-offset')).toBeUndefined();

        wrapper.unmount();
      } finally {
        innerHeightSpy.mockRestore();

        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, 'offsetHeight', descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
        }
      }
    });

    it('cycles snap levels from the handle when snapping is active', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          snapPoint: 0.5,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-handle]').trigger('click');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Guard for the assertion above: this is the same gesture with snapping on.
      expect(wrapper.emitted('update:snapPoint')).toEqual([[1]]);

      wrapper.unmount();
    });
  });

  describe('fullscreen drag', () => {
    /**
     * Opens the drawer through its trigger and returns the live popup element.
     *
     * The portal is disabled so the popup stays inside the wrapper: the gesture
     * engine binds `pointerdown` to that element and resolves the move/release
     * pair on the window, so a bubbled event dispatched on it drives the whole
     * sequence without depending on what else is mounted in `document.body`.
     */
    async function openDrawer(props: Record<string, unknown>) {
      const wrapper = mount(SDrawer, {
        props: { title: 'Drawer', portalProps: { disabled: true }, ...props },
        slots: {
          trigger: '<button type="button">Open</button>',
          default: '<div>Drawer Content</div>'
        },
        attachTo: document.body
      });

      await wrapper.get('[data-vean-drawer-trigger]').trigger('click');
      await nextTick();
      await nextTick();

      const popup = wrapper.find<HTMLElement>('[data-vean-drawer-popup]').element;

      mockPointerCapture(popup);
      mockRect(popup, { width: 320, height: 760 });

      return { wrapper, popup };
    }

    /** Presses and drags the popup downwards by `distance` px. */
    function dragDown(popup: HTMLElement, distance: number) {
      dispatchPointerEvent(popup, 'pointerdown', { clientY: 100, pointerId: 1 });
      dispatchPointerEvent(popup, 'pointermove', { clientY: 100 + distance, pointerId: 1 });
    }

    it('ignores a drag while the drawer is fullscreen', async () => {
      const { wrapper, popup } = await openDrawer({ fullscreen: true });

      dragDown(popup, 60);
      await nextTick();

      // A frozen gesture writes nothing: no movement for the CSS to read, no
      // swiping state for the overlay to react to, and no progress reported.
      expect(popup.style.getPropertyValue('--vean-drawer-swipe-movement-y')).toBe('');
      expect(popup.getAttribute('data-vean-swiping')).toBeNull();
      expect(wrapper.emitted('drag')).toBeUndefined();

      dispatchPointerEvent(popup, 'pointerup', { clientY: 160, pointerId: 1 });
      await nextTick();

      expect(wrapper.emitted('release')).toBeUndefined();
      expect(wrapper.emitted('update:open')).toEqual([[true]]);

      wrapper.unmount();
    });

    it('tracks the same drag while the drawer is not fullscreen', async () => {
      const { wrapper, popup } = await openDrawer({});

      dragDown(popup, 60);
      await nextTick();

      // Guard for the frozen case: this is exactly what it must not produce.
      expect(popup.style.getPropertyValue('--vean-drawer-swipe-movement-y')).toBe('60px');
      expect(popup.getAttribute('data-vean-swiping')).toBe('true');
      expect(wrapper.emitted('drag')).toHaveLength(1);

      dispatchPointerEvent(popup, 'pointerup', { clientY: 160, pointerId: 1 });
      await nextTick();

      // 60px stays below the 25% threshold of the mocked 760px box, so the
      // release settles instead of dismissing, and the drawer stays open.
      expect(wrapper.emitted('release')).toEqual([[true]]);
      expect(wrapper.emitted('update:open')).toEqual([[true]]);

      wrapper.unmount();
    });

    it('clears an in-flight drag when fullscreen turns on', async () => {
      const { wrapper, popup } = await openDrawer({});

      dragDown(popup, 60);
      await nextTick();

      expect(popup.style.getPropertyValue('--vean-drawer-swipe-movement-y')).toBe('60px');

      await wrapper.setProps({ fullscreen: true });
      await nextTick();

      // The gesture stops being enabled from here on, so nothing else would ever
      // clear the offset the abandoned drag already wrote: the switch has to.
      expect(popup.style.getPropertyValue('--vean-drawer-swipe-movement-y')).toBe('');
      expect(popup.getAttribute('data-vean-swiping')).toBeNull();

      wrapper.unmount();
    });
  });

  describe('snap points', () => {
    it('exposes snap-point state on the popup', async () => {
      const wrapper = mount(SDrawer, {
        props: {
          open: true,
          title: 'Drawer',
          snapPoints: [0.5, 1],
          snapPoint: 0.5,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-drawer-popup]');

      expect(popup.exists()).toBe(true);
      expect(popup.attributes('data-vean-snap-points')).toBe('true');
      expect(popup.attributes('data-vean-drawer-side')).toBe('bottom');

      wrapper.unmount();
    });

    it('reports no snap points when snapPoints are omitted', async () => {
      const wrapper = mount(SDrawer, {
        props: { open: true, title: 'Drawer', portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-drawer-popup]').attributes('data-vean-snap-points')).toBe('false');

      wrapper.unmount();
    });

    it('re-measures the popup box when the viewport changes', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

      // Model the popup's `dvh`-capped box: its height follows the viewport.
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get: () => Math.min(1000, Math.max(0, (window.innerHeight ?? 0) - 32))
      });

      const innerHeightSpy = vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);

      try {
        const wrapper = mount(SDrawer, {
          props: {
            open: true,
            title: 'Drawer',
            snapPoints: [0.25, 0.5, 0.75],
            snapPoint: 0.5,
            portalProps: { disabled: true }
          },
          slots,
          attachTo: document.body
        });

        await nextTick();
        await nextTick();

        const popup = wrapper.find('[data-vean-drawer-popup]');

        // Box: min(1000, 1000 − 32) = 968; offset: 968 − 0.5 × 1000 = 468.
        expect(popup.attributes('style') ?? '').toMatch(/--vean-drawer-height:\s*968px/);
        expect(popup.attributes('style') ?? '').toMatch(/--vean-drawer-snap-point-offset:\s*468px/);

        // A viewport change while open re-measures the box in the same tick. The
        // published height and the viewport-derived offset must never disagree,
        // or the drawer rests at the wrong snap level until the observer's
        // debounced correction lands.
        innerHeightSpy.mockReturnValue(1200);
        window.dispatchEvent(new Event('resize'));
        await nextTick();

        // Box: min(1000, 1200 − 32) = 1000; offset: 1000 − 0.5 × 1200 = 400.
        expect(popup.attributes('style') ?? '').toMatch(/--vean-drawer-height:\s*1000px/);
        expect(popup.attributes('style') ?? '').toMatch(/--vean-drawer-snap-point-offset:\s*400px/);

        wrapper.unmount();
      } finally {
        innerHeightSpy.mockRestore();

        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, 'offsetHeight', descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
        }
      }
    });

    it('caps the box at the largest snap point so the far end of the content stays reachable', async () => {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

      // Model the stylesheet: the box is its content height clamped by the cap the
      // popup publishes, which is what `max-height: var(--vean-drawer-max-height)`
      // resolves to in a browser.
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get(this: HTMLElement) {
          const cap = Number.parseFloat(this.style.getPropertyValue('--vean-drawer-max-height'));

          return Number.isFinite(cap)
            ? Math.min(cap, 1600)
            : Math.min(1600, Math.max(0, (window.innerHeight ?? 0) - 32));
        }
      });

      const innerHeightSpy = vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);

      const mountAt = async (snapPoint: number) => {
        const wrapper = mount(SDrawer, {
          props: {
            open: true,
            title: 'Drawer',
            snapPoints: [0.25, 0.5, 0.75],
            snapPoint,
            portalProps: { disabled: true }
          },
          slots,
          attachTo: document.body
        });

        await nextTick();
        await nextTick();

        const style = wrapper.find('[data-vean-drawer-popup]').attributes('style') ?? '';

        wrapper.unmount();

        return style;
      };

      try {
        // Cap: 0.75 × 1000 = 750. At the largest snap the box rests flush against
        // the viewport edge (offset 0), so its whole scrolling window is on screen.
        const largest = await mountAt(0.75);

        expect(largest).toMatch(/--vean-drawer-max-height:\s*750px/);
        expect(largest).toMatch(/--vean-drawer-height:\s*750px/);
        expect(largest).toMatch(/--vean-drawer-snap-point-offset:\s*0px/);

        // A partial snap keeps the same visible extent as before the cap — it only
        // stops the box from hanging past the viewport edge: 750 − 250 = 0.5 × 1000.
        const half = await mountAt(0.5);

        expect(half).toMatch(/--vean-drawer-height:\s*750px/);
        expect(half).toMatch(/--vean-drawer-snap-point-offset:\s*250px/);
      } finally {
        innerHeightSpy.mockRestore();

        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, 'offsetHeight', descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight');
        }
      }
    });

    it('caps a horizontal drawer box by width instead of height', async () => {
      const innerWidthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);

      try {
        const wrapper = mount(SDrawer, {
          props: {
            open: true,
            title: 'Drawer',
            side: 'right',
            snapPoints: [0.5, 0.75],
            snapPoint: 0.5,
            portalProps: { disabled: true }
          },
          slots,
          attachTo: document.body
        });

        await nextTick();

        const style = wrapper.find('[data-vean-drawer-popup]').attributes('style') ?? '';

        expect(style).toMatch(/--vean-drawer-max-width:\s*300px/);
        expect(style).not.toMatch(/--vean-drawer-max-height/);

        wrapper.unmount();
      } finally {
        innerWidthSpy.mockRestore();
      }
    });
  });

  describe('modality tiers', () => {
    async function mountWithModality(modal: boolean | 'trap-focus') {
      const wrapper = mount(SDrawer, {
        props: { open: true, modal, title: 'Drawer', portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      return wrapper;
    }

    async function readPopupModality(modal: boolean | 'trap-focus') {
      const wrapper = await mountWithModality(modal);
      const popup = wrapper.findComponent({ name: 'DialogPopupImpl' });

      expect(popup.exists()).toBe(true);

      const result = {
        trapFocus: popup.props('trapFocus'),
        disableOutsidePointerEvents: popup.props('disableOutsidePointerEvents')
      };

      wrapper.unmount();

      return result;
    }

    it('locks both focus and outside pointer events in the full-modal tier', async () => {
      expect(await readPopupModality(true)).toEqual({
        trapFocus: true,
        disableOutsidePointerEvents: true
      });
    });

    it('traps focus but keeps outside pointer events in the trap-focus tier', async () => {
      expect(await readPopupModality('trap-focus')).toEqual({
        trapFocus: true,
        disableOutsidePointerEvents: false
      });
    });

    it('disables both in the non-modal tier', async () => {
      expect(await readPopupModality(false)).toEqual({
        trapFocus: false,
        disableOutsidePointerEvents: false
      });
    });
  });
});

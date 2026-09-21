import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SDialog from '@/components/dialog/dialog.vue';

describe('SDialog', () => {
  const slots = {
    trigger: '<button type="button">Open Dialog</button>',
    default: '<div data-content>Dialog content</div>'
  };

  describe('rendering', () => {
    it('renders dialog content when open', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog Title',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Dialog Title');
      expect(wrapper.text()).toContain('Dialog content');

      wrapper.unmount();
    });

    it('renders trigger slot', () => {
      const wrapper = mount(SDialog, {
        props: { title: 'Dialog' },
        slots,
        attachTo: document.body
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toContain('Open Dialog');

      wrapper.unmount();
    });

    it('applies custom class to popup', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          class: 'my-dialog',
          portalProps: { disabled: true },
          title: 'Dialog'
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('.my-dialog').exists()).toBe(true);

      wrapper.unmount();
    });

    it('shows close button by default', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-close]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides close button when showClose is false', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          showClose: false,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-close]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('hides fullscreen toggle by default', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-fullscreen]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('hides fullscreen toggle when showFullscreen is false', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          showFullscreen: false,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-fullscreen]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('emits update:open when trigger is clicked', async () => {
      const wrapper = mount(SDialog, {
        props: { title: 'Dialog' },
        slots,
        attachTo: document.body
      });

      await wrapper.find('button').trigger('click');

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')![0][0]).toBe(true);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('renders with accessible dialog role when open', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Accessible Dialog',
          description: 'Dialog description',
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
    it('sets data-fullscreen on the popup when fullscreen', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          fullscreen: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-fullscreen')).toBeDefined();

      wrapper.unmount();
    });

    it('emits update:fullscreen when the fullscreen toggle is clicked', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          showFullscreen: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');

      expect(wrapper.emitted('update:fullscreen')).toBeTruthy();
      expect(wrapper.emitted('update:fullscreen')![0][0]).toBe(true);

      wrapper.unmount();
    });

    it('toggles fullscreen visuals without a controlled prop when the toggle is clicked', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          showFullscreen: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-dialog-popup]');

      expect(popup.attributes('data-fullscreen')).toBeUndefined();
      expect(popup.classes()).toContain('data-[fullscreen]:w-screen');

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(popup.attributes('data-fullscreen')).toBeDefined();
      expect(wrapper.find('[data-vean-dialog-fullscreen]').attributes('aria-pressed')).toBe('true');

      wrapper.unmount();
    });

    it('pins the fullscreen enter/exit animation to the centered Y translate', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').classes()).toContain(
        'data-[fullscreen]:data-[state=closed]:slide-out-to-top-1/2'
      );
      expect(wrapper.find('[data-vean-dialog-popup]').classes()).toContain(
        'data-[fullscreen]:data-[state=open]:slide-in-from-top-1/2'
      );

      wrapper.unmount();
    });

    it('resets the uncontrolled fullscreen state when the dialog reopens', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          title: 'Dialog',
          showFullscreen: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-fullscreen')).toBeDefined();

      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-fullscreen')).toBeUndefined();
      expect(wrapper.find('[data-vean-dialog-fullscreen]').attributes('aria-pressed')).toBe('false');
      expect(wrapper.emitted('update:fullscreen')!.at(-1)).toEqual([false]);

      wrapper.unmount();
    });

    it('keeps the controlled fullscreen state across close and reopen', async () => {
      const wrapper = mount(SDialog, {
        props: {
          open: true,
          fullscreen: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-fullscreen')).toBeDefined();

      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-fullscreen')).toBeDefined();

      wrapper.unmount();
    });
  });

  describe('draggable', () => {
    const firePointer = (target: Element | Window, type: string, x: number, y: number) => {
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          button: 0,
          pointerType: 'mouse'
        })
      );
    };

    const mountDraggableDialog = () =>
      mount(SDialog, {
        props: {
          open: true,
          draggable: true,
          title: 'Dialog',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

    it('marks the header as a drag handle when draggable', async () => {
      const wrapper = mountDraggableDialog();

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-header]').attributes('data-draggable')).toBeDefined();

      wrapper.unmount();
    });

    it('moves the popup with the pointer while dragging', async () => {
      const wrapper = mountDraggableDialog();

      await nextTick();

      firePointer(wrapper.find('[data-vean-dialog-header]').element, 'pointerdown', 100, 100);
      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-dragging')).toBeDefined();

      firePointer(window, 'pointermove', 110, 105);
      await nextTick();

      const popup = wrapper.find('[data-vean-dialog-popup]').element as HTMLElement;

      expect(popup.style.translate).toBe('10px 5px');

      firePointer(window, 'pointerup', 110, 105);
      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').attributes('data-dragging')).toBeUndefined();

      wrapper.unmount();
    });

    it('accumulates the drag offset across separate drags', async () => {
      const wrapper = mountDraggableDialog();

      await nextTick();

      const header = wrapper.find('[data-vean-dialog-header]').element;
      const getPopup = () => wrapper.find('[data-vean-dialog-popup]').element as HTMLElement;

      firePointer(header, 'pointerdown', 100, 100);
      firePointer(window, 'pointermove', 110, 105);
      firePointer(window, 'pointerup', 110, 105);
      await nextTick();

      expect(getPopup().style.translate).toBe('10px 5px');

      firePointer(header, 'pointerdown', 110, 105);
      firePointer(window, 'pointermove', 115, 110);
      firePointer(window, 'pointerup', 115, 110);
      await nextTick();

      expect(getPopup().style.translate).toBe('15px 10px');

      wrapper.unmount();
    });
  });
});

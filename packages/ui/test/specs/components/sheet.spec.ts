import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SSheet from '@/components/sheet/sheet.vue';

describe('SSheet', () => {
  const slots = {
    trigger: '<button type="button">Open Sheet</button>',
    default: '<div data-content>Sheet content</div>'
  };

  describe('rendering', () => {
    it('renders sheet content when open', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          title: 'Sheet Title',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Sheet Title');
      expect(wrapper.text()).toContain('Sheet content');

      wrapper.unmount();
    });

    it('renders trigger slot', () => {
      const wrapper = mount(SSheet, {
        props: { title: 'Sheet' },
        slots,
        attachTo: document.body
      });

      expect(wrapper.find('button').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies custom class', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          class: 'my-sheet',
          portalProps: { disabled: true },
          title: 'Sheet'
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('.my-sheet').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('emits update:open when trigger is clicked', async () => {
      const wrapper = mount(SSheet, {
        props: { title: 'Sheet' },
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
    it('renders with dialog role when open', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          title: 'Accessible Sheet',
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
    it('hides the fullscreen toggle by default', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          title: 'Sheet',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-fullscreen]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('toggles fullscreen without a controlled prop when the toggle is clicked', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          title: 'Sheet',
          showFullscreen: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      const popup = wrapper.find('[data-vean-dialog-popup]');

      expect(popup.attributes('data-fullscreen')).toBeUndefined();

      await wrapper.find('[data-vean-dialog-fullscreen]').trigger('click');
      await nextTick();

      // The internal state has to flip, not just the emitted event: omitting the
      // `fullscreen: undefined` default from `withDefaults` lets Vue cast the
      // absent Boolean prop to `false`, which `DialogRoot` then reads as a
      // *controlled* `false` and refuses to update.
      expect(popup.attributes('data-fullscreen')).toBeDefined();
      expect(wrapper.find('[data-vean-dialog-fullscreen]').attributes('aria-pressed')).toBe('true');
      expect(wrapper.emitted('update:fullscreen')![0][0]).toBe(true);

      wrapper.unmount();
    });

    it('keeps the controlled fullscreen state across close and reopen', async () => {
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          fullscreen: true,
          title: 'Sheet',
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

    it('declares the viewport-filling overrides the dialog popup slot would have supplied', async () => {
      // `sheetVariants` sets `extendIgnore: ['popup']`, so the dialog recipe's
      // own `data-[fullscreen]:*` rules are dropped with the rest of the
      // inherited popup slot and the sheet has to re-declare every override.
      // Without them the panel only gains the `data-fullscreen` attribute and
      // never changes size.
      const wrapper = mount(SSheet, {
        props: {
          open: true,
          title: 'Sheet',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-dialog-popup]').classes()).toEqual(
        expect.arrayContaining([
          'data-[fullscreen]:w-full',
          'data-[fullscreen]:max-w-none',
          'data-[fullscreen]:h-[100dvh]',
          '[@supports(not_(height:100dvh))]:data-[fullscreen]:h-[100vh]',
          'data-[fullscreen]:max-h-none',
          'data-[fullscreen]:rounded-none'
        ])
      );

      wrapper.unmount();
    });
  });
});

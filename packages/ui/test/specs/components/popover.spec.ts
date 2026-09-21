import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SPopover from '@/components/popover/popover.vue';

describe('SPopover', () => {
  const slots = {
    trigger: '<button type="button">Open Popover</button>',
    default: '<div data-content>Popover content</div>'
  };

  describe('rendering', () => {
    it('renders popover content when open', async () => {
      const wrapper = mount(SPopover, {
        props: {
          open: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Popover content');

      wrapper.unmount();
    });

    it('renders trigger slot', () => {
      const wrapper = mount(SPopover, {
        slots,
        attachTo: document.body
      });

      expect(wrapper.find('button').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies custom class to popup', async () => {
      const wrapper = mount(SPopover, {
        props: {
          open: true,
          class: 'my-popover',
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('.my-popover').exists()).toBe(true);

      wrapper.unmount();
    });

    it('shows arrow by default', async () => {
      const wrapper = mount(SPopover, {
        props: {
          open: true,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-arrow]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides arrow when showArrow is false', async () => {
      const wrapper = mount(SPopover, {
        props: {
          open: true,
          showArrow: false,
          portalProps: { disabled: true }
        },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-arrow]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('emits update:open when trigger is clicked', async () => {
      const wrapper = mount(SPopover, {
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
      const wrapper = mount(SPopover, {
        props: {
          open: true,
          portalProps: { disabled: true }
        },
        slots: {
          trigger: '<button type="button">Trigger</button>',
          default: '<div>Accessible popover content</div>'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });
});

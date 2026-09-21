import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { TooltipProvider } from '@vean/aria/tooltip';
import STooltip from '@/components/tooltip/tooltip.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('STooltip', () => {
  const slots = {
    trigger: '<button type="button">Trigger</button>',
    default: '<div>Tooltip content</div>'
  };

  describe('rendering', () => {
    it('renders the trigger slot', () => {
      const wrapper = mount(STooltip, {
        slots,
        attachTo: document.body
      });

      expect(wrapper.find('button').text()).toBe('Trigger');
      expect(document.body.textContent).not.toContain('Tooltip content');
      wrapper.unmount();
    });

    it('renders popup content when open is true', async () => {
      const wrapper = mount(STooltip, {
        props: { open: true, portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Tooltip content');
      wrapper.unmount();
    });

    it('falls back to the content prop when the default slot is absent', async () => {
      const wrapper = mount(STooltip, {
        props: { open: true, content: 'Tooltip from prop', portalProps: { disabled: true } },
        slots: {
          trigger: slots.trigger
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.text()).toContain('Tooltip from prop');
      wrapper.unmount();
    });

    it('applies a custom class to the popup', async () => {
      const wrapper = mount(STooltip, {
        props: { open: true, class: 'my-tooltip-class', portalProps: { disabled: true } },
        slots,
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('.my-tooltip-class').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('emits update:open when the trigger receives focus', async () => {
      const wrapper = mount(STooltip, {
        slots,
        attachTo: document.body
      });

      await wrapper.find('button').trigger('focus');

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')![0][0]).toBe(true);
      wrapper.unmount();
    });

    it('closes when a sibling tooltip within the same provider opens', async () => {
      const wrapper = mount(
        {
          components: { STooltip, TooltipProvider },
          template: `
            <TooltipProvider>
              <STooltip :portal-props="{ disabled: true }">
                <template #trigger><button type="button">First</button></template>
                <div>First content</div>
              </STooltip>
              <STooltip :portal-props="{ disabled: true }">
                <template #trigger><button type="button">Second</button></template>
                <div>Second content</div>
              </STooltip>
            </TooltipProvider>
          `
        },
        { attachTo: document.body }
      );

      const buttons = wrapper.findAll('button');
      await buttons[0].trigger('focus');
      await nextTick();
      expect(wrapper.text()).toContain('First content');

      // Focus moves to the sibling: the first trigger blurs so its tooltip closes, and the
      // shared skip-delay window (the Popper delay group provided by `TooltipProvider`)
      // makes the sibling open instantly.
      await buttons[0].trigger('blur');
      await buttons[1].trigger('focus');
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      await nextTick();

      expect(wrapper.text()).not.toContain('First content');
      expect(wrapper.text()).toContain('Second content');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when closed', async () => {
      const wrapper = mount(STooltip, {
        slots,
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations when open', async () => {
      const wrapper = mount(
        {
          components: { STooltip },
          template: `
            <div data-testid="container">
              <STooltip :open="true" ::portal-props="{ disabled: true }">
                <template #trigger>
                  <button type="button">Trigger</button>
                </template>
                <div>Tooltip content</div>
              </STooltip>
            </div>
          `
        },
        {
          attachTo: document.body
        }
      );

      await nextTick();

      const violations = await getA11yViolations(wrapper.get('[data-testid="container"]').element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

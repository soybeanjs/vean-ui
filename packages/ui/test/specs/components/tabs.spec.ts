import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import STabs from '@/components/tabs/tabs.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { value: 'tab-1', label: 'Account' },
  { value: 'tab-2', label: 'Security' },
  { value: 'tab-3', label: 'Notifications', disabled: true }
];

describe('STabs', () => {
  describe('rendering', () => {
    it('renders all tab triggers', () => {
      const wrapper = mount(STabs, {
        props: { items },
        attachTo: document.body
      });
      const tabs = wrapper.findAll('[role="tab"]');
      expect(tabs).toHaveLength(items.length);
      wrapper.unmount();
    });

    it('renders tab labels', () => {
      const wrapper = mount(STabs, {
        props: { items },
        attachTo: document.body
      });
      expect(wrapper.text()).toContain('Account');
      expect(wrapper.text()).toContain('Security');
      wrapper.unmount();
    });

    it('renders a tablist', () => {
      const wrapper = mount(STabs, {
        props: { items },
        attachTo: document.body
      });
      expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('forwards custom trigger and content slots', async () => {
      const wrapper = mount(
        {
          components: { STabs },
          data() {
            return { currentValue: 'tab-1', items };
          },
          template: `
            <STabs v-model="currentValue" :items="items">
              <template #trigger="{ label, selected }">
                <span :data-test="'custom-trigger-' + label">{{ selected ? 'selected' : 'idle' }}-{{ label }}</span>
              </template>
              <template #content="{ value, selected }">
                <div :data-test="'custom-content-' + value">{{ selected }}-{{ value }}</div>
              </template>
            </STabs>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();
      expect(wrapper.find('[data-test="custom-trigger-Account"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="custom-content-tab-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="custom-trigger-Account"]').text()).toBe('selected-Account');
      expect(wrapper.find('[data-test="custom-content-tab-1"]').text()).toBe('true-tab-1');

      await wrapper.findAll('[role="tab"]')[1].trigger('mousedown', { button: 0 });
      await nextTick();

      expect(wrapper.find('[data-test="custom-trigger-Security"]').text()).toBe('selected-Security');
      expect(wrapper.find('[data-test="custom-content-tab-2"]').text()).toBe('true-tab-2');
      wrapper.unmount();
    });
  });

  describe('active state', () => {
    it('marks the active tab with aria-selected="true"', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      const firstTab = wrapper.findAll('[role="tab"]')[0];
      expect(firstTab.attributes('aria-selected')).toBe('true');
      wrapper.unmount();
    });

    it('marks inactive tabs with aria-selected="false"', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      const secondTab = wrapper.findAll('[role="tab"]')[1];
      expect(secondTab.attributes('aria-selected')).toBe('false');
      wrapper.unmount();
    });

    it('marks the selected tab with data-selected="true"', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      expect(wrapper.findAll('[role="tab"]')[0].attributes('data-selected')).toBe('true');
      expect(wrapper.findAll('[role="tab"]')[1].attributes('data-selected')).toBe('false');
      wrapper.unmount();
    });

    it('emits update:modelValue when tab is clicked', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      // TabsTrigger activates on mousedown (left button), not click
      await wrapper.findAll('[role="tab"]')[1].trigger('mousedown', { button: 0 });
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('tab-2');
      wrapper.unmount();
    });

    it('shows the tabpanel for the active tab', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      const panels = wrapper.findAll('[role="tabpanel"]');
      expect(panels.length).toBeGreaterThan(0);
      wrapper.unmount();
    });

    it('positions the indicator from inline-start in rtl mode', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', dir: 'rtl' },
        attachTo: document.body
      });

      const list = wrapper.find('[role="tablist"]').element;
      const tabs = wrapper.findAll('[role="tab"]').map(tab => tab.element);

      Object.defineProperty(list, 'clientWidth', {
        configurable: true,
        get: () => 300
      });

      Object.defineProperty(tabs[0], 'offsetWidth', {
        configurable: true,
        get: () => 80
      });
      Object.defineProperty(tabs[0], 'offsetLeft', {
        configurable: true,
        get: () => 200
      });
      Object.defineProperty(tabs[1], 'offsetWidth', {
        configurable: true,
        get: () => 90
      });
      Object.defineProperty(tabs[1], 'offsetLeft', {
        configurable: true,
        get: () => 110
      });

      await wrapper.setProps({ modelValue: 'tab-2' });
      await nextTick();

      const indicator = wrapper.find('[data-vean-tabs-indicator]');

      expect(indicator.attributes('style')).toContain('--vean-tabs-indicator-size: 90px;');
      expect(indicator.attributes('style')).toContain('--vean-tabs-indicator-position: 100px;');

      wrapper.unmount();
    });

    it('positions the indicator for vertical orientation', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', orientation: 'vertical' },
        attachTo: document.body
      });

      const tabs = wrapper.findAll('[role="tab"]').map(tab => tab.element);

      Object.defineProperty(tabs[1], 'offsetHeight', {
        configurable: true,
        get: () => 90
      });
      Object.defineProperty(tabs[1], 'offsetTop', {
        configurable: true,
        get: () => 110
      });

      await wrapper.setProps({ modelValue: 'tab-2' });
      await nextTick();

      const indicator = wrapper.find('[data-vean-tabs-indicator]');

      expect(indicator.attributes('style')).toContain('--vean-tabs-indicator-size: 90px;');
      expect(indicator.attributes('style')).toContain('--vean-tabs-indicator-position: 110px;');

      wrapper.unmount();
    });
  });

  describe('activation mode', () => {
    it('activates on focus in automatic mode (default)', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[1].trigger('focus');

      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('tab-2');

      wrapper.unmount();
    });

    it('does not activate on focus in manual mode, but activates on mousedown', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', activationMode: 'manual' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[1].trigger('focus');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      await wrapper.findAll('[role="tab"]')[1].trigger('mousedown', { button: 0 });
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('tab-2');

      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('activates a tab with the Enter key', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('tab-2');

      wrapper.unmount();
    });

    it('activates a tab with the Space key', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[1].trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('tab-2');

      wrapper.unmount();
    });

    it('moves focus with arrow keys and activates in automatic mode', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      const tabs = wrapper.findAll('[role="tab"]');

      await tabs[0].trigger('focus');
      await tabs[0].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement).toBe(tabs[1].element);
      expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toBe('tab-2');

      await tabs[1].trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement).toBe(tabs[0].element);

      wrapper.unmount();
    });

    it('skips disabled tabs while navigating with arrow keys', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      const tabs = wrapper.findAll('[role="tab"]');

      await tabs[1].trigger('focus');
      await tabs[1].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      // tab-3 is disabled, focus wraps back to tab-1
      expect(document.activeElement).toBe(tabs[0].element);

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('marks disabled tabs with data-disabled', () => {
      const wrapper = mount(STabs, {
        props: { items },
        attachTo: document.body
      });
      // TabsTrigger uses data-disabled (not native disabled) to allow receiving focus
      const disabledTab = wrapper.findAll('[role="tab"]')[2];
      expect(disabledTab.attributes('data-disabled')).toBe('');
      wrapper.unmount();
    });

    it('does not activate a disabled tab on mousedown', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      await wrapper.findAll('[role="tab"]')[2].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });
  });

  describe('content mounting', () => {
    it('unmounts inactive content when unmountOnHide is true (default)', async () => {
      const wrapper = mount(
        {
          components: { STabs },
          data: () => ({ items }),
          template: `
            <STabs :items="items" model-value="tab-1">
              <template #content="{ label }"><p>{{ label }}</p></template>
            </STabs>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[0].text()).toBe('Account');
      expect(panels[1].text()).toBe('');
      expect(panels[2].text()).toBe('');

      wrapper.unmount();
    });

    it('keeps inactive content mounted but hidden when unmountOnHide is false', async () => {
      const wrapper = mount(
        {
          components: { STabs },
          data: () => ({ items }),
          template: `
            <STabs :items="items" model-value="tab-1" :unmount-on-hide="false">
              <template #content="{ label }"><p>{{ label }}</p></template>
            </STabs>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      const panels = wrapper.findAll('[role="tabpanel"]');

      expect(panels[0].text()).toBe('Account');
      expect(panels[1].text()).toBe('Security');
      expect(panels[1].attributes('hidden')).toBeDefined();
      expect(panels[0].attributes('hidden')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('aria wiring', () => {
    it('links triggers and panels with aria-controls and aria-labelledby', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      await nextTick();

      const firstTab = wrapper.findAll('[role="tab"]')[0];
      const firstPanel = wrapper.findAll('[role="tabpanel"]')[0];

      expect(firstTab.attributes('aria-controls')).toBe('vean-tabs-content-tab-1');
      expect(firstPanel.attributes('id')).toBe('vean-tabs-content-tab-1');
      expect(firstPanel.attributes('aria-labelledby')).toBe('vean-tabs-trigger-tab-1');

      wrapper.unmount();
    });
  });

  describe('indicator', () => {
    it('renders no indicator when enableIndicator is false', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', enableIndicator: false },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tabs-indicator]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders a custom indicator slot', async () => {
      const wrapper = mount(
        {
          components: { STabs },
          data: () => ({ items }),
          template: `
            <STabs :items="items" model-value="tab-1">
              <template #indicator><div class="custom-indicator" /></template>
            </STabs>
          `
        },
        { attachTo: document.body }
      );

      await nextTick();

      expect(wrapper.find('[data-vean-tabs-indicator]').find('.custom-indicator').exists()).toBe(true);

      wrapper.unmount();
    });

    it('only renders the indicator after mount and when a tab is active', async () => {
      // No active tab and no default value → indicator must stay unmounted even after mount
      const wrapper = mount(STabs, {
        props: { items },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tabs-indicator]').exists()).toBe(false);

      // Activating a tab causes the indicator to appear via a normal reactive update
      await wrapper.findAll('[role="tab"]')[0].trigger('mousedown', { button: 0 });
      await nextTick();

      expect(wrapper.find('[data-vean-tabs-indicator]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('defers the indicator render until after mount even with an active tab', async () => {
      // Even though an active tab exists to measure, the indicator is not rendered
      // synchronously at mount (isMounted is still false) — guarding against hydration mismatch.
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tabs-indicator]').exists()).toBe(false);

      // After the mounted reactive flush, the indicator pops in
      await nextTick();

      expect(wrapper.find('[data-vean-tabs-indicator]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('variants', () => {
    it('applies the square shape by default', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="tablist"]').classes()).toContain('rounded-md');

      wrapper.unmount();
    });

    it('applies the rounded shape', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', shape: 'rounded' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="tablist"]').classes()).toContain('rounded-full');

      wrapper.unmount();
    });

    it('applies the fill variant', () => {
      const full = mount(STabs, {
        props: { items, modelValue: 'tab-1', fill: 'full' },
        attachTo: document.body
      });

      expect(full.find('[data-vean-tabs-root]').classes()).toContain('items-stretch');

      const auto = mount(STabs, {
        props: { items, modelValue: 'tab-1', fill: 'auto' },
        attachTo: document.body
      });

      expect(auto.find('[data-vean-tabs-root]').classes()).toContain('items-start');

      full.unmount();
      auto.unmount();
    });

    it('applies the size variant', () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tabs-root]').classes()).toContain('text-base');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1' },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with unmountOnHide false', async () => {
      const wrapper = mount(STabs, {
        props: { items, modelValue: 'tab-1', unmountOnHide: false },
        attachTo: document.body
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

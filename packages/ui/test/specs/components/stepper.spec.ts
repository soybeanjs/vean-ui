import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { StepperRoot, StepperItem, StepperTrigger } from '@vean/aria/stepper';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SStepper from '@/components/stepper/stepper.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { title: 'Account', description: 'Set up your account' },
  { title: 'Profile', description: 'Fill in your profile' },
  { title: 'Review', description: 'Confirm your details' }
];

describe('SStepper', () => {
  describe('rendering', () => {
    it('renders all step triggers', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.findAll('button')).toHaveLength(items.length);
      wrapper.unmount();
    });

    it('renders step titles', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Account');
      expect(wrapper.text()).toContain('Profile');
      wrapper.unmount();
    });

    it('derives step numbers from item order', async () => {
      const customStepItems = [
        { description: 'First step', step: 4 },
        { description: 'Second step', step: 9 }
      ];
      const wrapper = mount(SStepper, {
        props: { items: customStepItems, modelValue: 1 },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      expect(buttons[0].text()).toContain('Step 1');
      expect(buttons[0].text()).not.toContain('Step 4');
      expect(buttons[1].text()).toContain('Step 2');

      await buttons[1].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(2);
      wrapper.unmount();
    });

    it('stacks the connector under the indicator in vertical orientation', () => {
      const wrapper = mount(SStepper, {
        props: { items, orientation: 'vertical' },
        attachTo: document.body
      });
      const activeItem = wrapper.find('[aria-current="step"]');
      const itemChildren = Array.from(activeItem.element.children);
      const activeSeparator = itemChildren[1] as HTMLElement | undefined;

      expect(activeItem.classes()).toContain('flex-col');
      expect(itemChildren[0]?.tagName).toBe('BUTTON');
      expect(activeSeparator?.getAttribute('role')).toBe('none');
      expect(activeSeparator?.dataset.orientation).toBe('vertical');
      expect(activeSeparator?.className).toContain('ms-4');
      wrapper.unmount();
    });

    it('renders root data attributes and data-linear', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });
      const root = wrapper.find('[data-vean-stepper-root]');

      expect(root.attributes('data-orientation')).toBe('horizontal');
      expect(root.attributes('data-linear')).toBe('');
      wrapper.unmount();
    });

    it('does not leak as / asChild props to the DOM', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });
      const html = wrapper.html();

      expect(html).not.toContain('aschild');
      expect(html).not.toMatch(/as="/);
      wrapper.unmount();
    });

    it('announces the current step in the live region', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        attachTo: document.body
      });
      await nextTick();

      const status = wrapper.find('[role="status"]');

      expect(status.exists()).toBe(true);
      expect(status.text()).toBe('Step 2 of 3');
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('marks the active step with aria-current="step"', () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        attachTo: document.body
      });

      expect(wrapper.findAll('[aria-current="step"]')).toHaveLength(1);
      expect(wrapper.findAll('[aria-current="step"]')[0].attributes('data-state')).toBe('active');
      wrapper.unmount();
    });

    it('derives completed state from the active position', () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      expect(buttons[0].attributes('data-state')).toBe('completed');
      expect(buttons[1].attributes('data-state')).toBe('active');
      expect(buttons[2].attributes('data-state')).toBe('inactive');
      wrapper.unmount();
    });

    it('lets the explicit completed prop win over position', () => {
      const wrapper = mount(SStepper, {
        props: { items: [{ title: 'A' }, { title: 'B', completed: true }], modelValue: 1 },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      expect(buttons[0].attributes('data-state')).toBe('active');
      expect(buttons[1].attributes('data-state')).toBe('completed');
      wrapper.unmount();
    });

    it('emits update:modelValue when the next step is clicked', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1 },
        attachTo: document.body
      });

      await wrapper.findAll('button')[1].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toBe(2);
      wrapper.unmount();
    });

    it('prevents skipping steps in linear mode', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: true },
        attachTo: document.body
      });

      await wrapper.findAll('button')[2].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('goes back to a previous step in linear mode', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 3, linear: true },
        attachTo: document.body
      });

      await wrapper.findAll('button')[0].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1);
      wrapper.unmount();
    });

    it('allows jumping freely when linear is false', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: false },
        attachTo: document.body
      });

      await wrapper.findAll('button')[2].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(3);
      wrapper.unmount();
    });

    it('exposes nextStep / prevStep / goToStep via the Aria root slot', async () => {
      const wrapper = mount(StepperRoot, {
        props: { defaultValue: 2 },
        slots: {
          default: (slotProps: any) => [
            h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'One')),
            h(StepperItem, { step: 2 }, () => h(StepperTrigger, () => 'Two')),
            h(StepperItem, { step: 3 }, () => h(StepperTrigger, () => 'Three')),
            h('button', { id: 'next', onClick: () => slotProps.nextStep() }, 'next'),
            h('button', { id: 'prev', onClick: () => slotProps.prevStep() }, 'prev'),
            h('button', { id: 'goto', onClick: () => slotProps.goToStep(1) }, 'goto')
          ]
        },
        attachTo: document.body
      });

      await wrapper.find('#next').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(3);

      await wrapper.find('#prev').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2);

      await wrapper.find('#goto').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables inaccessible future steps with the default linear mode', () => {
      // `linear` is not passed: verifies the wrapper does not forward an
      // absent Boolean prop as `false`, which would override the Aria
      // `linear: true` default and make every step focusable.
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1 },
        attachTo: document.body
      });

      const thirdStep = wrapper.findAll('button')[2].element as HTMLButtonElement;

      expect(thirdStep.disabled).toBe(true);
      wrapper.unmount();
    });

    it('prevents interaction when a step is disabled', async () => {
      const wrapper = mount(SStepper, {
        props: {
          items: [{ title: 'Account' }, { title: 'Profile', disabled: true }, { title: 'Review' }],
          modelValue: 1,
          linear: false
        },
        attachTo: document.body
      });

      await wrapper.findAll('button')[1].trigger('mousedown', { button: 0 });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('keeps the disabled attribute in sync when modelValue moves past a step', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: true },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      expect((buttons[2].element as HTMLButtonElement).disabled).toBe(true);

      await wrapper.setProps({ modelValue: 3 });
      await nextTick();

      expect((buttons[2].element as HTMLButtonElement).disabled).toBe(false);
      expect((buttons[0].element as HTMLButtonElement).disabled).toBe(false);
      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with arrow keys and skips disabled steps in linear mode', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: true },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      await buttons[0].trigger('keydown', { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[1].element);

      // step 3 is inaccessible in linear mode -> focus stays on step 2
      await buttons[1].trigger('keydown', { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[1].element);
      wrapper.unmount();
    });

    it('selects a step with Enter', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: true },
        attachTo: document.body
      });

      await wrapper.findAll('button')[1].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2);
      wrapper.unmount();
    });

    it('selects a step with Space', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 1, linear: true },
        attachTo: document.body
      });

      await wrapper.findAll('button')[1].trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe(2);
      wrapper.unmount();
    });

    it('moves focus to the first and last step with Home / End', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2, linear: false },
        attachTo: document.body
      });
      const buttons = wrapper.findAll('button');

      await buttons[1].trigger('keydown', { key: 'Home' });
      expect(document.activeElement).toBe(buttons[0].element);

      await buttons[0].trigger('keydown', { key: 'End' });
      expect(document.activeElement).toBe(buttons[2].element);
      wrapper.unmount();
    });
  });

  describe('props forwarding and slots', () => {
    it('forwards itemProps to the step item', () => {
      const wrapper = mount(SStepper, {
        props: { items, itemProps: { class: 'custom-item', 'data-test': 'step-item' } },
        attachTo: document.body
      });
      const item = wrapper.find('[data-vean-stepper-item]');

      expect(item.classes()).toContain('custom-item');
      expect(item.attributes('data-test')).toBe('step-item');
      wrapper.unmount();
    });

    it('forwards triggerProps to the trigger', () => {
      const wrapper = mount(SStepper, {
        props: { items, triggerProps: { 'aria-label': 'go to step' } },
        attachTo: document.body
      });

      expect(wrapper.findAll('button')[0].attributes('aria-label')).toBe('go to step');
      wrapper.unmount();
    });

    it('renders a check icon for completed steps when ConfigProvider provides iconRender', () => {
      const wrapper = mount(SConfigProvider, {
        props: {
          iconRender: (icon: unknown) => h('span', { 'data-testid': 'icon' }, String(icon))
        },
        slots: {
          default: h(SStepper, {
            items: [{ title: 'Account', completed: true }, { title: 'Profile' }],
            modelValue: 2
          })
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-testid="icon"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="icon"]').text()).toBe('lucide:check');
      wrapper.unmount();
    });

    it('passes state and step data to the indicator slot', () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        slots: {
          indicator:
            '<template #indicator="{ state, step }"><span class="custom-ind">{{ state }}:{{ step }}</span></template>'
        },
        attachTo: document.body
      });

      const indicators = wrapper.findAll('.custom-ind');

      expect(indicators[0].text()).toBe('completed:1');
      expect(indicators[1].text()).toBe('active:2');
      wrapper.unmount();
    });

    it('passes item data and state to the title slot', () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        slots: {
          title:
            '<template #title="{ title, state }"><span class="custom-title">{{ title }} {{ state }}</span></template>'
        },
        attachTo: document.body
      });

      const titles = wrapper.findAll('.custom-title');

      expect(titles[0].text()).toBe('Account completed');
      expect(titles[1].text()).toBe('Profile active');
      wrapper.unmount();
    });

    it('applies size variant classes to the indicator', () => {
      const wrapper = mount(SStepper, {
        props: { items, size: 'xs' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-stepper-indicator]').classes()).toContain('size-6');
      wrapper.unmount();
    });

    it('renders the indicator as a <span> by default', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });

      const indicators = wrapper.findAll('[data-vean-stepper-indicator]');

      expect(indicators.length).toBeGreaterThan(0);
      expect(indicators[0].element.tagName).toBe('SPAN');
      wrapper.unmount();
    });
  });

  describe('localization', () => {
    it('applies the ConfigProvider locale to the live region and aria-label fallback', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { locale: 'zh-CN' },
        slots: {
          default: h(SStepper, { items, modelValue: 2 })
        },
        attachTo: document.body
      });
      await nextTick();

      expect(wrapper.find('[role="status"]').text()).toBe('第 2 步，共 3 步');
      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('分步进度');
      wrapper.unmount();
    });

    it('lets the user override the group aria-label', () => {
      const wrapper = mount(SStepper, {
        props: { items, 'aria-label': 'Checkout progress' },
        attachTo: document.body
      });

      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Checkout progress');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('labels each trigger with title and description ids', () => {
      const wrapper = mount(SStepper, {
        props: { items },
        attachTo: document.body
      });
      const firstTrigger = wrapper.findAll('button')[0];

      const labelledBy = firstTrigger.attributes('aria-labelledby');
      const describedBy = firstTrigger.attributes('aria-describedby');

      expect(labelledBy).toMatch(/^vean-stepper-title-/);
      expect(describedBy).toMatch(/^vean-stepper-description-/);
      expect(wrapper.find(`#${labelledBy}`).text()).toBe('Account');
      expect(wrapper.find(`#${describedBy}`).text()).toBe('Set up your account');
      wrapper.unmount();
    });

    it('has no a11y violations', async () => {
      const wrapper = mount(SStepper, {
        props: { items, modelValue: 2 },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

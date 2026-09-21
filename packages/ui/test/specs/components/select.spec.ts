import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import SSelect from '@/components/select/select.vue';
import { MockResizeObserver, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' }
];

const groupedItems = [
  {
    label: 'Fruits',
    items: [{ label: 'Apple', value: 'apple' }]
  },
  {
    label: 'Vegetables',
    items: [{ label: 'Carrot', value: 'carrot' }]
  }
];

const mousePointerDown = {
  button: 0,
  ctrlKey: false,
  pageX: 0,
  pageY: 0,
  pointerId: 1,
  pointerType: 'mouse'
};

const mockHTMLElementProp = <K extends keyof HTMLElement>(property: K, value: HTMLElement[K]) => {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, property);

  Object.defineProperty(window.HTMLElement.prototype, property, {
    configurable: true,
    value
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(window.HTMLElement.prototype, property, descriptor);
      return;
    }

    Reflect.deleteProperty(window.HTMLElement.prototype, property);
  };
};

let cleanupFunctions: Array<() => void> = [];

beforeEach(() => {
  cleanupFunctions = [
    mockHTMLElementProp('releasePointerCapture', vi.fn() as HTMLElement['releasePointerCapture']),
    mockHTMLElementProp('hasPointerCapture', vi.fn(() => false) as HTMLElement['hasPointerCapture']),
    mockHTMLElementProp('scrollIntoView', vi.fn() as HTMLElement['scrollIntoView'])
  ];
  cleanupFunctions.push(setupMock('ResizeObserver', MockResizeObserver as typeof ResizeObserver));
});

afterEach(() => {
  while (cleanupFunctions.length) {
    cleanupFunctions.pop()?.();
  }

  document.body.innerHTML = '';
});

const openListbox = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('button').trigger('pointerdown', mousePointerDown);
  await nextTick();
};

const selectOption = async (label: string) => {
  const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(node =>
    node.textContent?.includes(label)
  );

  expect(option, `option "${label}" should be rendered`).toBeTruthy();

  await new DOMWrapper(option as Element).trigger('keydown', { key: 'Enter' });
  await flushPromises();
  await nextTick();
  await nextTick();
};

describe('SSelect', () => {
  describe('rendering', () => {
    it('renders placeholder text', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          placeholder: 'Select a fruit'
        },
        attachTo: document.body
      });

      expect(wrapper.get('button').text()).toContain('Select a fruit');
      wrapper.unmount();
    });

    it('renders grouped options when opened', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items: groupedItems
        },
        attachTo: document.body
      });

      await openListbox(wrapper);

      expect(document.body.textContent).toContain('Fruits');
      expect(document.body.textContent).toContain('Vegetables');
      expect(document.body.textContent).toContain('Carrot');
      wrapper.unmount();
    });

    it('renders the selected label from defaultValue', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          defaultValue: 'banana'
        },
        attachTo: document.body
      });

      expect(wrapper.get('button').text()).toContain('Banana');
      wrapper.unmount();
    });

    it('applies the size variant class to the trigger', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          size: 'lg'
        },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-select-trigger]').classes()).toContain('h-9');
      wrapper.unmount();
    });

    it('marks the trigger with combobox ARIA attributes', async () => {
      const wrapper = mount(SSelect, {
        props: { items },
        attachTo: document.body
      });
      const trigger = wrapper.get('[data-vean-select-trigger]');

      expect(trigger.attributes('role')).toBe('combobox');
      expect(trigger.attributes('aria-expanded')).toBe('false');
      expect(trigger.attributes('aria-controls')).toBeTruthy();

      await openListbox(wrapper);

      expect(wrapper.get('[data-vean-select-trigger]').attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });

    it('renders the top and bottom slots inside the popup', async () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data() {
            return { items };
          },
          template: `
            <SSelect :items="items">
              <template #top><div data-slot="top-content">Top</div></template>
              <template #bottom><div data-slot="bottom-content">Bottom</div></template>
            </SSelect>
          `
        },
        { attachTo: document.body }
      );

      await openListbox(wrapper);

      expect(document.body.querySelector('[data-slot="top-content"]')?.textContent).toContain('Top');
      expect(document.body.querySelector('[data-slot="bottom-content"]')?.textContent).toContain('Bottom');
      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('emits update:modelValue and select on option click', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items
        },
        attachTo: document.body
      });

      await openListbox(wrapper);
      await selectOption('Banana');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['banana']);
      expect(wrapper.emitted('select')).toBeTruthy();
      wrapper.unmount();
    });

    it('reflects a controlled modelValue', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          modelValue: 'orange'
        },
        attachTo: document.body
      });

      expect(wrapper.get('button').text()).toContain('Orange');
      wrapper.unmount();
    });

    it('deselects the option when clicked again with clearable', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          placeholder: 'Select a fruit',
          clearable: true
        },
        attachTo: document.body
      });

      await openListbox(wrapper);
      await selectOption('Banana');
      expect(wrapper.get('button').text()).toContain('Banana');

      await openListbox(wrapper);
      await selectOption('Banana');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined]);
      expect(wrapper.get('button').text()).toContain('Select a fruit');
      wrapper.unmount();
    });

    it('clears the value from the trigger clear button', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          modelValue: 'banana',
          placeholder: 'Select a fruit',
          clearable: true
        },
        attachTo: document.body
      });

      const clearButton = wrapper.find('[data-vean-select-clear]');
      expect(clearButton.exists()).toBe(true);

      await clearButton.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined]);
      wrapper.unmount();
    });

    it('clears an uncontrolled defaultValue from the trigger', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          defaultValue: 'apple',
          placeholder: 'Select a fruit',
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.get('button').text()).toContain('Apple');

      await wrapper.find('[data-vean-select-clear]').trigger('click');

      expect(wrapper.get('button').text()).toContain('Select a fruit');
      wrapper.unmount();
    });

    it('hides the trigger clear button when no value is selected', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          placeholder: 'Select a fruit'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-select-clear]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('hides the trigger clear button when clearable is false', () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          modelValue: 'banana',
          clearable: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-select-clear]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('keeps the selection when clearable is false', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          clearable: false
        },
        attachTo: document.body
      });

      await openListbox(wrapper);
      await selectOption('Banana');

      await openListbox(wrapper);
      await selectOption('Banana');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['banana']);
      wrapper.unmount();
    });

    it('collects multiple selections in multiple mode', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          multiple: true
        },
        attachTo: document.body
      });

      await openListbox(wrapper);
      await selectOption('Banana');
      await selectOption('Orange');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['banana', 'orange']);
      wrapper.unmount();
    });

    it('opens the listbox via keyboard', async () => {
      const wrapper = mount(SSelect, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.get('button').trigger('keydown', { key: 'Enter' });
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);
      wrapper.unmount();
    });

    it('does not change the model value when a disabled option is selected', async () => {
      const withDisabled = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana', disabled: true },
        { label: 'Orange', value: 'orange' }
      ];
      const wrapper = mount(SSelect, {
        props: { items: withDisabled },
        attachTo: document.body
      });

      await openListbox(wrapper);
      await selectOption('Banana');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      wrapper.unmount();
    });

    it('supports a controlled open state', async () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data: () => ({ items, isOpen: true }),
          template: `<SSelect :items="items" :open="isOpen" @update:open="isOpen = $event" />`
        },
        { attachTo: document.body }
      );

      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      wrapper.unmount();
    });
  });

  describe('nullableValue', () => {
    it('uses nullableValue for the hidden native select option when the model value is nullish', () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data() {
            return { items };
          },
          template: `<form><SSelect :items="items" class="form" name="test" nullable-value="null" /></form>`
        },
        { attachTo: document.body }
      );

      const option = document.body.querySelector<HTMLOptionElement>('select option');

      expect(option?.value).toBe('null');
      wrapper.unmount();
    });

    it('defaults the hidden native select option value to empty when nullableValue is not set', () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data() {
            return { items };
          },
          template: `<form><SSelect :items="items" class="form" name="test" /></form>`
        },
        { attachTo: document.body }
      );

      const option = document.body.querySelector<HTMLOptionElement>('select option');

      expect(option?.value).toBe('');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents opening when disabled', async () => {
      const wrapper = mount(SSelect, {
        props: {
          items,
          disabled: true
        },
        attachTo: document.body
      });

      const trigger = wrapper.get('button');

      expect(trigger.attributes('disabled')).toBeDefined();

      await trigger.trigger('pointerdown', mousePointerDown);
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeNull();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data() {
            return { items };
          },
          template: `
            <div>
              <label for="select-trigger">Fruit</label>
              <SSelect :items="items" :trigger-props="{ id: 'select-trigger', 'aria-label': 'Fruit' }" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations when the listbox is open', async () => {
      const wrapper = mount(
        {
          components: { SSelect },
          data() {
            return { items };
          },
          template: `
            <div>
              <label for="open-trigger">Fruit</label>
              <SSelect :items="items" :trigger-props="{ id: 'open-trigger', 'aria-label': 'Fruit' }" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      await openListbox(wrapper);

      const violations = await getA11yViolations(document.body, {
        rules: { region: { enabled: false } }
      });

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

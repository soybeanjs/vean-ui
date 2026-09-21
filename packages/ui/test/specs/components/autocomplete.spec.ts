import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import SAutocomplete from '@/components/autocomplete/autocomplete.vue';
import { MockResizeObserver, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' }
];

const groupedItems = [
  {
    label: 'Berries',
    items: [{ value: 'blueberry', label: 'Blueberry' }]
  },
  {
    label: 'Tropical',
    items: [{ value: 'banana', label: 'Banana' }]
  }
];

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
});

describe('SAutocomplete', () => {
  describe('rendering', () => {
    it('renders an input element', () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });
      expect(wrapper.find('input').exists()).toBe(true);
      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, class: 'my-autocomplete' },
        attachTo: document.body
      });
      expect(wrapper.html()).toContain('my-autocomplete');
      wrapper.unmount();
    });

    it('renders grouped options when provided', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items: groupedItems, open: true },
        attachTo: document.body
      });
      await nextTick();

      expect(document.body.textContent).toContain('Berries');
      expect(document.body.textContent).toContain('Tropical');
      expect(document.body.textContent).toContain('Blueberry');
      expect(document.body.textContent).toContain('Banana');

      wrapper.unmount();
    });

    it('exposes autocomplete data attributes on public slots', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items: groupedItems, open: true },
        attachTo: document.body
      });
      await nextTick();

      expect(wrapper.find('[data-vean-autocomplete-anchor]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-autocomplete-trigger]').exists()).toBe(true);
      expect(document.body.querySelector('[data-vean-autocomplete-content]')).toBeTruthy();
      expect(document.body.querySelector('[data-vean-autocomplete-viewport]')).toBeTruthy();
      expect(document.body.querySelector('[data-vean-autocomplete-group]')).toBeTruthy();
      expect(document.body.querySelector('[data-vean-autocomplete-group-label]')).toBeTruthy();
      expect(document.body.querySelector('[data-vean-autocomplete-item]')).toBeTruthy();
      expect(document.body.querySelector('[data-vean-combobox-item]')).toBeTruthy();

      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects modelValue in the input', () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, modelValue: 'banana' },
        attachTo: document.body
      });
      expect(wrapper.find('input').element.value).toBe('banana');
      wrapper.unmount();
    });

    it('emits update:modelValue when typing', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });
      await wrapper.find('input').setValue('blue');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['blue']);
      wrapper.unmount();
    });

    it('opens the popup when typing', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('app');
      await nextTick();

      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);
      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();
      wrapper.unmount();
    });

    it('opens the popup when clicking the trigger', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });

      const buttons = wrapper.findAll('button');
      const trigger = buttons.at(-1);

      expect(trigger).toBeTruthy();

      await trigger!.trigger('click');
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);
      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      wrapper.unmount();
    });

    it('keeps the popup open after focus when openOnFocus is enabled', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, openOnFocus: true },
        attachTo: document.body
      });

      const input = wrapper.find('input');

      await input.trigger('focus');
      await flushPromises();
      await nextTick();

      const openEvents = wrapper.emitted('update:open') ?? [];

      expect(openEvents[0]).toEqual([true]);
      expect(openEvents).not.toContainEqual([false]);
      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      wrapper.unmount();
    });

    it('emits select with the selected item', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, open: true },
        attachTo: document.body
      });
      await nextTick();

      const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(node =>
        node.textContent?.includes('Banana')
      );
      expect(option).toBeTruthy();
      await new DOMWrapper(option as Element).trigger('click');
      await flushPromises();
      await nextTick();
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['banana']);
      expect(wrapper.emitted('select')?.[0]).toEqual([{ value: 'banana', label: 'Banana' }]);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('disables input and trigger interactions', () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, disabled: true },
        attachTo: document.body
      });
      expect(wrapper.find('input').element.disabled).toBe(true);
      expect(wrapper.find('button').element.disabled).toBe(true);
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SAutocomplete },
          data() {
            return { items };
          },
          template: `
            <div>
              <label for="autocomplete-input">Fruit</label>
              <SAutocomplete :items="items" :input-props="{ id: 'autocomplete-input', controlProps: { 'aria-label': 'Fruit' } }" />
            </div>
          `
        },
        { attachTo: document.body }
      );
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });

  describe('filtering', () => {
    it('filters options as the user types', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('app');
      await nextTick();
      await nextTick();

      const options = Array.from(document.body.querySelectorAll('[role="option"]'));

      expect(options).toHaveLength(1);
      expect(options[0].textContent).toContain('Apple');
      wrapper.unmount();
    });

    it('shows the empty message when no option matches the search', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, emptyLabel: 'No results' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('zzz');
      await nextTick();
      await nextTick();

      expect(document.body.textContent).toContain('No results');
      expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(0);
      wrapper.unmount();
    });

    it('shows the empty message when the items list is empty', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items: [], emptyLabel: 'Nothing here' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('a');
      await nextTick();
      await nextTick();

      expect(document.body.textContent).toContain('Nothing here');
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('selects the first option with Enter after ArrowDown', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });

      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowDown' });
      await flushPromises();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      await input.trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple']);
      expect(wrapper.find('input').element.value).toBe('apple');
      wrapper.unmount();
    });
  });

  describe('disabled items', () => {
    it('does not select a disabled item', async () => {
      const disabledItems = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true }
      ];
      const wrapper = mount(SAutocomplete, {
        props: { items: disabledItems, open: true },
        attachTo: document.body
      });
      await nextTick();

      const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(node =>
        node.textContent?.includes('Banana')
      );

      expect(option).toBeTruthy();

      await new DOMWrapper(option as Element).trigger('click');
      await flushPromises();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('controlled open', () => {
    it('respects the controlled open prop', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, open: true },
        attachTo: document.body
      });
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      await wrapper.setProps({ open: false });
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeNull();
      wrapper.unmount();
    });
  });

  describe('clearable', () => {
    it('clears the input value when the clear button is clicked', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, clearable: true, clearLabel: 'Clear input' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('ban');
      await nextTick();

      const clearButton = document.body.querySelector('[aria-label="Clear input"]') as HTMLButtonElement | null;

      expect(clearButton).not.toBeNull();

      await new DOMWrapper(clearButton as Element).trigger('click');
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
      expect(wrapper.find('input').element.value).toBe('');
      wrapper.unmount();
    });
  });

  describe('focus management', () => {
    it('keeps the popup open when focus moves from the input to the clear button', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items, clearable: true, clearLabel: 'Clear input' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('ban');
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      const clearButton = document.body.querySelector('[aria-label="Clear input"]') as HTMLElement | null;

      expect(clearButton).not.toBeNull();

      await wrapper.find('input').trigger('blur', { relatedTarget: clearButton });
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
      wrapper.unmount();
    });

    it('closes the popup when focus moves outside the component', async () => {
      const wrapper = mount(SAutocomplete, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('app');
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeTruthy();

      const outside = document.createElement('button');

      document.body.append(outside);

      await wrapper.find('input').trigger('blur', { relatedTarget: outside });
      await nextTick();
      await nextTick();

      expect(document.body.querySelector('[role="listbox"]')).toBeNull();
      outside.remove();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when open', async () => {
      const wrapper = mount(SAutocomplete, {
        props: {
          items,
          open: true,
          inputProps: { controlProps: { 'aria-label': 'Fruit' } }
        },
        attachTo: document.body
      });
      await nextTick();
      await nextTick();

      const violations = await getA11yViolations(document.body, {
        rules: {
          region: { enabled: false }
        }
      });
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});

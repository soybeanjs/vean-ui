import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SThemePrimarySelect from '@/components/theme-primary-select/theme-primary-select.vue';
import { MockResizeObserver, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

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
  document.documentElement.classList.remove('dark');
  window.localStorage.clear();
});

interface MountOptions {
  simple?: boolean;
  size?: string;
}

const mountInProvider = (options: MountOptions = {}) => {
  const { simple = true, size = 'md' } = options;

  return mount(
    {
      components: { SConfigProvider, SThemePrimarySelect },
      setup: () => ({ simple, size }),
      template: `<SConfigProvider><SThemePrimarySelect :simple="simple" :size="size" /></SConfigProvider>`
    },
    { attachTo: document.body }
  );
};

const openListbox = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('button').trigger('pointerdown', mousePointerDown);
  await nextTick();
};

const optionsOf = () => Array.from(document.body.querySelectorAll('[role="option"]'));

const selectOption = async (label: string) => {
  const option = optionsOf().find(node => node.textContent?.includes(label));

  expect(option, `option "${label}" should be rendered`).toBeTruthy();

  await new DOMWrapper(option as Element).trigger('keydown', { key: 'Enter' });
  await flushPromises();
  await nextTick();
  await nextTick();
};

/** the swatch elements rendered inside one color decorator root. */
const swatchesOf = (root: Element | null | undefined) =>
  Array.from(root?.querySelectorAll('.rounded-full') ?? []) as HTMLElement[];

const triggerDecorator = (wrapper: ReturnType<typeof mount>) => swatchesOf(wrapper.get('button').element)[0];

describe('SThemePrimarySelect', () => {
  describe('rendering', () => {
    it('renders the current primary palette name in the trigger', () => {
      const wrapper = mountInProvider();

      expect(wrapper.get('button').text()).toContain('indigo');

      wrapper.unmount();
    });

    it('renders every built-in palette as an option when opened', async () => {
      const wrapper = mountInProvider();
      await openListbox(wrapper);

      const labels = optionsOf().map(node => node.textContent ?? '');

      expect(labels.length).toBe(26);
      expect(labels.some(text => text.includes('indigo'))).toBe(true);
      expect(labels.some(text => text.includes('rose'))).toBe(true);

      wrapper.unmount();
    });

    it('renders a single 500 swatch in simple mode', () => {
      const wrapper = mountInProvider({ simple: true });

      const swatches = swatchesOf(wrapper.get('button').element);

      expect(swatches).toHaveLength(1);
      expect(swatches[0]?.style.backgroundColor).toBeTruthy();

      wrapper.unmount();
    });

    it('renders the five-level palette stack when simple is off', () => {
      const wrapper = mountInProvider({ simple: false });

      expect(swatchesOf(wrapper.get('button').element)).toHaveLength(5);

      wrapper.unmount();
    });

    it('applies a custom class to the trigger', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SThemePrimarySelect },
          template: '<SConfigProvider><SThemePrimarySelect class="w-42" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.get('button').classes()).toContain('w-42');

      wrapper.unmount();
    });

    it('forwards size to the trigger classes', () => {
      const small = mountInProvider({ size: 'sm' });

      expect(small.get('button').classes()).toContain('h-7');

      small.unmount();

      const medium = mountInProvider({ size: 'md' });

      expect(medium.get('button').classes()).toContain('h-8');

      medium.unmount();
    });
  });

  describe('selection state', () => {
    it('writes the chosen palette back as the theme primary', async () => {
      const wrapper = mountInProvider();
      await openListbox(wrapper);
      await selectOption('rose');

      expect(wrapper.get('button').text()).toContain('rose');
      expect(document.getElementById('vean-theme')?.textContent).toContain('--primary: var(--rose-500)');

      wrapper.unmount();
    });

    it('renders a single swatch per option in simple mode', async () => {
      const wrapper = mountInProvider({ simple: true });
      await openListbox(wrapper);

      const options = optionsOf();
      expect(options.length).toBeGreaterThan(0);

      for (const option of options) {
        expect(swatchesOf(option)).toHaveLength(1);
      }

      wrapper.unmount();
    });

    it('renders five swatches per option when simple is off', async () => {
      const wrapper = mountInProvider({ simple: false });
      await openListbox(wrapper);

      const options = optionsOf();
      expect(options.length).toBeGreaterThan(0);

      for (const option of options) {
        expect(swatchesOf(option)).toHaveLength(5);
      }

      wrapper.unmount();
    });

    it('keeps the trigger swatch in step with the selection', async () => {
      const wrapper = mountInProvider();
      const before = triggerDecorator(wrapper)?.style.backgroundColor;

      await openListbox(wrapper);
      await selectOption('rose');

      expect(triggerDecorator(wrapper)?.style.backgroundColor).not.toBe(before);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('labels the trigger through the theme customizer locale', () => {
      const wrapper = mountInProvider();

      expect(wrapper.get('button').attributes('aria-label')).toBe('Primary');

      wrapper.unmount();
    });

    it('has no a11y violations when closed', async () => {
      const wrapper = mountInProvider();
      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { nextTick, onMounted, shallowRef } from 'vue';
import { mount } from '@vue/test-utils';
import SAnchor from '@/components/anchor/anchor.vue';
import { getA11yViolations } from '../../shared/a11y';

let originalHash: string;

beforeEach(() => {
  originalHash = window.location.hash;
});

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', originalHash || '#');
  document.querySelectorAll('[data-test-anchor-container], section').forEach(element => element.remove());
});

function createSection(id: string, top: number) {
  const element = document.createElement('section');
  let currentTop = top;

  element.id = id;
  element.getClientRects = () => [{ height: 120, width: 120 }] as any;
  element.getBoundingClientRect = () =>
    ({
      bottom: currentTop + 120,
      height: 120,
      left: 0,
      right: 120,
      top: currentTop,
      width: 120,
      x: 0,
      y: currentTop
    }) as DOMRect;

  document.body.appendChild(element);

  return {
    element,
    setTop(topValue: number) {
      currentTop = topValue;
    }
  };
}

function createContainer() {
  const element = document.createElement('div');
  element.setAttribute('data-test-anchor-container', '');
  let scrollTop = 0;

  Object.defineProperty(element, 'scrollTop', {
    get: () => scrollTop,
    set: value => {
      scrollTop = value;
    }
  });

  element.scrollTo = vi.fn(((options?: ScrollToOptions | number) => {
    if (typeof options === 'number') {
      return;
    }

    scrollTop = options?.top ?? scrollTop;
  }) as any) as any;
  element.getBoundingClientRect = () =>
    ({
      bottom: 400,
      height: 400,
      left: 0,
      right: 300,
      top: 0,
      width: 300,
      x: 0,
      y: 0
    }) as DOMRect;

  document.body.appendChild(element);

  return element;
}

const items = [
  {
    href: '#overview',
    title: 'Overview'
  },
  {
    href: '#usage',
    title: 'Usage',
    children: [
      {
        href: '#api',
        title: 'API'
      }
    ]
  }
];

function cleanup(previousHash: string, ...elements: Array<HTMLElement | null>) {
  elements.forEach(element => element?.remove());
  window.history.replaceState(null, '', previousHash || '#');
}

describe('SAnchor', () => {
  describe('rendering', () => {
    it('renders nested items and custom class', () => {
      const wrapper = mount(SAnchor, {
        props: {
          class: 'custom-anchor',
          items,
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Overview');
      expect(wrapper.text()).toContain('API');
      expect(wrapper.html()).toContain('custom-anchor');

      wrapper.unmount();
    });

    it('supports themed active colors', () => {
      const wrapper = mount(SAnchor, {
        props: {
          color: 'success',
          items,
          modelValue: '#overview',
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('a[href="#overview"]').classes()).toContain('data-[state=active]:text-success');
      expect(wrapper.find('span[aria-hidden="true"]').classes()).toContain('bg-success');

      wrapper.unmount();
    });

    it('applies sticky root styles and exposes the offset css variable', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          offsetTop: 64,
          sticky: true
        },
        attachTo: document.body
      });

      const root = wrapper.find('nav');
      expect(root.classes()).toContain('sticky');
      expect(root.element.style.getPropertyValue('--vean-anchor-offset-top')).toBe('64px');

      wrapper.unmount();
    });

    it('supports horizontal orientation', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          orientation: 'horizontal',
          sticky: false
        },
        attachTo: document.body
      });

      const root = wrapper.find('nav');
      expect(root.attributes('data-orientation')).toBe('horizontal');
      expect(root.classes()).toContain('flex-row');

      wrapper.unmount();
    });

    it('falls back to the href when title is missing', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items: [{ href: '#raw' }],
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('#raw');

      wrapper.unmount();
    });

    it('lets an explicit aria-label override the locale default', () => {
      const wrapper = mount(SAnchor, {
        props: {
          'aria-label': 'Page navigation',
          items,
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('nav').attributes('aria-label')).toBe('Page navigation');

      wrapper.unmount();
    });
  });

  describe('active state', () => {
    it('scrolls to the target and emits selection events on click', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);
      const pushState = vi.spyOn(window.history, 'pushState');

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      await wrapper.find('a[href="#api"]').trigger('click');

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth', top: 520 }));
      expect(pushState).toHaveBeenCalledWith({}, '', '#api');
      expect(wrapper.find('a[href="#api"]').attributes('aria-current')).toBe('location');
      expect(wrapper.emitted('activeChange')).toEqual([['#api']]);
      expect(wrapper.emitted('itemSelect')).toHaveLength(1);
      expect(wrapper.emitted('update:modelValue')).toEqual([['#api']]);

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
      pushState.mockRestore();
    });

    it('updates the active anchor when the container scrolls', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', -40);
      const usage = createSection('usage', 120);
      const api = createSection('api', 360);
      const pushState = vi.spyOn(window.history, 'pushState');
      const replaceState = vi.spyOn(window.history, 'replaceState');

      window.history.replaceState(null, '', previousHash || '#');

      const wrapper = mount(SAnchor, {
        props: {
          bounds: 10,
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      container.dispatchEvent(new Event('scroll'));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('a[href="#overview"]').attributes('aria-current')).toBe('location');
      expect(replaceState).toHaveBeenCalledWith({}, '', '#overview');
      expect(pushState).not.toHaveBeenCalled();

      overview.setTop(-260);
      usage.setTop(-20);
      api.setTop(40);

      container.dispatchEvent(new Event('scroll'));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('a[href="#usage"]').attributes('aria-current')).toBe('location');
      expect(replaceState).toHaveBeenLastCalledWith({}, '', '#usage');

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
      pushState.mockRestore();
      replaceState.mockRestore();
    });

    it('clears the active anchor when no section is visible', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 100);
      const usage = createSection('usage', 300);
      const api = createSection('api', 540);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      container.dispatchEvent(new Event('scroll'));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('a[href="#overview"]').attributes('aria-current')).toBeUndefined();
      expect(wrapper.find('a[href="#usage"]').attributes('aria-current')).toBeUndefined();

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('syncs to the current location hash on mount', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      window.history.replaceState(null, '', '#api');

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto', top: 520 }));
      expect(wrapper.find('a[href="#api"]').attributes('aria-current')).toBe('location');

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('re-syncs the location hash when the custom container replaces the initial window fallback', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      window.history.replaceState(null, '', '#api');

      const wrapper = mount(
        {
          components: { SAnchor },
          setup() {
            const containerRef = shallowRef<HTMLElement>();

            onMounted(() => {
              containerRef.value = container;
            });

            return {
              getContainer: () => containerRef.value ?? window,
              items
            };
          },
          template: '<SAnchor :items="items" :get-container="getContainer" :sticky="false" />'
        },
        {
          attachTo: document.body
        }
      );

      await nextTick();
      await nextTick();
      await nextTick();

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto', top: 520 }));
      expect(wrapper.find('a[href="#api"]').attributes('aria-current')).toBe('location');

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('offsets the scroll target and css variable by offsetTop', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          offsetTop: 80,
          sticky: false
        },
        attachTo: document.body
      });

      await wrapper.find('a[href="#api"]').trigger('click');

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 440 }));
      expect(wrapper.find('nav').element.style.getPropertyValue('--vean-anchor-offset-top')).toBe('80px');

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('lets targetOffset override offsetTop for scroll math', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          offsetTop: 80,
          targetOffset: 120,
          sticky: false
        },
        attachTo: document.body
      });

      await wrapper.find('a[href="#api"]').trigger('click');

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 400 }));

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('honors bounds when detecting the active section', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', -40);
      const usage = createSection('usage', 120);
      const api = createSection('api', 360);

      const wrapper = mount(SAnchor, {
        props: {
          bounds: 200,
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      container.dispatchEvent(new Event('scroll'));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('a[href="#usage"]').attributes('aria-current')).toBe('location');

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('uses replaceState on click when replace is enabled', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);
      const pushState = vi.spyOn(window.history, 'pushState');
      const replaceState = vi.spyOn(window.history, 'replaceState');

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          replace: true,
          sticky: false
        },
        attachTo: document.body
      });

      await wrapper.find('a[href="#api"]').trigger('click');

      expect(replaceState).toHaveBeenCalledWith({}, '', '#api');
      expect(pushState).not.toHaveBeenCalled();

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
      pushState.mockRestore();
      replaceState.mockRestore();
    });

    it('applies getCurrentAnchor to transform the emitted value', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', -40);
      const usage = createSection('usage', 120);
      const api = createSection('api', 360);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          getCurrentAnchor: (href: string) => (href === '#usage' ? '#custom' : href),
          items,
          sticky: false
        },
        attachTo: document.body
      });

      overview.setTop(-260);
      usage.setTop(-20);
      api.setTop(40);

      container.dispatchEvent(new Event('scroll'));
      await wrapper.vm.$nextTick();

      // mount-time sync emits '#overview' first, then the scroll emits the transformed '#custom'
      expect(wrapper.emitted('update:modelValue')).toContainEqual(['#custom']);
      expect(wrapper.emitted('activeChange')).toContainEqual(['#usage']);

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('follows the controlled modelValue without internal scroll', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          modelValue: '#overview',
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('a[href="#overview"]').attributes('aria-current')).toBe('location');

      await wrapper.setProps({ modelValue: '#usage' });

      expect(wrapper.find('a[href="#usage"]').attributes('aria-current')).toBe('location');
      expect(wrapper.find('a[href="#overview"]').attributes('aria-current')).toBeUndefined();
      expect(container.scrollTo).not.toHaveBeenCalledWith(expect.objectContaining({ top: 280 }));

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });
  });

  describe('disabled', () => {
    it('renders a disabled item as inert', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);
      const itemsWithDisabled = [
        { href: '#overview', title: 'Overview' },
        { href: '#usage', title: 'Usage', disabled: true },
        { href: '#api', title: 'API' }
      ];

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items: itemsWithDisabled,
          sticky: false
        },
        attachTo: document.body
      });

      const link = wrapper.find('a[href="#usage"]');
      expect(link.attributes('aria-disabled')).toBe('true');
      expect(link.attributes('tabindex')).toBe('-1');
      expect(link.attributes('data-disabled')).toBeDefined();

      await link.trigger('click');

      expect(container.scrollTo).not.toHaveBeenCalled();
      expect(wrapper.emitted('itemSelect')).toBeUndefined();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('applies linkProps.disabled to items without an explicit value', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          linkProps: { disabled: true },
          sticky: false
        },
        attachTo: document.body
      });

      wrapper.findAll('a').forEach(link => {
        expect(link.attributes('aria-disabled')).toBe('true');
      });

      wrapper.unmount();
    });

    it('lets an explicit item.disabled win over linkProps.disabled', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items: [
            { href: '#overview', title: 'Overview' },
            { href: '#usage', title: 'Usage', disabled: true }
          ],
          linkProps: { disabled: false },
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('a[href="#overview"]').attributes('aria-disabled')).toBeUndefined();
      expect(wrapper.find('a[href="#usage"]').attributes('aria-disabled')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('keyboard', () => {
    it('keeps links focusable for native keyboard activation', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      const link = wrapper.find('a[href="#api"]');
      expect(link.attributes('tabindex')).toBeUndefined();

      (link.element as HTMLElement).focus();
      expect(document.activeElement).toBe(link.element);

      // browsers activate links natively after Enter; simulate the click dispatch
      await link.trigger('keydown', { key: 'Enter' });
      await link.trigger('click');

      expect(container.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth', top: 520 }));
      expect(wrapper.emitted('itemSelect')).toHaveLength(1);

      wrapper.unmount();
      cleanup(previousHash, overview.element, usage.element, api.element, container);
    });

    it('removes disabled links from the tab order', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items: [{ href: '#overview', title: 'Overview', disabled: true }],
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('a').attributes('tabindex')).toBe('-1');

      wrapper.unmount();
    });
  });

  describe('nesting', () => {
    it('highlights the parent wrapper when a child is active', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          modelValue: '#api',
          sticky: false
        },
        attachTo: document.body
      });

      const wrappers = wrapper.findAll('[data-vean-anchor-item]');
      expect(wrappers).toHaveLength(3);
      expect(wrappers[0].attributes('data-state')).toBe('inactive');
      expect(wrappers[1].attributes('data-state')).toBe('active');
      expect(wrappers[2].attributes('data-state')).toBe('active');

      wrapper.unmount();
    });

    it('forwards indicator/title/sub props to the matching elements', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          indicatorProps: { id: 'ind' },
          titleProps: { id: 'titles' },
          subProps: { id: 'subs' },
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('span[id="ind"]').exists()).toBe(true);
      expect(wrapper.find('span[id="titles"]').exists()).toBe(true);
      expect(wrapper.find('div[id="subs"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('uses linkProps.target as the fallback and lets item.target win', () => {
      const wrapper = mount(SAnchor, {
        props: {
          items: [
            { href: '#overview', title: 'Overview' },
            { href: '#usage', title: 'Usage', target: '_self' }
          ],
          linkProps: { target: '_blank' },
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('a[href="#overview"]').attributes('target')).toBe('_blank');
      expect(wrapper.find('a[href="#usage"]').attributes('target')).toBe('_self');

      wrapper.unmount();
    });
  });

  describe('direction', () => {
    it('reflects dir on the root element', () => {
      const wrapper = mount(SAnchor, {
        props: {
          dir: 'rtl',
          items,
          sticky: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('nav').attributes('dir')).toBe('rtl');

      wrapper.unmount();
    });
  });

  describe('cleanup', () => {
    it('removes the scroll listener on unmount', async () => {
      const previousHash = window.location.hash;
      const container = createContainer();
      const overview = createSection('overview', 80);
      const usage = createSection('usage', 280);
      const api = createSection('api', 520);
      const removeEventListener = vi.spyOn(container, 'removeEventListener');

      const wrapper = mount(SAnchor, {
        props: {
          getContainer: () => container,
          items,
          sticky: false
        },
        attachTo: document.body
      });

      await wrapper.vm.$nextTick();

      wrapper.unmount();

      expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));

      cleanup(previousHash, overview.element, usage.element, api.element, container);
      removeEventListener.mockRestore();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SAnchor, {
        props: {
          items,
          sticky: false
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with nested and disabled items', async () => {
      const wrapper = mount(SAnchor, {
        props: {
          items: [
            { href: '#overview', title: 'Overview' },
            {
              href: '#usage',
              title: 'Usage',
              disabled: true,
              children: [{ href: '#api', title: 'API' }]
            }
          ],
          sticky: false
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

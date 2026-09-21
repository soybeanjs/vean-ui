import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SIcon from '@/components/icon/icon.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SIcon', () => {
  describe('rendering', () => {
    it('renders an icon from iconify string', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attachTo: document.body
      });

      expect(wrapper.find('svg').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders a custom component when icon is a VNode', () => {
      const CustomComp = {
        template: '<span data-custom-icon>Custom</span>'
      };

      const wrapper = mount(SIcon, {
        props: { icon: CustomComp },
        attachTo: document.body
      });

      expect(wrapper.find('[data-custom-icon]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders a custom component when icon is a VNode directly', () => {
      const vnode = h('span', { 'data-vnode-icon': true }, 'VNode');

      const wrapper = mount(SIcon, {
        props: { icon: vnode },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vnode-icon]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders nothing when icon is null', () => {
      const wrapper = mount(SIcon, {
        props: { icon: null },
        attachTo: document.body
      });

      expect(wrapper.find('*').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders nothing when icon is undefined', () => {
      const wrapper = mount(SIcon, {
        props: { icon: undefined },
        attachTo: document.body
      });

      expect(wrapper.find('*').exists()).toBe(false);

      wrapper.unmount();
    });

    it('applies width and height props', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', width: '2rem', height: '2rem' },
        attachTo: document.body
      });

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);

      wrapper.unmount();
    });

    it('inherits default size from SConfigProvider', () => {
      const wrapper = mount(SConfigProvider, {
        props: {
          iconify: { width: '3rem', height: '3rem' }
        },
        slots: {
          default: () => h(SIcon, { icon: 'lucide:check' })
        },
        attachTo: document.body
      });

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
      expect(svg.attributes('width')).toBe('3rem');
      expect(svg.attributes('height')).toBe('3rem');

      wrapper.unmount();
    });

    it('prop size takes precedence over config size', () => {
      const wrapper = mount(SConfigProvider, {
        props: {
          iconify: { width: '3rem', height: '3rem' }
        },
        slots: {
          default: () => h(SIcon, { icon: 'lucide:check', width: '1rem', height: '1rem' })
        },
        attachTo: document.body
      });

      const svg = wrapper.find('svg');
      expect(svg.attributes('width')).toBe('1rem');
      expect(svg.attributes('height')).toBe('1rem');

      wrapper.unmount();
    });
  });

  describe('attributes', () => {
    it('carries the data-vean-icon attribute', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('data-vean-icon')).toBeDefined();

      wrapper.unmount();
    });

    it('applies shrink-0 utility class instead of inline style', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attachTo: document.body
      });

      const svg = wrapper.find('svg');
      expect(svg.classes()).toContain('shrink-0');
      expect(svg.attributes('style') || '').not.toContain('flex-shrink');

      wrapper.unmount();
    });

    it('passes through custom class', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attrs: { class: 'text-primary' },
        attachTo: document.body
      });

      const svg = wrapper.find('svg');
      expect(svg.classes()).toContain('text-primary');

      wrapper.unmount();
    });
  });

  describe('transforms', () => {
    const objectIcon = { body: '<path d="M0 0h24v24H0z" />', width: 24, height: 24 };

    // Iconify 在 onMounted 后异步更新 iconData，需等待重渲染再断言
    async function mountIcon(extraProps: Record<string, unknown>) {
      const wrapper = mount(SIcon, {
        props: { icon: objectIcon, ...extraProps } as never,
        attachTo: document.body
      });
      await nextTick();
      await nextTick();
      return wrapper;
    }

    it('forwards hFlip as a horizontal mirror on the icon body', async () => {
      const wrapper = await mountIcon({ hFlip: true });

      expect(wrapper.find('svg').html()).toContain('scale(-1 1)');

      wrapper.unmount();
    });

    it('forwards vFlip as a vertical mirror on the icon body', async () => {
      const wrapper = await mountIcon({ vFlip: true });

      expect(wrapper.find('svg').html()).toContain('scale(1 -1)');

      wrapper.unmount();
    });

    it('forwards rotate string to the icon body', async () => {
      const wrapper = await mountIcon({ rotate: '90deg' });

      expect(wrapper.find('svg').html()).toContain('rotate(90 ');

      wrapper.unmount();
    });

    it('forwards rotate number as quarter turns to the icon body', async () => {
      const wrapper = await mountIcon({ rotate: 1 });

      expect(wrapper.find('svg').html()).toContain('rotate(90 ');

      wrapper.unmount();
    });

    it('forwards flip string as combined flips', async () => {
      const wrapper = await mountIcon({ flip: 'horizontal,vertical' });

      expect(wrapper.find('svg').html()).toContain('rotate(180 ');

      wrapper.unmount();
    });

    it('applies inline as vertical-align style', async () => {
      const wrapper = await mountIcon({ inline: true });

      expect(wrapper.find('svg').attributes('style') || '').toContain('vertical-align');

      wrapper.unmount();
    });

    it('applies color to the icon style', async () => {
      const wrapper = await mountIcon({ color: 'red' });

      expect(wrapper.find('svg').attributes('style') || '').toContain('color: red');

      wrapper.unmount();
    });

    it('renders a span when mode is bg', async () => {
      const wrapper = await mountIcon({ mode: 'bg' });

      expect(wrapper.find('svg').exists()).toBe(false);
      expect(wrapper.element.tagName).toBe('SPAN');

      wrapper.unmount();
    });

    it('forwards id and title to the svg element', async () => {
      const wrapper = await mountIcon({ id: 'icon-id', title: 'Icon title' });

      const svg = wrapper.find('svg');
      expect(svg.attributes('id')).toBe('icon-id');
      expect(svg.attributes('title')).toBe('Icon title');

      wrapper.unmount();
    });

    it('does not leak transform props onto custom component root', () => {
      const CustomComp = {
        template: '<span data-custom-icon>Custom</span>'
      };

      const wrapper = mount(SIcon, {
        props: { icon: CustomComp, hFlip: true },
        attachTo: document.body
      });

      const root = wrapper.find('[data-custom-icon]');
      expect(root.attributes('h-flip')).toBeUndefined();
      expect(root.attributes('hflip')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('sets aria-hidden="true" by default for decorative icons', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');

      wrapper.unmount();
    });

    it('does not set aria-hidden when aria-label is provided', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', ariaLabel: 'Check' },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('aria-hidden')).toBeUndefined();
      expect(wrapper.find('svg').attributes('aria-label')).toBe('Check');

      wrapper.unmount();
    });

    it('does not set aria-hidden when aria-labelledby is provided', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', ariaLabelledby: 'label-id' },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('aria-hidden')).toBeUndefined();

      wrapper.unmount();
    });

    it('respects explicit aria-hidden from user', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', ariaHidden: false },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('aria-hidden')).toBeUndefined();

      wrapper.unmount();
    });

    it('respects explicit aria-hidden=true from user', () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', ariaHidden: true },
        attachTo: document.body
      });

      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');

      wrapper.unmount();
    });

    it('has no a11y violations with aria-label', async () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check', ariaLabel: 'Check icon' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations for decorative icon', async () => {
      const wrapper = mount(SIcon, {
        props: { icon: 'lucide:check' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toEqual([]);

      wrapper.unmount();
    });
  });
});

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SBreadcrumb from '@/components/breadcrumb/breadcrumb.vue';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { href: '/', label: 'Home', value: 'home' },
  { href: '/components', label: 'Components', value: 'components' },
  { label: 'Breadcrumb', value: 'breadcrumb' }
];

const ellipsisItems = [
  { href: '/', label: 'Home', value: 'home' },
  { href: '/guides', label: 'Guides', value: 'guides' },
  { href: '/patterns', label: 'Patterns', value: 'patterns' },
  { href: '/components', label: 'Components', value: 'components' },
  { label: 'Breadcrumb', value: 'breadcrumb' }
];

const BreadcrumbHarness = {
  components: {
    SBreadcrumb,
    SConfigProvider
  },
  emits: ['click'],
  props: ['breadcrumbProps'],
  template: `
    <SConfigProvider>
      <SBreadcrumb v-bind="breadcrumbProps" @click="$emit('click', $event)" />
    </SConfigProvider>
  `
};

function mountBreadcrumb(breadcrumbProps: Record<string, unknown>) {
  return mount(BreadcrumbHarness, {
    props: { breadcrumbProps },
    attachTo: document.body
  });
}

describe('SBreadcrumb', () => {
  describe('rendering', () => {
    it('renders breadcrumb links, current page, and custom root class', () => {
      const wrapper = mountBreadcrumb({
        class: 'custom-breadcrumb',
        items
      });

      expect(wrapper.find('nav').classes()).toContain('custom-breadcrumb');
      expect(wrapper.findAll('a')).toHaveLength(2);
      expect(wrapper.find('[aria-current="page"]').text()).toBe('Breadcrumb');

      wrapper.unmount();
    });
  });

  describe('ellipsis state', () => {
    it('collapses middle items when ellipsis is enabled', () => {
      const wrapper = mountBreadcrumb({
        ellipsis: true,
        items: ellipsisItems
      });
      const text = wrapper.find('nav').text();

      expect(text).toContain('Home');
      expect(text).toContain('Components');
      expect(text).toContain('Breadcrumb');
      expect(text).not.toContain('Guides');
      expect(text).not.toContain('Patterns');
      expect(wrapper.findAll('a')).toHaveLength(2);
      expect(wrapper.find('[aria-current="page"]').text()).toBe('Breadcrumb');

      wrapper.unmount();
    });

    it('supports a custom ellipsis range [number, number]', () => {
      const wrapper = mountBreadcrumb({
        ellipsis: [2, 4],
        items: ellipsisItems
      });
      const text = wrapper.find('nav').text();

      // items 0-1 visible, items 2-3 collapsed, item 4 visible
      expect(text).toContain('Home');
      expect(text).toContain('Guides');
      expect(text).toContain('Breadcrumb');
      expect(text).not.toContain('Patterns');
      expect(text).not.toContain('Components');
      expect(wrapper.findAll('a')).toHaveLength(2);

      wrapper.unmount();
    });

    it('normalizes a range that starts at 0 or ends at length', () => {
      const wrapper = mountBreadcrumb({
        ellipsis: [0, 5],
        items: ellipsisItems
      });
      const text = wrapper.find('nav').text();

      // start 0 → 1, end 5 → 4: items 0 and 4 visible, middle collapsed
      expect(text).toContain('Home');
      expect(text).toContain('Breadcrumb');
      expect(text).not.toContain('Guides');
      expect(wrapper.findAll('a')).toHaveLength(1);

      wrapper.unmount();
    });

    it('does not collapse when there are fewer than 5 items', () => {
      const wrapper = mountBreadcrumb({
        ellipsis: true,
        items
      });
      const text = wrapper.find('nav').text();

      expect(text).toContain('Home');
      expect(text).toContain('Components');
      expect(text).toContain('Breadcrumb');
      expect(wrapper.find('[data-vean-breadcrumb-ellipsis]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('emits click when a breadcrumb item is activated', async () => {
      const wrapper = mountBreadcrumb({ items });

      await wrapper.find('a').trigger('click');

      expect(wrapper.emitted('click')).toEqual([[items[0]]]);

      wrapper.unmount();
    });

    it('does not emit click for disabled items', async () => {
      const disabledItems = [
        { href: '/', label: 'Home', value: 'home' },
        { href: '/components', label: 'Components', value: 'components', disabled: true },
        { label: 'Breadcrumb', value: 'breadcrumb' }
      ];
      const wrapper = mountBreadcrumb({ items: disabledItems });

      await wrapper.findAll('a')[1].trigger('click');

      expect(wrapper.emitted('click')).toBeUndefined();

      wrapper.unmount();
    });

    it('emits click with item data for the activated item', async () => {
      const wrapper = mountBreadcrumb({ items });

      await wrapper.findAll('a')[1].trigger('click');

      expect(wrapper.emitted('click')).toEqual([[items[1]]]);

      wrapper.unmount();
    });
  });

  describe('custom slots', () => {
    it('renders custom separator slot content', () => {
      const wrapper = mount(
        {
          components: { SBreadcrumb, SConfigProvider },
          props: ['breadcrumbProps'],
          template: `
            <SConfigProvider>
              <SBreadcrumb v-bind="breadcrumbProps">
                <template #separator><span data-custom-separator>/</span></template>
              </SBreadcrumb>
            </SConfigProvider>
          `
        },
        {
          props: { breadcrumbProps: { items } },
          attachTo: document.body
        }
      );

      expect(wrapper.findAll('[data-custom-separator]').length).toBeGreaterThanOrEqual(2);
      wrapper.unmount();
    });

    it('renders custom item-label slot content for the current page', () => {
      const wrapper = mount(
        {
          components: { SBreadcrumb, SConfigProvider },
          props: ['breadcrumbProps'],
          template: `
            <SConfigProvider>
              <SBreadcrumb v-bind="breadcrumbProps">
                <template #item-label="{ item }"><b data-custom-label>{{ item.label }}</b></template>
              </SBreadcrumb>
            </SConfigProvider>
          `
        },
        {
          props: { breadcrumbProps: { items } },
          attachTo: document.body
        }
      );

      const pageLabel = wrapper.find('[aria-current="page"] b[data-custom-label]');

      expect(pageLabel.text()).toBe('Breadcrumb');
      wrapper.unmount();
    });

    it('renders custom ellipsis-icon slot content', () => {
      const wrapper = mount(
        {
          components: { SBreadcrumb, SConfigProvider },
          props: ['breadcrumbProps'],
          template: `
            <SConfigProvider>
              <SBreadcrumb v-bind="breadcrumbProps">
                <template #ellipsis-icon><span data-custom-ellipsis-icon>···</span></template>
              </SBreadcrumb>
            </SConfigProvider>
          `
        },
        {
          props: { breadcrumbProps: { ellipsis: true, items: ellipsisItems } },
          attachTo: document.body
        }
      );

      expect(wrapper.find('[data-custom-ellipsis-icon]').exists()).toBe(true);
      wrapper.unmount();
    });
  });

  describe('size variants', () => {
    const textClassBySize: Record<string, string> = {
      xs: 'text-2xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
      '2xl': 'text-xl'
    };

    it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const)('applies the %s size variant', size => {
      const wrapper = mountBreadcrumb({
        size,
        items
      });

      expect(wrapper.find('nav').classes().join(' ')).toContain(textClassBySize[size]);
      wrapper.unmount();
    });
  });

  describe('aria attributes', () => {
    it('marks the current page with aria-current and disables it', () => {
      const wrapper = mountBreadcrumb({ items });
      const page = wrapper.find('[aria-current="page"]');

      expect(page.exists()).toBe(true);
      expect(page.attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });

    it('marks separators and ellipsis as hidden from assistive tech', () => {
      const wrapper = mountBreadcrumb({
        ellipsis: true,
        items: ellipsisItems
      });

      const separators = wrapper.findAll('[data-vean-breadcrumb-separator]');
      const ellipsis = wrapper.find('[data-vean-breadcrumb-ellipsis]');

      expect(separators.every(separator => separator.attributes('aria-hidden') === 'true')).toBe(true);
      expect(separators.every(separator => separator.attributes('role') === 'presentation')).toBe(true);
      expect(ellipsis.attributes('aria-hidden')).toBe('true');
      wrapper.unmount();
    });

    it('provides a localized aria-label on the nav', () => {
      const wrapper = mountBreadcrumb({ items });

      expect(wrapper.find('nav').attributes('aria-label')).toBe('breadcrumb');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mountBreadcrumb({ items });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SPagination from '@/components/pagination/pagination.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SPagination', () => {
  describe('rendering', () => {
    it('renders a nav element with pagination root', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        attachTo: document.body
      });

      expect(wrapper.find('nav').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(SPagination, {
        props: { total: 50, pageSize: 10, class: 'my-pagination' },
        attachTo: document.body
      });

      expect(wrapper.find('.my-pagination').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders action buttons and page items', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-pagination-first]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-pagination-prev]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-pagination-next]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-pagination-last]').exists()).toBe(true);
      // 10 pages: 1-10 visible (showEdges defaults to false, 10 < itemCount 2*2+1=5? no, 10 > 5)
      const pageItems = wrapper.findAll('[data-vean-pagination-list-item]');

      expect(pageItems.length).toBe(5);
      expect(pageItems[0].text()).toBe('1');

      wrapper.unmount();
    });

    it('marks the first item as the current page by default', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        attachTo: document.body
      });

      const selected = wrapper.findAll('[data-selected]');

      expect(selected).toHaveLength(1);
      expect(selected[0].attributes('aria-current')).toBe('page');
      expect(selected[0].text()).toBe('1');

      wrapper.unmount();
    });

    it('renders full range when page count is small', () => {
      const wrapper = mount(SPagination, {
        props: { total: 30, pageSize: 10 },
        attachTo: document.body
      });

      const pageItems = wrapper.findAll('[data-vean-pagination-list-item]');

      expect(pageItems.length).toBe(3);
      expect(pageItems.map(item => item.text())).toEqual(['1', '2', '3']);

      wrapper.unmount();
    });

    it('hides first/last buttons when showFirstOrLast is false', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10, showFirstOrLast: false },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-pagination-first]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-pagination-last]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-pagination-prev]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-pagination-next]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('keeps the action buttons neutral while actionVariant is off', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10, variant: 'solid' },
        attachTo: document.body
      });

      const actionClasses = wrapper.find('[data-vean-pagination-first]').classes();

      expect(actionClasses.some(className => className.startsWith('data-[vean-pagination-action]:'))).toBe(false);

      wrapper.unmount();
    });

    it('paints the action buttons with the variant styling when actionVariant is true', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10, variant: 'solid', actionVariant: true },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-pagination-first]').classes()).toContain(
        'data-[vean-pagination-action]:bg-primary'
      );
      expect(wrapper.find('[data-vean-pagination-last]').classes()).toContain(
        'data-[vean-pagination-action]:bg-primary'
      );

      wrapper.unmount();
    });
  });

  describe('page navigation', () => {
    it('emits update:page when a page item is clicked', async () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10, page: 1 },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-pagination-list-item]')[2].trigger('click');

      expect(wrapper.emitted('update:page')).toEqual([[3]]);

      wrapper.unmount();
    });

    it('navigates with prev and next buttons', async () => {
      const page = ref(3);
      const wrapper = mount(SPagination, {
        props: {
          total: 100,
          pageSize: 10,
          page: page.value,
          'onUpdate:page': (value: number) => {
            page.value = value;
          }
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-pagination-prev]').trigger('click');
      expect(page.value).toBe(2);

      // sync the prop so the internal page state updates before the next click
      await wrapper.setProps({ page: page.value });

      await wrapper.find('[data-vean-pagination-next]').trigger('click');
      expect(page.value).toBe(3);

      wrapper.unmount();
    });

    it('jumps to first and last pages', async () => {
      const page = ref(3);
      const wrapper = mount(SPagination, {
        props: {
          total: 100,
          pageSize: 10,
          page: page.value,
          'onUpdate:page': (value: number) => {
            page.value = value;
          }
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-pagination-first]').trigger('click');
      expect(page.value).toBe(1);

      await wrapper.find('[data-vean-pagination-last]').trigger('click');
      expect(page.value).toBe(10);

      wrapper.unmount();
    });

    it('disables prev on the first page and next on the last page', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10, page: 1 },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-pagination-prev]').attributes('disabled')).toBeDefined();
      expect(wrapper.find('[data-vean-pagination-first]').attributes('disabled')).toBeDefined();
      expect(wrapper.find('[data-vean-pagination-next]').attributes('disabled')).toBeUndefined();

      wrapper.unmount();
    });

    it('disables all interaction when disabled is true', async () => {
      const page = ref(1);
      const wrapper = mount(SPagination, {
        props: {
          total: 100,
          pageSize: 10,
          disabled: true,
          page: page.value,
          'onUpdate:page': (value: number) => {
            page.value = value;
          }
        },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-pagination-list-item]')[0].trigger('click');
      await wrapper.find('[data-vean-pagination-next]').trigger('click');

      expect(page.value).toBe(1);
      expect(wrapper.emitted('update:page')).toBeUndefined();

      wrapper.unmount();
    });

    it('supports v-model:page', async () => {
      const page = ref(2);
      const wrapper = mount(SPagination, {
        props: {
          total: 100,
          pageSize: 10,
          page: page.value,
          'onUpdate:page': (value: number) => {
            page.value = value;
          }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-selected]').text()).toBe('2');

      await wrapper.findAll('[data-vean-pagination-list-item]')[4].trigger('click');

      expect(page.value).toBe(5);

      // props passed to mount are a static snapshot; sync the prop so the DOM re-renders
      await wrapper.setProps({ page: page.value });
      await nextTick();

      const selected = wrapper.find('[data-selected]');

      expect(selected.text()).toBe('5');

      wrapper.unmount();
    });
  });

  describe('ellipsis state', () => {
    it('shows ellipsis in the middle when showEdges is true', () => {
      const wrapper = mount(SPagination, {
        props: { total: 1000, pageSize: 10, page: 50, showEdges: true },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-pagination-ellipsis]').length).toBe(2);
      // 1, ellipsis, 48, 49, 50, 51, 52, ellipsis, 100
      const pageItems = wrapper.findAll('[data-vean-pagination-list-item]');

      expect(pageItems.map(item => item.text())).toEqual(['1', '48', '49', '50', '51', '52', '100']);

      wrapper.unmount();
    });

    it('keeps first/last pages visible when showEdges is false', () => {
      const wrapper = mount(SPagination, {
        props: { total: 1000, pageSize: 10, page: 5 },
        attachTo: document.body
      });

      // showEdges false: only middle window rendered without edges
      const pageItems = wrapper.findAll('[data-vean-pagination-list-item]');

      expect(pageItems.map(item => item.text())).toEqual(['3', '4', '5', '6', '7']);

      wrapper.unmount();
    });
  });

  describe('sibling count', () => {
    it('adjusts the window with siblingCount', () => {
      const wrapper = mount(SPagination, {
        props: { total: 1000, pageSize: 10, page: 5, siblingCount: 1 },
        attachTo: document.body
      });

      const pageItems = wrapper.findAll('[data-vean-pagination-list-item]');

      expect(pageItems.map(item => item.text())).toEqual(['4', '5', '6']);

      wrapper.unmount();
    });
  });

  describe('localization', () => {
    it('localizes action button aria-labels from the locale registry', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-pagination-first]').attributes('aria-label')).toBe('First page');
      expect(wrapper.find('[data-vean-pagination-prev]').attributes('aria-label')).toBe('Previous page');
      expect(wrapper.find('[data-vean-pagination-next]').attributes('aria-label')).toBe('Next page');
      expect(wrapper.find('[data-vean-pagination-last]').attributes('aria-label')).toBe('Last page');

      wrapper.unmount();
    });

    it('localizes page labels with interpolation', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-pagination-list-item]')[0].attributes('aria-label')).toBe('Page 1');

      wrapper.unmount();
    });

    it('applies zh-CN locale via ConfigProvider', () => {
      const wrapper = mount(
        {
          components: { SPagination, SConfigProvider },
          template: `
            <SConfigProvider locale="zh-CN">
              <SPagination :total="100" :page-size="10" />
            </SConfigProvider>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-pagination-first]').attributes('aria-label')).toBe('第一页');
      expect(wrapper.findAll('[data-vean-pagination-list-item]')[0].attributes('aria-label')).toBe('第 1 页');

      wrapper.unmount();
    });
  });

  describe('custom slots', () => {
    it('renders custom prev/next slot content', () => {
      const wrapper = mount(SPagination, {
        props: { total: 100, pageSize: 10 },
        slots: {
          prev: '<span data-custom-prev>‹</span>',
          next: '<span data-custom-next>›</span>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-custom-prev]').exists()).toBe(true);
      expect(wrapper.find('[data-custom-next]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders custom ellipsis slot content', () => {
      const wrapper = mount(SPagination, {
        props: { total: 1000, pageSize: 10, page: 50, showEdges: true },
        slots: {
          ellipsis: '<span data-custom-ellipsis>•••</span>'
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-custom-ellipsis]').length).toBe(2);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SPagination, {
        props: { total: 50, pageSize: 10 },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with edges and ellipsis', async () => {
      const wrapper = mount(SPagination, {
        props: { total: 1000, pageSize: 10, page: 5, showEdges: true },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

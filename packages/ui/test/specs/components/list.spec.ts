import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SList from '@/components/list/list.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SList', () => {
  describe('rendering', () => {
    it('renders a ul element with default slot content', () => {
      const wrapper = mount(SList, {
        slots: { default: '<li>Item 1</li><li>Item 2</li>' },
        attachTo: document.body
      });

      const ul = wrapper.get('ul');
      expect(ul.attributes('data-vean-list-root')).toBe('');
      expect(ul.findAll('li')).toHaveLength(2);

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(SList, {
        props: { class: 'my-list' },
        slots: { default: '<li>Item</li>' },
        attachTo: document.body
      });

      expect(wrapper.get('ul').classes()).toContain('my-list');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SList, {
        slots: { default: '<li>One</li><li>Two</li>' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

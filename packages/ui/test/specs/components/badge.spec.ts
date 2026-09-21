import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SBadge from '@/components/badge/badge.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SBadge', () => {
  describe('rendering', () => {
    it('renders the default slot and content text', () => {
      const wrapper = mount(SBadge, {
        props: {
          content: '99+'
        },
        slots: {
          default: '<button type="button">Inbox</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-badge-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-badge-content]').text()).toBe('99+');
      expect(wrapper.text()).toContain('Inbox');

      wrapper.unmount();
    });

    it('renders custom content slot output', () => {
      const wrapper = mount(SBadge, {
        slots: {
          default: '<button type="button">Inbox</button>',
          content: '<span data-testid="content-slot">New!</span>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-testid="content-slot"]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-badge-content]').text()).toContain('New!');

      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mount(SBadge, {
        props: {
          class: 'my-badge',
          content: '99+'
        },
        slots: {
          default: '<button type="button">Inbox</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-badge-root]').classes()).toContain('my-badge');

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('shows content by default', () => {
      const wrapper = mount(SBadge, {
        props: {
          content: '99+'
        },
        slots: {
          default: '<button type="button">Inbox</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-badge-content]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides content when open is false', () => {
      const wrapper = mount(SBadge, {
        props: {
          open: false,
          content: '99+'
        },
        slots: {
          default: '<button type="button">Inbox</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-badge-content]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mount(SBadge, {
        props: {
          content: '99+'
        },
        slots: {
          default: '<button type="button">Inbox</button>'
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

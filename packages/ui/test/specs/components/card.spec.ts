import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import SCardCollapsibleTrigger from '@/components/card/card-collapsible-trigger.vue';
import SCard from '@/components/card/card.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SCard', () => {
  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SCard, {
        slots: { default: '<p>Card content</p>' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Card content');

      wrapper.unmount();
    });

    it('renders title slot content', () => {
      const wrapper = mount(SCard, {
        slots: {
          title: 'Card Title',
          default: '<p>Content</p>'
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Card Title');
      expect(wrapper.text()).toContain('Content');

      wrapper.unmount();
    });

    it('renders the card chrome with the owned data attributes', () => {
      const wrapper = mount(SCard, {
        props: { title: 'Card Title', description: 'Card description' },
        slots: {
          extra: '<span data-extra>Extra</span>',
          footer: '<span data-footer>Footer</span>',
          default: '<p>Body</p>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-card-header]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-card-title-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-card-title]').text()).toBe('Card Title');
      expect(wrapper.find('[data-vean-card-description]').text()).toBe('Card description');
      expect(wrapper.find('[data-vean-card-content]').text()).toContain('Body');
      expect(wrapper.find('[data-vean-card-footer]').text()).toContain('Footer');
      expect(wrapper.find('[data-extra]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('composes the collapsible primitives for the root and the content', () => {
      const wrapper = mount(SCard, {
        slots: { title: 'Title', default: '<p>Body</p>' },
        attachTo: document.body
      });

      const root = wrapper.get('[data-vean-card-root]');

      expect(root.attributes('data-vean-collapsible-root')).toBe('');
      expect(root.attributes('data-header-visible')).toBe('true');
      expect(root.attributes('data-footer-visible')).toBe('false');
      expect(wrapper.get('[data-vean-card-content]').attributes('data-vean-collapsible-content')).toBe('');
      expect(wrapper.get('[data-vean-card-content]').attributes('tabindex')).toBe('-1');

      wrapper.unmount();
    });

    it('omits the header when there is nothing to render', () => {
      const wrapper = mount(SCard, {
        slots: { default: '<p>Body only</p>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-card-header]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-card-footer]').exists()).toBe(false);
      expect(wrapper.get('[data-vean-card-root]').attributes('data-header-visible')).toBe('false');

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(SCard, {
        props: { class: 'my-card' },
        slots: {
          title: 'Card',
          default: '<p>Content</p>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-card-root]').classes()).toContain('my-card');

      wrapper.unmount();
    });

    it('merges per-part props and classes into the chrome nodes', () => {
      const wrapper = mount(SCard, {
        props: {
          title: 'Card',
          titleProps: { class: 'my-title' },
          contentProps: { class: 'my-content' }
        },
        slots: { default: '<p>Content</p>' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-card-title]').classes()).toContain('my-title');
      expect(wrapper.get('[data-vean-card-content]').classes()).toContain('my-content');

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('is open by default', () => {
      const wrapper = mount(SCard, {
        slots: { title: 'Card', default: '<p>Body</p>' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-card-root]').attributes('data-state')).toBe('open');

      wrapper.unmount();
    });

    it('reflects the controlled closed state', () => {
      const wrapper = mount(SCard, {
        props: { open: false },
        slots: { title: 'Card', default: '<p>Body</p>' },
        attachTo: document.body
      });

      expect(wrapper.get('[data-vean-card-root]').attributes('data-state')).toBe('closed');

      wrapper.unmount();
    });

    it('collapses through the collapsible trigger and emits update:open', async () => {
      const wrapper = mount(SCard, {
        props: { title: 'Card', defaultOpen: true },
        slots: {
          extra: () => h(SCardCollapsibleTrigger, { asChild: false }),
          default: '<p>Body</p>'
        },
        attachTo: document.body
      });

      const trigger = wrapper.get('[data-vean-collapsible-trigger]');

      expect(trigger.attributes('aria-expanded')).toBe('true');

      await trigger.trigger('click');

      expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
      expect(wrapper.get('[data-vean-card-root]').attributes('data-state')).toBe('closed');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SCard, {
        slots: {
          title: 'Accessible Card',
          default: '<p>Card body content</p>'
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with a collapsible trigger', async () => {
      const wrapper = mount(SCard, {
        props: { title: 'Collapsible Card', defaultOpen: true },
        slots: {
          // The trigger renders an icon-only button, so it needs a caller-provided accessible name.
          extra: () => h(SCardCollapsibleTrigger, { 'aria-label': 'Toggle card content' }),
          default: '<p>Card body content</p>'
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

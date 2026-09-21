import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import STag from '@/components/tag/tag.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('STag', () => {
  describe('rendering', () => {
    it('renders tag with text content', () => {
      const wrapper = mount(STag, {
        props: { content: 'New' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tag]').exists()).toBe(true);
      expect(wrapper.text()).toContain('New');

      wrapper.unmount();
    });

    it('renders default slot content', () => {
      const wrapper = mount(STag, {
        slots: { default: 'Custom Tag' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Custom Tag');

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(STag, {
        props: { content: 'Tag', class: 'my-tag' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tag]').classes()).toContain('my-tag');

      wrapper.unmount();
    });

    it('renders close icon when closable', () => {
      const wrapper = mount(STag, {
        props: { content: 'Tag', closable: true },
        attachTo: document.body
      });

      expect(wrapper.find('svg').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders the close control as an accessible button', () => {
      const wrapper = mount(STag, {
        props: { content: 'Closable', closable: true },
        attachTo: document.body
      });

      const closeButton = wrapper.find('button[aria-label]');
      expect(closeButton.exists()).toBe(true);
      expect(closeButton.attributes('type')).toBe('button');
      expect(closeButton.attributes('aria-label')).toBe('Remove Closable');

      wrapper.unmount();
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mount(STag, {
        props: { content: 'Tag' },
        slots: {
          leading: '<span data-leading>L</span>',
          trailing: '<span data-trailing>T</span>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-leading]').exists()).toBe(true);
      expect(wrapper.find('[data-trailing]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('is visible by default', () => {
      const wrapper = mount(STag, {
        props: { content: 'Visible' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tag]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides when open is false', () => {
      const wrapper = mount(STag, {
        props: { content: 'Hidden', open: false },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tag]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('emits update:open when close is clicked', async () => {
      const wrapper = mount(STag, {
        props: { content: 'Closable', closable: true },
        attachTo: document.body
      });

      await wrapper.find('svg').trigger('click');

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')![0]).toEqual([false]);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(STag, {
        props: { content: 'Accessible' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations in the closable state', async () => {
      const wrapper = mount(STag, {
        props: { content: 'Closable', closable: true },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

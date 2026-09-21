import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { VisuallyHidden } from '@vean/aria/visually-hidden';

describe('VisuallyHidden', () => {
  describe('rendering', () => {
    it('renders a span with sr-only styles', () => {
      const wrapper = mount(VisuallyHidden, {
        slots: { default: 'Hidden text for screen readers' },
        attachTo: document.body
      });

      const span = wrapper.get('span');
      expect(span.text()).toBe('Hidden text for screen readers');

      wrapper.unmount();
    });

    it('renders slot content', () => {
      const wrapper = mount(VisuallyHidden, {
        slots: { default: '<button type="button">Hidden button</button>' },
        attachTo: document.body
      });

      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.text()).toBe('Hidden button');

      wrapper.unmount();
    });
  });
});

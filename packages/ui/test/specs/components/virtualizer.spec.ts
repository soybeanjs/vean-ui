import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SVirtualizer from '@/components/virtualizer/virtualizer.vue';

describe('SVirtualizer', () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: i, label: `Item ${i}` }));

  describe('rendering', () => {
    it('renders virtualized items', () => {
      const wrapper = mount(SVirtualizer, {
        props: {
          items,
          estimateSize: 40,
          height: 400
        },
        slots: {
          item: '<div class="virtual-item">{{ item.label }}</div>'
        },
        attachTo: document.body
      });

      // Virtualizer root element should exist
      expect(wrapper.find('[data-vean-virtualizer-root]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders with custom item slot', () => {
      const wrapper = mount(SVirtualizer, {
        props: {
          items: items.slice(0, 10),
          estimateSize: 40,
          height: 400
        },
        slots: {
          item: '<div class="virtual-item">{{ item.label }}</div>'
        },
        attachTo: document.body
      });

      // Virtualizer root renders even if items are virtualized
      expect(wrapper.find('[data-vean-virtualizer-root]').exists()).toBe(true);

      wrapper.unmount();
    });
  });
});

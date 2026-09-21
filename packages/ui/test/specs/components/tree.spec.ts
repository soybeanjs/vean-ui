import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { TreeItem, TreeVirtualizerItem } from '@vean/aria/tree';
import STreeVirtualizer from '@/components/tree/tree-virtualizer.vue';
import STree from '@/components/tree/tree.vue';
import { MockResizeObserver, createMockResizeObserverEntry, delay, setupMock } from '../../shared';
import { getA11yViolations } from '../../shared/a11y';

const treeItems = [
  {
    value: '1',
    label: 'Item 1',
    children: [
      { value: '1-1', label: 'Item 1-1' },
      { value: '1-2', label: 'Item 1-2' }
    ]
  },
  {
    value: '2',
    label: 'Item 2'
  }
];

const toggleSingleItems = [
  { value: 'a', label: 'A', children: [{ value: 'a-1', label: 'A-1' }] },
  { value: 'b', label: 'B', children: [{ value: 'b-1', label: 'B-1' }] }
];

const itemSlot = `
  <template #item="{ item }">
    <TreeItem :value="item.value" :level="item.level">
      <span class="tree-label">{{ item.data.label }}</span>
    </TreeItem>
  </template>
`;

function mountTree(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(STree, {
    props: { items: treeItems, ...props },
    global: { components: { TreeItem } },
    slots: { item: itemSlot, ...slots },
    attachTo: document.body
  });
}

describe('STree', () => {
  describe('rendering', () => {
    it('renders the tree root with items data', () => {
      const wrapper = mountTree();

      expect(wrapper.find('[data-vean-tree-root]').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(2);
      expect(wrapper.find('.tree-label').text()).toBe('Item 1');
      wrapper.unmount();
    });

    it('renders top and bottom slots', () => {
      const wrapper = mountTree({}, { top: '<div data-top>Top</div>', bottom: '<div data-bottom>Bottom</div>' });

      expect(wrapper.find('[data-top]').exists()).toBe(true);
      expect(wrapper.find('[data-bottom]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('renders nested children when default-expanded', () => {
      const wrapper = mountTree({ defaultExpanded: ['1'] });

      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(4);
      expect(wrapper.text()).toContain('Item 1-1');
      expect(wrapper.text()).toContain('Item 1-2');
      wrapper.unmount();
    });

    it('does not leak as / asChild props to the DOM', () => {
      const wrapper = mountTree();
      const html = wrapper.html();

      expect(html).not.toContain('aschild');
      expect(html).not.toMatch(/as="/);
      wrapper.unmount();
    });

    it('passes level and hasChildren to the item slot', () => {
      const wrapper = mount(STree, {
        props: { items: treeItems, defaultExpanded: ['1'] },
        global: { components: { TreeItem } },
        slots: {
          item: `
            <template #item="{ item }">
              <TreeItem :value="item.value" :level="item.level">
                <span class="tree-meta">{{ item.level }}:{{ item.hasChildren }}</span>
              </TreeItem>
            </template>
          `
        },
        attachTo: document.body
      });

      const metas = wrapper.findAll('.tree-meta');

      expect(metas[0].text()).toBe('1:true');
      expect(metas[1].text()).toBe('2:false');
      wrapper.unmount();
    });
  });

  describe('data attributes and aria', () => {
    it('renders the data-vean-tree-item attributes', () => {
      const wrapper = mountTree();
      const item = wrapper.find('[data-vean-tree-item]');

      expect(item.attributes('data-indent')).toBe('1');
      expect(item.attributes('data-expanded')).toBeUndefined();
      expect(item.attributes('data-selected')).toBeUndefined();
      wrapper.unmount();
    });

    it('applies tree roles and aria attributes to the tree', () => {
      const wrapper = mountTree();
      const root = wrapper.find('[data-vean-tree-root]');

      expect(root.attributes('role')).toBe('tree');
      expect(root.attributes('aria-multiselectable')).toBeUndefined();

      const item = wrapper.find('[data-vean-tree-item]');

      expect(item.attributes('role')).toBe('treeitem');
      expect(item.attributes('aria-level')).toBe('1');
      expect(item.attributes('aria-setsize')).toBe('2');
      expect(item.attributes('aria-posinset')).toBe('1');
      wrapper.unmount();
    });

    it('marks the root as multiselectable when multiple is enabled', () => {
      const wrapper = mountTree({ multiple: true });

      expect(wrapper.find('[data-vean-tree-root]').attributes('aria-multiselectable')).toBe('true');
      wrapper.unmount();
    });

    it('sets aria-expanded and data-expanded when a node is expanded', () => {
      const wrapper = mountTree({ defaultExpanded: ['1'] });
      const firstItem = wrapper.findAll('[data-vean-tree-item]')[0];

      expect(firstItem.attributes('aria-expanded')).toBe('true');
      expect(firstItem.attributes('data-expanded')).toBe('');
      wrapper.unmount();
    });

    it('sets aria-selected and data-selected for the selected item', () => {
      const wrapper = mountTree({ modelValue: '2' });
      const items = wrapper.findAll('[data-vean-tree-item]');

      expect(items[0].attributes('aria-selected')).toBe('false');
      expect(items[1].attributes('aria-selected')).toBe('true');
      expect(items[1].attributes('data-selected')).toBe('');
      wrapper.unmount();
    });

    it('has no a11y violations', async () => {
      const wrapper = mountTree({ defaultExpanded: ['1'], modelValue: '2' });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });

  describe('selection', () => {
    it('selects a leaf item on click', async () => {
      const wrapper = mountTree();

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2');
      wrapper.unmount();
    });

    it('toggles the selection off when the selected item is clicked again', async () => {
      const wrapper = mountTree({ modelValue: '2' });

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBeUndefined();
      wrapper.unmount();
    });

    it('keeps multiple items selected in multiple mode', async () => {
      const wrapper = mountTree({ multiple: true, defaultExpanded: ['1'] });

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');
      await wrapper.findAll('[data-vean-tree-item]')[3].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['1-1', '2']);
      wrapper.unmount();
    });

    it('keeps a single value with the replace selection behavior', async () => {
      const wrapper = mountTree({
        multiple: true,
        selectionBehavior: 'replace',
        defaultExpanded: ['1']
      });

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');
      await wrapper.findAll('[data-vean-tree-item]')[3].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['2']);
      wrapper.unmount();
    });

    it('respects a controlled modelValue', async () => {
      const wrapper = mountTree({ modelValue: '2', defaultExpanded: ['1'] });

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('1-1');
      wrapper.unmount();
    });

    it('selects descendants when propagateSelect is enabled', async () => {
      const wrapper = mountTree({ multiple: true, allowParentSelect: true, propagateSelect: true });

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['1', '1-1', '1-2']);
      wrapper.unmount();
    });

    it('selects the parent when all its children are selected with bubbleSelect', async () => {
      const wrapper = mountTree({ multiple: true, bubbleSelect: true, defaultExpanded: ['1'] });

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('click');
      await wrapper.findAll('[data-vean-tree-item]')[2].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['1-1', '1-2', '1']);
      wrapper.unmount();
    });

    it('skips a parent node when allowParentSelect is false', async () => {
      const wrapper = mountTree();

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('expand and collapse', () => {
    it('expands a collapsed node on click', async () => {
      const wrapper = mountTree();

      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(2);

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(4);
      expect(wrapper.findAll('[data-vean-tree-item]')[0].attributes('aria-expanded')).toBe('true');
      wrapper.unmount();
    });

    it('collapses an expanded node on click', async () => {
      const wrapper = mountTree({ defaultExpanded: ['1'] });

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(2);
      expect(wrapper.findAll('[data-vean-tree-item]')[0].attributes('aria-expanded')).toBe('false');
      wrapper.unmount();
    });

    it('collapses previously expanded nodes with the single toggle behavior', async () => {
      const wrapper = mount(STree, {
        props: {
          items: toggleSingleItems,
          toggleBehavior: 'single'
        },
        global: { components: { TreeItem } },
        slots: { item: itemSlot },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');
      expect(wrapper.findAll('[data-vean-tree-item]')[0].attributes('aria-expanded')).toBe('true');

      // 展开 'a' 后可见项为 [a, a-1, b]，点击索引 2 即 'b'
      await wrapper.findAll('[data-vean-tree-item]')[2].trigger('click');
      await nextTick();

      const items = wrapper.findAll('[data-vean-tree-item]');

      expect(items[0].attributes('aria-expanded')).toBe('false');
      expect(items[1].attributes('aria-expanded')).toBe('true');
      wrapper.unmount();
    });

    it('emits update:expanded for a controlled expanded state', async () => {
      const wrapper = mountTree();

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['1']);
      wrapper.unmount();
    });
  });

  describe('disabled', () => {
    it('blocks selection and expansion when the root is disabled', async () => {
      const wrapper = mountTree({ disabled: true });

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('update:expanded')).toBeFalsy();
      expect(wrapper.find('[data-vean-tree-root]').attributes('aria-disabled')).toBe('true');
      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus to the next item with ArrowDown', async () => {
      const wrapper = mountTree();
      const items = wrapper.findAll('[data-vean-tree-item]');

      await items[0].trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(items[1].element);
      wrapper.unmount();
    });

    it('expands a collapsed node with ArrowRight', async () => {
      const wrapper = mountTree();

      await wrapper.findAll('[data-vean-tree-item]')[0].trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.findAll('[data-vean-tree-item]')).toHaveLength(4);
      wrapper.unmount();
    });

    it('moves focus to the parent with ArrowLeft on a collapsed node', async () => {
      const wrapper = mountTree({ defaultExpanded: ['1'] });
      const items = wrapper.findAll('[data-vean-tree-item]');

      await items[1].trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(items[0].element);
      wrapper.unmount();
    });

    it('selects an item with Enter', async () => {
      const wrapper = mountTree();

      await wrapper.findAll('[data-vean-tree-item]')[1].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('2');
      wrapper.unmount();
    });

    it('loops focus from the last item back to the first with the default loop behavior', async () => {
      const wrapper = mountTree();
      const items = wrapper.findAll('[data-vean-tree-item]');

      expect(wrapper.find('[data-vean-tree-root]').attributes('data-loop')).toBe('');

      await items[1].trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(items[0].element);
      wrapper.unmount();
    });
  });
});

describe('STreeVirtualizer', () => {
  const virtualizerItemSlot = `
    <template #item="{ item, virtualItem }">
      <TreeVirtualizerItem :value="item.value" :level="item.level" :data="virtualItem">
        <span class="virtual-label">{{ item.value }}:{{ virtualItem.index }}</span>
      </TreeVirtualizerItem>
    </template>
  `;

  function mountVirtualizer(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    return mount(STreeVirtualizer, {
      props: { items: treeItems, height: '240px', ...props },
      global: { components: { TreeVirtualizerItem } },
      slots: { item: virtualizerItemSlot, ...slots },
      attachTo: document.body
    });
  }

  function setupVirtualizerResizeObserver() {
    class TestResizeObserver extends MockResizeObserver {
      static instance: MockResizeObserver | null = null;

      constructor(callback: ResizeObserverCallback) {
        super(callback);
        TestResizeObserver.instance = this;
      }
    }

    const cleanup = setupMock('ResizeObserver', TestResizeObserver as unknown as typeof ResizeObserver);

    return { getInstance: () => TestResizeObserver.instance, cleanup };
  }

  it('renders virtualized tree items', async () => {
    const { getInstance, cleanup } = setupVirtualizerResizeObserver();
    const wrapper = mountVirtualizer();

    getInstance()?.trigger([
      createMockResizeObserverEntry(wrapper.find('[data-vean-tree-virtualizer-root]').element, {
        width: 224,
        height: 240
      })
    ]);
    await delay(30);
    await nextTick();

    expect(wrapper.find('[data-vean-tree-virtualizer-root]').exists()).toBe(true);
    expect(wrapper.findAll('[data-vean-tree-item]').length).toBeGreaterThan(0);
    wrapper.unmount();
    cleanup();
  });

  it('forwards the loop: true default to the roving focus group', () => {
    // Regression: a pure type-only defineProps would cast the missing Boolean
    // prop to `false`, overriding the Aria TreeRoot `loop: true` default.
    const wrapper = mountVirtualizer();

    expect(wrapper.find('[data-vean-tree-virtualizer-root]').attributes('data-loop')).toBe('');
    wrapper.unmount();
  });

  it('passes virtual item data through the item slot', async () => {
    const { getInstance, cleanup } = setupVirtualizerResizeObserver();
    const wrapper = mountVirtualizer();

    getInstance()?.trigger([
      createMockResizeObserverEntry(wrapper.find('[data-vean-tree-virtualizer-root]').element, {
        width: 224,
        height: 240
      })
    ]);
    await delay(30);
    await nextTick();

    expect(wrapper.find('.virtual-label').text()).toMatch(/^1:/);
    wrapper.unmount();
    cleanup();
  });

  it('renders virtualized items when animated enables dynamic mode', async () => {
    const { getInstance, cleanup } = setupVirtualizerResizeObserver();
    const wrapper = mountVirtualizer({ animated: true });

    getInstance()?.trigger([
      createMockResizeObserverEntry(wrapper.find('[data-vean-tree-virtualizer-root]').element, {
        width: 224,
        height: 240
      })
    ]);
    await delay(30);
    await nextTick();

    expect(wrapper.find('[data-vean-tree-virtualizer-root]').exists()).toBe(true);
    expect(wrapper.findAll('[data-vean-tree-item]').length).toBeGreaterThan(0);
    wrapper.unmount();
    cleanup();
  });

  it('expands a node in the animated virtualizer with virtual item data', async () => {
    const { getInstance, cleanup } = setupVirtualizerResizeObserver();
    const wrapper = mountVirtualizer({ animated: true });

    getInstance()?.trigger([
      createMockResizeObserverEntry(wrapper.find('[data-vean-tree-virtualizer-root]').element, {
        width: 224,
        height: 240
      })
    ]);
    await delay(30);
    await nextTick();

    await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');
    await nextTick();

    const labels = wrapper.findAll('.virtual-label').map(label => label.text());

    expect(labels).toContain('1-1:1');
    expect(labels).toContain('1-2:2');
    expect(labels.every(text => /:\d+$/.test(text))).toBe(true);
    wrapper.unmount();
    cleanup();
  });

  it('collapses a node in the animated virtualizer with virtual item data', async () => {
    const { getInstance, cleanup } = setupVirtualizerResizeObserver();
    const wrapper = mountVirtualizer({ animated: true, defaultExpanded: ['1'] });

    getInstance()?.trigger([
      createMockResizeObserverEntry(wrapper.find('[data-vean-tree-virtualizer-root]').element, {
        width: 224,
        height: 240
      })
    ]);
    await delay(30);
    await nextTick();

    await wrapper.findAll('[data-vean-tree-item]')[0].trigger('click');
    await nextTick();

    const labels = wrapper.findAll('.virtual-label').map(label => label.text());

    expect(labels).not.toContain('1-1:1');
    expect(labels.every(text => /:\d+$/.test(text))).toBe(true);
    wrapper.unmount();
    cleanup();
  });
});

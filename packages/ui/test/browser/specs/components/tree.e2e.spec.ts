import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { isTreeMotionItem, TreeItem, TreeVirtualizerItem } from '@vean/aria/tree';
import type { FlattenedItem, TreeItemData, TreeMotionListItem } from '@vean/aria/tree';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import STreeVirtualizer from '@/components/tree/tree-virtualizer.vue';
import STree from '@/components/tree/tree.vue';

type LabeledTreeItem = TreeItemData<{ value: string; label: string }>;
import type { VirtualItem } from '@tanstack/vue-virtual';

/**
 * Tree e2e — expand/collapse through real pointer clicks on the rendered tree
 * items, including the animated virtualizer whose motion swaps a windowed item
 * range for a height-collapsing block. The motion state machine must always
 * settle back to the plain flattened list, so every case asserts the motion
 * block is gone after the click and the expected items are rendered.
 *
 * Slots render through render functions (no global component registration),
 * reading `item.data.label` for the visible text.
 */

const treeItems: LabeledTreeItem[] = [
  {
    value: '1',
    label: 'Item 1',
    children: [
      { value: '1-1', label: 'Item 1-1' },
      { value: '1-2', label: 'Item 1-2' },
      { value: '1-3', label: 'Item 1-3' },
      { value: '1-4', label: 'Item 1-4' }
    ]
  },
  { value: '2', label: 'Item 2' }
];

const largeTreeItems: LabeledTreeItem[] = [
  {
    value: 'root',
    label: 'Root',
    children: Array.from({ length: 2000 }, (_, index) => ({
      value: `child-${index}`,
      label: `Child ${index}`
    }))
  },
  { value: 'other', label: 'Other' }
];

function treeItemSlot(props: { item: TreeMotionListItem<TreeItemData> }) {
  if (isTreeMotionItem(props.item)) return null;

  const item = props.item;

  return h(
    TreeItem,
    { value: item.value, level: item.level, class: 'px-2 py-1' },
    () => (item.data as LabeledTreeItem).label
  );
}

function virtualizerItemSlot(props: { item: FlattenedItem<TreeItemData>; virtualItem: VirtualItem }) {
  return h(
    TreeVirtualizerItem,
    { value: props.item.value, level: props.item.level, data: props.virtualItem },
    () => (props.item.data as LabeledTreeItem).label
  );
}

const mountOptions = {
  global: { stubs: { transition: false, 'transition-group': false } }
};

async function clickFirstItem(container: HTMLElement) {
  const item = container.querySelectorAll('[data-vean-tree-item]')[0] as HTMLElement;

  await userEvent.click(item);
}

async function waitForSettled(container: HTMLElement, options: { childVisible?: string } = {}) {
  await new Promise(resolve => setTimeout(resolve, 50));

  await vi.waitFor(
    () => {
      expect(container.querySelector('[data-vean-tree-motion]')).toBeNull();

      if (options.childVisible) {
        expect(container.textContent).toContain(options.childVisible);
      }
    },
    { timeout: 3000, interval: 25 }
  );
}

describe('STree (e2e)', () => {
  it('expands and collapses a node by click and settles out of motion', async () => {
    const wrapper = await render(STree, {
      props: { items: treeItems },
      slots: { item: treeItemSlot },
      ...mountOptions
    });
    const container = wrapper.container as HTMLElement;

    await clickFirstItem(container);
    await waitForSettled(container, { childVisible: 'Item 1-1' });
    expect(container.querySelectorAll('[data-vean-tree-item]').length).toBe(6);

    await clickFirstItem(container);
    await waitForSettled(container);
    expect(container.querySelectorAll('[data-vean-tree-item]').length).toBe(2);

    wrapper.unmount();
  });
});

describe('STreeVirtualizer (e2e)', () => {
  it('expands and collapses in the animated virtualizer by click', async () => {
    const wrapper = await render(STreeVirtualizer, {
      props: { items: treeItems, height: '240px', animated: true },
      slots: { item: virtualizerItemSlot },
      ...mountOptions
    });
    const container = wrapper.container as HTMLElement;

    await clickFirstItem(container);
    await waitForSettled(container, { childVisible: 'Item 1-1' });
    expect(container.querySelectorAll('[data-vean-tree-item]').length).toBeGreaterThan(2);
    // The windowed item keys survive the motion swap, so the clicked element
    // must keep DOM focus instead of being rebuilt (focus ring stays).
    expect(container.contains(document.activeElement)).toBe(true);

    await clickFirstItem(container);
    await waitForSettled(container);
    expect(container.textContent).not.toContain('Item 1-1');

    wrapper.unmount();
  });

  it('expands a 2000-children node in the animated virtualizer by click', async () => {
    const wrapper = await render(STreeVirtualizer, {
      props: { items: largeTreeItems, height: '240px', animated: true },
      slots: { item: virtualizerItemSlot },
      ...mountOptions
    });
    const container = wrapper.container as HTMLElement;

    await clickFirstItem(container);
    await waitForSettled(container, { childVisible: 'Child 0' });

    // Windowed rendering must keep the mounted item count near the viewport
    // size, not the full 2002-item flattened list.
    const rendered = container.querySelectorAll('[data-vean-tree-item]').length;

    expect(rendered).toBeGreaterThan(1);
    expect(rendered).toBeLessThan(100);

    wrapper.unmount();
  });
});

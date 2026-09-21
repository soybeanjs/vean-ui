import { Fragment, cloneVNode } from 'vue';
import type { VNode } from 'vue';
import type { Virtualizer } from '@tanstack/vue-virtual';
import type { ListboxVirtualizerSlots } from './types';

export function getVirtualizerPadding(parentElement?: HTMLElement | null) {
  if (!parentElement) {
    return { start: 0, end: 0 };
  }

  const { paddingBlockStart, paddingTop, paddingBlockEnd, paddingBottom } = window.getComputedStyle(parentElement);

  return {
    start: Number.parseFloat(paddingBlockStart || paddingTop),
    end: Number.parseFloat(paddingBlockEnd || paddingBottom)
  };
}

export function getVirtualizerItems(
  virtualizer: Virtualizer<HTMLElement, Element>,
  options: string[],
  defaultSlot: ListboxVirtualizerSlots['default']
) {
  return virtualizer.getVirtualItems().map(item => {
    const defaultNode = defaultSlot({
      option: options[item.index],
      virtualizer,
      virtualItem: item
    })[0] as VNode;

    const targetNode =
      defaultNode.type === Fragment && Array.isArray(defaultNode.children)
        ? (defaultNode.children[0] as VNode)
        : defaultNode;

    return {
      item,
      is: cloneVNode(targetNode, {
        key: `${item.key}`,
        'data-index': item.index,
        'aria-setsize': options.length,
        'aria-posinset': item.index + 1,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translateY(${item.start}px)`,
          overflowAnchor: 'none'
        }
      })
    };
  });
}

export function queryCheckedElement(parentElement?: HTMLElement | null) {
  return parentElement?.querySelector('[data-state=checked]') as HTMLElement | null;
}
